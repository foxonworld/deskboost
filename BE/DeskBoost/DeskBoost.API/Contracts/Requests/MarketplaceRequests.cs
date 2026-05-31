namespace DeskBoost.API.Contracts.Requests;

public class MarketplacePlantUpsertRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? PriceText { get; set; }
    public string? CareLevel { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public string? ContactUrl { get; set; }
    public string Status { get; set; } = "active";
}
