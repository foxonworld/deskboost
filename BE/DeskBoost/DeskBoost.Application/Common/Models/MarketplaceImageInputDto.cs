namespace DeskBoost.Application.Common.Models;

public record MarketplaceImageInputDto(string ImageUrl, int SortOrder = 0, bool IsPrimary = false);
