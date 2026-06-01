using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record DeleteMarketplaceItemCommand(Guid Id) : IRequest;

public class DeleteMarketplaceItemCommandHandler : IRequestHandler<DeleteMarketplaceItemCommand>
{
    private readonly IAppDbContext _db;

    public DeleteMarketplaceItemCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteMarketplaceItemCommand request, CancellationToken ct)
    {
        var item = await _db.MarketplaceItems.FirstOrDefaultAsync(p => p.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy item.");

        _db.MarketplaceItems.Remove(item);
        await _db.SaveChangesAsync(ct);
    }
}
