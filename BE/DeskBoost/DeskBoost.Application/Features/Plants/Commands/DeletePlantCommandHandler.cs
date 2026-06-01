using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Plants.Commands;

public class DeletePlantCommandHandler : IRequestHandler<DeletePlantCommand>
{
    private readonly IAppDbContext _db;

    public DeletePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeletePlantCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.UserId == request.UserId, ct)
            ?? throw new NotFoundException($"Không tìm thấy cây với ID {request.Id}");

        _db.Plants.Remove(plant);
        await _db.SaveChangesAsync(ct);
    }
}
