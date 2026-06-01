namespace DeskBoost.API.Contracts.Responses;

/// <summary>Response cho /api/my-plants (checklist format)</summary>
public record MyPlantResponse(
    Guid Id,
    string Name,
    string? Species,
    string? Location,
    string? ImageUrl,
    string Status,      // "healthy" | "needs-water" | "issue" | "active" | "inactive" | "archived"
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

/// <summary>Response cho /api/marketplace-items</summary>
public record MarketplaceItemResponse(
    Guid Id,
    string Name,
    string? Description,
    string Category,
    string? ImageUrl,
    string? PriceText,
    string? ContactUrl,
    string? CareLevel,
    string? Light,
    string? Water,
    string? AttributesJson);
