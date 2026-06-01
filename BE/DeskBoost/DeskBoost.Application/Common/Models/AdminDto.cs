namespace DeskBoost.Application.Common.Models;

public record AdminSummaryDto(
    int Users,
    int UserPlants,
    int MarketplaceItems,
    int AiDialogs,
    bool AiConfigured
);

public record AdminUserDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    string Status,
    string? AvatarUrl,
    string? Phone,
    DateTime CreatedAt
);

public record AdminUserPlantDto(
    Guid Id,
    Guid UserId,
    string UserEmail,
    Guid? MarketplaceItemId,
    string? MarketplaceItemName,
    Guid? ClaimCodeId,
    string? ClaimCode,
    string Name,
    string? Nickname,
    string? Species,
    string? Location,
    string Status,
    string? CareLevel,
    string? Light,
    string? Water,
    string? Notes,
    string? OwnershipCode,
    string OwnershipStatus,
    bool IsClaimed,
    DateTime? ClaimedAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record AdminPlantInventoryDto(
    Guid Id,
    Guid? MarketplaceItemId,
    Guid? PlantSpeciesId,
    string Name,
    string? SpeciesName,
    string? ImageUrl,
    string? Location,
    int WateringCycleDays,
    string? Notes,
    string? OwnershipCode,
    string OwnershipStatus,
    bool IsClaimed,
    DateTime? ClaimedAt,
    Guid? UserId,
    string? UserEmail,
    string? QrClaimUrl,
    Guid? ClaimCodeId,
    string? ClaimCodeStatus,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record AdminAiConfigStatusDto(
    string Provider,
    bool Configured,
    DateTime LastCheckedAt
);
