namespace DeskBoost.Application.Common.Models;

public record MyPlantDto(
    Guid Id,
    Guid? MarketplaceItemId,
    Guid? ClaimCodeId,
    string Name,
    string? Nickname,
    string? Species,
    Guid? PlantSpeciesId,
    string? Location,
    string? ImageUrl,
    string Status,
    string? CareLevel,
    string? Light,
    string? Water,
    string LastCondition,
    int WateringCycleDays,
    string? Notes,
    string? OwnershipCode,
    string OwnershipStatus,
    bool IsClaimed,
    DateTime? ClaimedAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record ClaimPreviewDto(
    bool Valid,
    string CodeStatus,
    ClaimPreviewItemDto? MarketplaceItem
);

public record ClaimPreviewItemDto(
    Guid Id,
    string Name,
    string? Description,
    string Category,
    string? ImageUrl,
    string? CareLevel,
    string? Light,
    string? Water
);
