using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace DeskBoost.Application.Features.AiDialogs.Commands;

public class SendAiChatCommandHandler : IRequestHandler<SendAiChatCommand, AiChatResponseDto>
{
    private readonly IAppDbContext _db;
    private readonly IAiChatService _aiChat;
    private readonly IAiQuotaService _quotaService;

    public SendAiChatCommandHandler(IAppDbContext db, IAiChatService aiChat, IAiQuotaService quotaService)
    {
        _db = db;
        _aiChat = aiChat;
        _quotaService = quotaService;
    }

    public async Task<AiChatResponseDto> Handle(SendAiChatCommand request, CancellationToken ct)
    {
        // Enforce quota trước khi xử lý
        await _quotaService.EnforceQuotaAsync(request.UserId, AiFeature.Chat, ct);

        if (request.PlantId.HasValue)
        {
            var plantBelongsToUser = await _db.Plants
                .AnyAsync(p => p.Id == request.PlantId.Value && p.UserId == request.UserId, ct);
            if (!plantBelongsToUser)
                throw new InvalidOperationException("Không tìm thấy cây hoặc cây không thuộc người dùng này.");
        }

        // Load diagnosis context nếu có diagnosisResultId
        DiagnosisResult? diagnosis = null;
        if (request.DiagnosisResultId.HasValue)
        {
            diagnosis = await _db.DiagnosisResults
                .FirstOrDefaultAsync(d => d.Id == request.DiagnosisResultId.Value, ct);

            if (diagnosis is null)
                throw new InvalidOperationException("Không tìm thấy kết quả chẩn đoán.");

            // Validate ownership: thuộc user hoặc thuộc cây của user
            var ownedByUser = diagnosis.UserId == request.UserId;
            var ownedViaPlant = diagnosis.PlantId.HasValue &&
                await _db.Plants.AnyAsync(p => p.Id == diagnosis.PlantId.Value && p.UserId == request.UserId, ct);

            if (!ownedByUser && !ownedViaPlant)
                throw new InvalidOperationException("Kết quả chẩn đoán không thuộc người dùng này.");
        }

        AiDialog? dialog = null;
        if (request.PlantId.HasValue)
        {
            dialog = await _db.AiDialogs
                .Include(d => d.Messages)
                .Where(d => d.UserId == request.UserId && d.PlantId == request.PlantId)
                .OrderByDescending(d => d.CreatedAt)
                .FirstOrDefaultAsync(ct);
        }

        if (dialog is null)
        {
            dialog = new AiDialog
            {
                UserId = request.UserId,
                PlantId = request.PlantId,
                Title = TruncateTitle(request.Message),
                LastMessage = request.Message
            };
            _db.AiDialogs.Add(dialog);
            await _db.SaveChangesAsync(ct);
            dialog.Messages = new List<AiMessage>();
        }

        var historyForAi = dialog.Messages
            .OrderBy(m => m.CreatedAt)
            .Take(20)
            .Select(m => new ChatHistory { Role = m.Role.ToApiString(), Content = m.Content })
            .ToList();

        if (historyForAi.Count == 0 && request.History.Count > 0)
        {
            historyForAi = request.History
                .Select(h => new ChatHistory { Role = h.Role, Content = h.Content })
                .ToList();
        }

        var systemPrompt = BuildSystemPrompt(request.PlantContext, diagnosis);
        var reply = await _aiChat.SendMessageAsync(request.Message, systemPrompt, historyForAi, ct);
        if (string.IsNullOrWhiteSpace(reply))
            reply = "Không đủ dữ liệu để đưa ra kết luận. Vui lòng thử lại.";

        _db.AiMessages.Add(new AiMessage { DialogId = dialog.Id, Role = MessageRole.User, Content = request.Message });
        _db.AiMessages.Add(new AiMessage { DialogId = dialog.Id, Role = MessageRole.Assistant, Content = reply });

        dialog.LastMessage = reply;
        dialog.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        // Ghi usage sau khi thành công
        await _quotaService.RecordUsageAsync(request.UserId, AiFeature.Chat, request.PlantId, request.DiagnosisResultId, ct);

        return new AiChatResponseDto(dialog.Id, request.PlantId, reply, "AI advice is for reference only.", DateTime.UtcNow);
    }

    private static string BuildSystemPrompt(PlantContextDto? ctx, DiagnosisResult? diagnosis)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Bạn là trợ lý chăm sóc cây trồng.");
        sb.AppendLine("Chỉ tư vấn về cây trồng. Từ chối các chủ đề khác.");

        if (diagnosis is not null)
        {
            var diseases = TryDeserialize(diagnosis.DiseasesJson);
            var causes = TryDeserialize(diagnosis.CausesJson);
            var treatments = TryDeserialize(diagnosis.TreatmentsJson);

            sb.AppendLine();
            sb.AppendLine("Kết quả chẩn đoán ảnh cây vừa thực hiện:");
            sb.AppendLine($"- Tình trạng: {diagnosis.Condition}");
            if (diseases.Length > 0) sb.AppendLine($"- Bệnh phát hiện: {string.Join(", ", diseases)}");
            if (causes.Length > 0) sb.AppendLine($"- Nguyên nhân: {string.Join(", ", causes)}");
            if (treatments.Length > 0) sb.AppendLine($"- Hướng xử lý: {string.Join(", ", treatments)}");
            sb.AppendLine($"- Độ tin cậy: {diagnosis.Confidence:P0}");
            sb.AppendLine();
            sb.AppendLine("Hãy tư vấn chi tiết dựa trên kết quả chẩn đoán trên khi người dùng hỏi.");
        }

        if (ctx is not null)
        {
            sb.AppendLine();
            sb.AppendLine("Thông tin cây của người dùng:");
            sb.AppendLine($"- Tên: {ctx.Nickname ?? ctx.Name ?? "không rõ"}");
            sb.AppendLine($"- Loài: {ctx.Species ?? "không rõ"}");
            sb.AppendLine($"- Tình trạng: {ctx.Status ?? "không rõ"}");
            sb.AppendLine($"- Ánh sáng: {ctx.Light ?? "không rõ"}");
            sb.AppendLine($"- Tưới nước: {ctx.Water ?? "không rõ"}");
            sb.AppendLine($"- Ghi chú: {ctx.Notes ?? "không có"}");
        }

        sb.AppendLine();
        sb.AppendLine("Quy tắc: Không tư vấn hóa chất nguy hiểm. Khuyên chụp ảnh nếu cần chẩn đoán bệnh.");

        return sb.ToString();
    }

    private static string[] TryDeserialize(string json)
    {
        try { return JsonSerializer.Deserialize<string[]>(json) ?? []; }
        catch { return []; }
    }

    private static string TruncateTitle(string message) =>
        message.Length <= 80 ? message : message[..80] + "…";
}
