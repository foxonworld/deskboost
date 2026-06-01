using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class PlantClaimCode : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public Guid MarketplaceItemId { get; set; }
    public Guid? PlantId { get; set; }
    public PlantClaimCodeStatus Status { get; set; } = PlantClaimCodeStatus.Unclaimed;
    public string? BuyerContact { get; set; }
    public string? Note { get; set; }
    public Guid? ClaimedByUserId { get; set; }
    public Guid? ClaimedPlantId { get; set; }
    public DateTime? ClaimedAt { get; set; }

    public MarketplaceItem? MarketplaceItem { get; set; }
    public Plant? Plant { get; set; }
}
