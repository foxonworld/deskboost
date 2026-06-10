namespace DeskBoost.Domain.Entities;

public class MarketplaceItemImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MarketplaceItemId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public MarketplaceItem MarketplaceItem { get; set; } = null!;
}
