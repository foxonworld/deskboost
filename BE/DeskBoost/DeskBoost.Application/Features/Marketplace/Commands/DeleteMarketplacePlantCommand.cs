using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record DeleteMarketplacePlantCommand(Guid Id) : IRequest;

public class DeleteMarketplacePlantCommandHandler : IRequestHandler<DeleteMarketplacePlantCommand>
{
    private readonly IAppDbContext _db;

    public DeleteMarketplacePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteMarketplacePlantCommand request, CancellationToken ct)
    {
        var plant = await _db.MarketplacePlants.FirstOrDefaultAsync(p => p.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        _db.MarketplacePlants.Remove(plant);
        await _db.SaveChangesAsync(ct);
    }
}
