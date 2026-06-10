namespace DeskBoost.API.Contracts.Requests;

public class MarketplaceItemUpsertRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = "plant";
    public string? ImageUrl { get; set; }
    public string? PriceText { get; set; }
    public string? ContactUrl { get; set; }
    public string Status { get; set; } = "active";
    public string? CareLevel { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public string? AttributesJson { get; set; }
    public List<MarketplaceImageInputRequest>? Images { get; set; }
}

public class MarketplaceImageInputRequest
{
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }
}
