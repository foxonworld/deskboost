using DeskBoost.Domain.Entities;

namespace DeskBoost.Application.Common.Interfaces;

public interface IAiChatService
{
    Task<string> SendMessageAsync(
        string userMessage,
        string systemPrompt,
        IReadOnlyList<ChatHistory> history,
        CancellationToken ct = default);
}
