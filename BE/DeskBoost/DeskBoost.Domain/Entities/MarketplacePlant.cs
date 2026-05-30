using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class MarketplacePlant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? PriceText { get; set; }
    public string? CareLevel { get; set; }   // easy | medium | hard
    public string? Light { get; set; }
    public string? Water { get; set; }
    public string? ContactUrl { get; set; }
    public MarketplaceStatus Status { get; set; } = MarketplaceStatus.Active;
}
