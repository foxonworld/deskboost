using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public class GetMarketplaceItemByIdQueryHandler : IRequestHandler<GetMarketplaceItemByIdQuery, MarketplaceItemDto?>
{
    private readonly IAppDbContext _db;

    public GetMarketplaceItemByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto?> Handle(GetMarketplaceItemByIdQuery request, CancellationToken ct)
    {
        var p = await _db.MarketplaceItems.FirstOrDefaultAsync(p => p.Id == request.Id, ct);
        if (p is null) return null;
        return new MarketplaceItemDto(
            p.Id, p.Name, p.Description,
            p.Category.ToApiString(),
            p.ImageUrl, p.PriceText, p.ContactUrl,
            p.Status.ToApiString(),
            p.CareLevel, p.Light, p.Water, p.AttributesJson);
    }
}
