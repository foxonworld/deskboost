using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.AiChat.Commands;

public class SendChatMessageCommandHandler : IRequestHandler<SendChatMessageCommand, ChatMessageResponse>
{
    private readonly IAppDbContext _db;
    private readonly IAiChatService _aiChat;

    public SendChatMessageCommandHandler(IAppDbContext db, IAiChatService aiChat)
    {
        _db = db;
        _aiChat = aiChat;
    }

    public async Task<ChatMessageResponse> Handle(SendChatMessageCommand request, CancellationToken cancellationToken)
    {
        string systemPrompt;
        List<ChatHistory> history = [];

        if (request.PlantId.HasValue)
        {
            // Chat có ngữ cảnh cây cụ thể
            var plant = await _db.Plants
                .Include(p => p.Species)
                .FirstOrDefaultAsync(p => p.Id == request.PlantId.Value, cancellationToken)
                ?? throw new InvalidOperationException($"Không tìm thấy cây với ID {request.PlantId}");

            var lastDiagnosis = await _db.DiagnosisResults
                .Where(d => d.PlantId == request.PlantId.Value)
                .OrderByDescending(d => d.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (request.UserId.HasValue)
            {
                history = await _db.ChatHistories
                    .Where(h => h.PlantId == request.PlantId.Value && h.UserId == request.UserId.Value)
                    .OrderByDescending(h => h.CreatedAt)
                    .Take(10)
                    .OrderBy(h => h.CreatedAt)
                    .ToListAsync(cancellationToken);
            }

            systemPrompt = BuildPlantSystemPrompt(plant, plant.Species, lastDiagnosis);
        }
        else
        {
            // Chat không có ngữ cảnh cây — hỏi chung về chăm sóc cây
            systemPrompt = BuildGenericSystemPrompt();
        }

        var assistantContent = await _aiChat.SendMessageAsync(
            request.Message,
            systemPrompt,
            history,
            cancellationToken);

        if (string.IsNullOrWhiteSpace(assistantContent))
            assistantContent = "Không đủ dữ liệu để đưa ra kết luận. Vui lòng thử lại hoặc chụp ảnh cây để chẩn đoán.";

        // Chỉ lưu history khi có đầy đủ plantId + userId
        if (request.PlantId.HasValue && request.UserId.HasValue)
        {
            _db.ChatHistories.Add(new ChatHistory
            {
                PlantId = request.PlantId.Value,
                UserId = request.UserId.Value,
                Role = "user",
                Content = request.Message
            });
            _db.ChatHistories.Add(new ChatHistory
            {
                PlantId = request.PlantId.Value,
                UserId = request.UserId.Value,
                Role = "assistant",
                Content = assistantContent
            });
            await _db.SaveChangesAsync(cancellationToken);
        }

        return new ChatMessageResponse(assistantContent);
    }

    private static string BuildPlantSystemPrompt(Plant plant, PlantSpecies species, DiagnosisResult? lastDiagnosis)
    {
        var diagnosisSection = BuildDiagnosisSection(lastDiagnosis);

        return $"""
            Bạn là trợ lý chăm sóc cây trồng.

            Quy tắc bắt buộc:
            - KHÔNG tự chẩn đoán bệnh. Chỉ dựa trên kết quả từ Plant.id được cung cấp bên dưới.
            - Nếu user hỏi bệnh gì, hãy trích dẫn kết quả Plant.id, không tự suy luận.
            - KHÔNG tư vấn thuốc hóa học nguy hiểm hoặc thuốc diệt cỏ.
            - KHÔNG trả lời bất kỳ chủ đề nào ngoài cây trồng và chăm sóc cây. Từ chối lịch sự.
            - Nếu không đủ thông tin, trả lời: "Không đủ dữ liệu để đưa ra kết luận."

            Thông tin cây:
            - Tên: {plant.Name} ({species.VietnameseName})
            - Vị trí đặt: {plant.Location ?? "không rõ"}
            - Chu kỳ tưới: mỗi {plant.WateringCycleDays} ngày
            - Hướng dẫn chăm sóc: {species.CareInstructions ?? "không có"}

            {diagnosisSection}
            """;
    }

    private static string BuildGenericSystemPrompt() =>
        """
        Bạn là trợ lý chăm sóc cây trồng.

        Quy tắc bắt buộc:
        - KHÔNG tự chẩn đoán bệnh từ mô tả. Chỉ đưa ra gợi ý chung và khuyên người dùng chụp ảnh để chẩn đoán chính xác.
        - KHÔNG tư vấn thuốc hóa học nguy hiểm hoặc thuốc diệt cỏ.
        - KHÔNG trả lời bất kỳ chủ đề nào ngoài cây trồng và chăm sóc cây. Từ chối lịch sự.
        - Nếu không đủ thông tin, trả lời: "Không đủ dữ liệu để đưa ra kết luận. Vui lòng chụp ảnh cây để chẩn đoán."
        """;

    private static string BuildDiagnosisSection(DiagnosisResult? d)
    {
        if (d is null)
            return "Kết quả Plant.id: Chưa có chẩn đoán nào.";

        if (d.Confidence < 0.5)
            return $"""
                Kết quả Plant.id (độ tin cậy thấp - {d.Confidence:P0}):
                Tình trạng: {d.Condition}
                Lưu ý: Kết quả chưa đủ tin cậy. Chỉ đưa ra gợi ý chung, không giải thích sâu về bệnh cụ thể.
                """;

        var diseases = ParseJsonArray(d.DiseasesJson);
        var diseaseList = diseases.Count > 0 ? string.Join(", ", diseases) : "không xác định";

        return $"""
            Kết quả Plant.id (độ tin cậy: {d.Confidence:P0}):
            - Tình trạng: {d.Condition}
            - Bệnh phát hiện: {diseaseList}
            Khi giải thích, hãy dẫn nguồn: "Theo kết quả từ Plant.id, cây có dấu hiệu {diseaseList}."
            """;
    }

    private static List<string> ParseJsonArray(string json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}
