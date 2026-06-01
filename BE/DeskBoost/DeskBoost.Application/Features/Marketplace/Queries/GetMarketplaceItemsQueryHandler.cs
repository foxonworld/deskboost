using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public class GetMarketplaceItemsQueryHandler : IRequestHandler<GetMarketplaceItemsQuery, MarketplaceItemsListDto>
{
    private readonly IAppDbContext _db;

    public GetMarketplaceItemsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemsListDto> Handle(GetMarketplaceItemsQuery request, CancellationToken ct)
    {
        var query = request.IncludeAll
            ? _db.MarketplaceItems.AsQueryable()
            : _db.MarketplaceItems.Where(p => p.Status == MarketplaceStatus.Active);

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var cat = request.Category.ToMarketplaceCategory();
            query = query.Where(p => p.Category == cat);
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .Select(p => new MarketplaceItemDto(
                p.Id, p.Name, p.Description,
                p.Category.ToApiString(),
                p.ImageUrl, p.PriceText, p.ContactUrl,
                p.Status.ToApiString(),
                p.CareLevel, p.Light, p.Water, p.AttributesJson))
            .ToListAsync(ct);

        var totalPages = (int)Math.Ceiling((double)total / request.Limit);
        return new MarketplaceItemsListDto(items, new PaginationDto(request.Page, request.Limit, total, totalPages));
    }
}
