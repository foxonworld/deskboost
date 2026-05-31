namespace DeskBoost.Application.Common.Models;

public record AiDialogListItemDto(
    Guid Id,
    Guid? PlantId,
    string? PlantName,
    string Title,
    string LastMessage,
    DateTime CreatedAt
);

public record AiDialogDetailDto(
    Guid Id,
    Guid? PlantId,
    string? PlantName,
    string Title,
    IReadOnlyList<AiMessageDto> Messages,
    DateTime CreatedAt
);

public record AiMessageDto(
    Guid Id,
    string Role,
    string Content,
    DateTime CreatedAt
);

public record AiChatResponseDto(
    Guid DialogId,
    Guid? PlantId,
    string Reply,
    string Disclaimer,
    DateTime CreatedAt
);
