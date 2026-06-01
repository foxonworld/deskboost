namespace DeskBoost.Application.Common.Models;

public record PlantClaimCodeDto(
    Guid Id,
    string Code,
    Guid MarketplaceItemId,
    string MarketplaceItemName,
    Guid? PlantId,
    string Status,
    string? BuyerContact,
    string? Note,
    Guid? ClaimedByUserId,
    string? ClaimedByEmail,
    Guid? ClaimedPlantId,
    DateTime? ClaimedAt,
    DateTime CreatedAt
);
