namespace DeskBoost.Application.Common.Models;

public record MarketplaceItemImageDto(
    Guid Id,
    string ImageUrl,
    int SortOrder,
    bool IsPrimary
);
