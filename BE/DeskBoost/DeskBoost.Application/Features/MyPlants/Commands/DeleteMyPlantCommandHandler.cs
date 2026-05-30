using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public class DeleteMyPlantCommandHandler : IRequestHandler<DeleteMyPlantCommand>
{
    private readonly IAppDbContext _db;

    public DeleteMyPlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteMyPlantCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants
            .FirstOrDefaultAsync(p => p.Id == request.PlantId && p.UserId == request.UserId, ct)
            ?? throw new NotFoundException("Không tìm thấy cây.");

        _db.Plants.Remove(plant);
        await _db.SaveChangesAsync(ct);
    }
}
