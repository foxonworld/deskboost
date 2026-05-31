using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public class GetMarketplacePlantByIdQueryHandler : IRequestHandler<GetMarketplacePlantByIdQuery, MarketplacePlantDto?>
{
    private readonly IAppDbContext _db;

    public GetMarketplacePlantByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplacePlantDto?> Handle(GetMarketplacePlantByIdQuery request, CancellationToken ct)
    {
        var p = await _db.MarketplacePlants.FirstOrDefaultAsync(p => p.Id == request.Id, ct);
        if (p is null) return null;
        return new MarketplacePlantDto(p.Id, p.Name, p.Description, p.ImageUrl,
            p.PriceText, p.CareLevel, p.Light, p.Water, p.ContactUrl, p.Status.ToApiString());
    }
}
