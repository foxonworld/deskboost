namespace DeskBoost.API.Contracts.Requests;

public class MarketplaceItemUpsertRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    // Nullable so that missing fields in a partial PUT don't overwrite existing DB values.
    // POST handler should validate non-null before sending to CreateMarketplaceItemCommand.
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public string? PriceText { get; set; }
    public string? ContactUrl { get; set; }
    public string? Status { get; set; }
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
