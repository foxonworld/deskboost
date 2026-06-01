using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class Plant : BaseEntity
{
    public Guid? UserId { get; set; }              // null = unclaimed / in inventory
    public Guid? MarketplaceItemId { get; set; }    // source marketplace listing
    public Guid? ClaimCodeId { get; set; }          // FK to PlantClaimCode (new claim system)
    public Guid? PlantSpeciesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Nickname { get; set; }
    public string? SpeciesName { get; set; }
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public string? CareLevel { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public PlantCondition LastCondition { get; set; } = PlantCondition.Healthy;
    public PlantStatus Status { get; set; } = PlantStatus.Healthy;
    public string? Notes { get; set; }

    // Ownership / QR / Claim
    public string? OwnershipCode { get; set; }
    public OwnershipStatus OwnershipStatus { get; set; } = OwnershipStatus.Unclaimed;
    public bool IsClaimed { get; set; } = false;
    public DateTime? ClaimedAt { get; set; }

    public MarketplaceItem? MarketplaceListing { get; set; }
    public PlantSpecies? Species { get; set; }
}
