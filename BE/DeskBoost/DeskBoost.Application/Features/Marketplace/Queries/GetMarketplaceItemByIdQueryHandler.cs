using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Marketplace.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public class GetMarketplaceItemByIdQueryHandler : IRequestHandler<GetMarketplaceItemByIdQuery, MarketplaceItemDto?>
{
    private readonly IAppDbContext _db;

    public GetMarketplaceItemByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto?> Handle(GetMarketplaceItemByIdQuery request, CancellationToken ct)
    {
        var p = await _db.MarketplaceItems
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        if (p is null) return null;
        return CreateMarketplaceItemCommandHandler.MapToDto(p);
    }
}
