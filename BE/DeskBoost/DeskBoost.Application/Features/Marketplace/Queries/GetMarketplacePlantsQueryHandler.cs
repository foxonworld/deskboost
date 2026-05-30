using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public class GetMarketplacePlantsQueryHandler : IRequestHandler<GetMarketplacePlantsQuery, MarketplacePlantsListDto>
{
    private readonly IAppDbContext _db;

    public GetMarketplacePlantsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplacePlantsListDto> Handle(GetMarketplacePlantsQuery request, CancellationToken ct)
    {
        var query = _db.MarketplacePlants.Where(p => p.Status == MarketplaceStatus.Active);
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .Select(p => new MarketplacePlantDto(p.Id, p.Name, p.Description, p.ImageUrl,
                p.PriceText, p.CareLevel, p.Light, p.Water, p.ContactUrl, p.Status.ToApiString()))
            .ToListAsync(ct);

        var totalPages = (int)Math.Ceiling((double)total / request.Limit);
        return new MarketplacePlantsListDto(items, new PaginationDto(request.Page, request.Limit, total, totalPages));
    }
}
