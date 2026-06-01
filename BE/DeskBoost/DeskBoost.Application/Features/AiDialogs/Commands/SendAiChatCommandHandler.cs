using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.AiDialogs.Commands;

public class SendAiChatCommandHandler : IRequestHandler<SendAiChatCommand, AiChatResponseDto>
{
    private readonly IAppDbContext _db;
    private readonly IAiChatService _aiChat;

    public SendAiChatCommandHandler(IAppDbContext db, IAiChatService aiChat)
    {
        _db = db;
        _aiChat = aiChat;
    }

    public async Task<AiChatResponseDto> Handle(SendAiChatCommand request, CancellationToken ct)
    {
        if (request.PlantId.HasValue)
        {
            var plantBelongsToUser = await _db.Plants
                .AnyAsync(p => p.Id == request.PlantId.Value && p.UserId == request.UserId, ct);
            if (!plantBelongsToUser)
                throw new InvalidOperationException("Không tìm thấy cây hoặc cây không thuộc người dùng này.");
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

        // Chuyển AiMessages → ChatHistory để IAiChatService sử dụng
        var historyForAi = dialog.Messages
            .OrderBy(m => m.CreatedAt)
            .Take(20)
            .Select(m => new ChatHistory { Role = m.Role.ToApiString(), Content = m.Content })
            .ToList();

        // Nếu dialog trống, dùng history từ client
        if (historyForAi.Count == 0 && request.History.Count > 0)
        {
            historyForAi = request.History
                .Select(h => new ChatHistory { Role = h.Role, Content = h.Content })
                .ToList();
        }

        var systemPrompt = BuildSystemPrompt(request.PlantContext);
        var reply = await _aiChat.SendMessageAsync(request.Message, systemPrompt, historyForAi, ct);
        if (string.IsNullOrWhiteSpace(reply))
            reply = "Không đủ dữ liệu để đưa ra kết luận. Vui lòng thử lại.";

        _db.AiMessages.Add(new AiMessage { DialogId = dialog.Id, Role = MessageRole.User, Content = request.Message });
        _db.AiMessages.Add(new AiMessage { DialogId = dialog.Id, Role = MessageRole.Assistant, Content = reply });

        dialog.LastMessage = reply;
        dialog.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AiChatResponseDto(dialog.Id, request.PlantId, reply, "AI advice is for reference only.", DateTime.UtcNow);
    }

    private static string BuildSystemPrompt(PlantContextDto? ctx)
    {
        if (ctx is null)
            return "Bạn là trợ lý chăm sóc cây trồng. Chỉ tư vấn về cây trồng. Từ chối các chủ đề khác.";

        return $"""
            Bạn là trợ lý chăm sóc cây trồng.

            Thông tin cây của người dùng:
            - Tên: {ctx.Nickname ?? ctx.Name ?? "không rõ"}
            - Loài: {ctx.Species ?? "không rõ"}
            - Tình trạng: {ctx.Status ?? "không rõ"}
            - Ánh sáng: {ctx.Light ?? "không rõ"}
            - Tưới nước: {ctx.Water ?? "không rõ"}
            - Ghi chú: {ctx.Notes ?? "không có"}

            Quy tắc:
            - Chỉ tư vấn về chăm sóc cây trồng.
            - Không tự chẩn đoán bệnh từ mô tả. Khuyên chụp ảnh nếu cần chẩn đoán.
            - Không tư vấn hóa chất nguy hiểm.
            - Từ chối các chủ đề không liên quan đến cây trồng.
            """;
    }

    private static string TruncateTitle(string message) =>
        message.Length <= 80 ? message : message[..80] + "…";
}
