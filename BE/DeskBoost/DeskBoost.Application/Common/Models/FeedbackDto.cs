namespace DeskBoost.Application.Common.Models;

public record FeedbackDto(
    Guid Id,
    Guid UserId,
    string? UserName,
    string Message,
    int? Rating,
    bool IsVerified,
    Guid? CatalogPlantId,
    DateTime? VerifiedAt,
    DateTime CreatedAt
);
