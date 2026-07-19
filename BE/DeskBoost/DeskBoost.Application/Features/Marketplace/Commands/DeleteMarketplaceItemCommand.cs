using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
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

        if (await _db.PlantClaimCodes.AnyAsync(code => code.MarketplaceItemId == request.Id, ct))
            throw new ConflictException("Không thể xóa item đang được tham chiếu bởi mã claim.");

        _db.MarketplaceItems.Remove(item);
        await _db.SaveChangesAsync(ct);
    }
}
