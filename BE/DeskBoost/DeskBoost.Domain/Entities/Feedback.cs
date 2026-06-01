namespace DeskBoost.Domain.Entities;

public class Feedback : BaseEntity
{
    public Guid? MarketplaceItemId { get; set; }
    public string? CustomerAlias { get; set; }
    public int? Rating { get; set; }
    public string? Comment { get; set; }
    public string? PurchaseChannel { get; set; }
    public string? PublicImageUrlsJson { get; set; }
    public string? EvidenceImageUrlsJson { get; set; }
    public string? EvidenceNote { get; set; }
    public bool IsVerified { get; set; } = false;
    public DateTime? VerifiedAt { get; set; }
    public string SourceType { get; set; } = "user";
    public Guid? CreatedByAdminId { get; set; }

    public MarketplaceItem? MarketplaceItem { get; set; }
}
