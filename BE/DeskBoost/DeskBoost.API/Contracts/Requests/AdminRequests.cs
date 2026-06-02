namespace DeskBoost.API.Contracts.Requests;

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class UpdatePlantClaimCodeRequest
{
    public string? BuyerContact { get; set; }
    public string? Note { get; set; }
}

public class VerifyFeedbackRequest
{
    public bool IsVerified { get; set; }
}

public class AdminFeedbackUpsertRequest
{
    public Guid? MarketplaceItemId { get; set; }
    public string? CustomerAlias { get; set; }
    public int? Rating { get; set; }
    public string? Comment { get; set; }
    public string? PurchaseChannel { get; set; }
    public List<string>? PublicImageUrls { get; set; }
    public List<string>? EvidenceImageUrls { get; set; }
    public string? EvidenceNote { get; set; }
    public bool IsVerified { get; set; } = false;
}

public class PlantInventoryUpsertRequest
{
    public Guid MarketplaceItemId { get; set; }
    public Guid? PlantSpeciesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? SpeciesName { get; set; }
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public string? CareLevel { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public string? Notes { get; set; }
}
