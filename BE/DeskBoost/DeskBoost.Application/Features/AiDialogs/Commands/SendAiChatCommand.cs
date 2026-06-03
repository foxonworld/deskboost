using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiDialogs.Commands;

public record ChatHistoryItem(string Role, string Content);

public record PlantContextDto(
    string? Id,
    string? Nickname,
    string? Name,
    string? Species,
    string? Status,
    string? Light,
    string? Water,
    string? Notes
);

public record SendAiChatCommand : IRequest<AiChatResponseDto>
{
    public Guid UserId { get; init; }
    public Guid? PlantId { get; init; }
    public Guid? DiagnosisResultId { get; init; }
    public string Message { get; init; } = string.Empty;
    public IReadOnlyList<ChatHistoryItem> History { get; init; } = [];
    public PlantContextDto? PlantContext { get; init; }
}
