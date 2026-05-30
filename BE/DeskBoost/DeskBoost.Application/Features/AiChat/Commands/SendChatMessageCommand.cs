using MediatR;

namespace DeskBoost.Application.Features.AiChat.Commands;

public record SendChatMessageCommand : IRequest<ChatMessageResponse>
{
    public Guid? PlantId { get; init; }
    public Guid? UserId { get; init; }
    public string Message { get; init; } = "";
}

public record ChatMessageResponse(string Content);
