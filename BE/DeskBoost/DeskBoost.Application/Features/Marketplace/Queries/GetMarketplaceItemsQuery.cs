using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetMarketplaceItemsQuery(int Page = 1, int Limit = 12, bool IncludeAll = false, string? Category = null) : IRequest<MarketplaceItemsListDto>;

public static class MarketplacePagination
{
    public const int MaxLimit = 100;

    public static bool IsValid(int page, int limit) =>
        page >= 1 && limit >= 1 && limit <= MaxLimit;
}

public record MarketplaceItemsListDto(IReadOnlyList<MarketplaceItemDto> Items, PaginationDto Pagination);
public record PaginationDto(int Page, int Limit, int Total, int TotalPages);
