using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class MarketplaceItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public MarketplaceCategory Category { get; set; } = MarketplaceCategory.Plant;
    public string? ImageUrl { get; set; }
    public string? PriceText { get; set; }
    public string? ContactUrl { get; set; }
    public MarketplaceStatus Status { get; set; } = MarketplaceStatus.Active;
    public string? CareLevel { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public string? AttributesJson { get; set; }
}
