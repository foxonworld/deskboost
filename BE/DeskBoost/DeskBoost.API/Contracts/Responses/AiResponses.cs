namespace DeskBoost.API.Contracts.Responses;

public record AiChatResponse(
    Guid DialogId,
    Guid? PlantId,
    string Reply,
    string Disclaimer,
    DateTime CreatedAt);

public record AiDialogListResponse(
    Guid Id,
    Guid? PlantId,
    string? PlantName,
    string Title,
    string LastMessage,
    DateTime CreatedAt);

public record AiDialogDetailResponse(
    Guid Id,
    Guid? PlantId,
    string? PlantName,
    string Title,
    IReadOnlyList<AiMessageResponse> Messages,
    DateTime CreatedAt);

public record AiMessageResponse(
    Guid Id,
    string Role,    // "user" | "assistant"
    string Content,
    DateTime CreatedAt);
