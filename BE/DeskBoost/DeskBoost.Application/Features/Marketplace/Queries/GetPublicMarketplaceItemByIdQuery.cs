using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Marketplace.Commands;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetPublicMarketplaceItemByIdQuery(Guid Id) : IRequest<MarketplaceItemDto?>;

public class GetPublicMarketplaceItemByIdQueryHandler
    : IRequestHandler<GetPublicMarketplaceItemByIdQuery, MarketplaceItemDto?>
{
    private readonly IAppDbContext _db;

    public GetPublicMarketplaceItemByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto?> Handle(GetPublicMarketplaceItemByIdQuery request, CancellationToken ct)
    {
        var item = await _db.MarketplaceItems
            .Include(x => x.Images)
            .FirstOrDefaultAsync(
                x => x.Id == request.Id && x.Status == MarketplaceStatus.Active,
                ct);

        return item is null ? null : CreateMarketplaceItemCommandHandler.MapToDto(item);
    }
}
