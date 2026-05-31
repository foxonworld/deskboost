using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetMarketplacePlantsQuery(int Page = 1, int Limit = 12) : IRequest<MarketplacePlantsListDto>;

public record MarketplacePlantsListDto(IReadOnlyList<MarketplacePlantDto> Items, PaginationDto Pagination);
public record PaginationDto(int Page, int Limit, int Total, int TotalPages);
