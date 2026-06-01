namespace DeskBoost.Application.Common.Models;

public record MarketplaceItemDto(
    Guid Id,
    string Name,
    string? Description,
    string Category,
    string? ImageUrl,
    string? PriceText,
    string? ContactUrl,
    string Status,
    string? CareLevel,
    string? Light,
    string? Water,
    string? AttributesJson
);
