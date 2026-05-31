namespace DeskBoost.Application.Common.Models;

public record MarketplacePlantDto(
    Guid Id,
    string Name,
    string? Description,
    string? ImageUrl,
    string? PriceText,
    string? CareLevel,
    string? Light,
    string? Water,
    string? ContactUrl,
    string Status
);
