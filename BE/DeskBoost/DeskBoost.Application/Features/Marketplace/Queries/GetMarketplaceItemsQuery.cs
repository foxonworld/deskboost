using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetMarketplaceItemsQuery(int Page = 1, int Limit = 12, bool IncludeAll = false, string? Category = null) : IRequest<MarketplaceItemsListDto>;

public record MarketplaceItemsListDto(IReadOnlyList<MarketplaceItemDto> Items, PaginationDto Pagination);
public record PaginationDto(int Page, int Limit, int Total, int TotalPages);
