namespace DeskBoost.Application.Common.Models;

public record FeedbackDto(
    Guid Id,
    Guid? MarketplaceItemId,
    string? CustomerAlias,
    int? Rating,
    string? Comment,
    string? PurchaseChannel,
    List<string>? PublicImageUrls,
    bool IsVerified,
    DateTime? VerifiedAt,
    DateTime CreatedAt
);

public record AdminFeedbackDto(
    Guid Id,
    Guid? MarketplaceItemId,
    string? CustomerAlias,
    int? Rating,
    string? Comment,
    string? PurchaseChannel,
    List<string>? PublicImageUrls,
    List<string>? EvidenceImageUrls,
    string? EvidenceNote,
    bool IsVerified,
    DateTime? VerifiedAt,
    string SourceType,
    Guid? CreatedByAdminId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
