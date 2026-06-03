using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.PlantSpecies.Commands;

public record DeletePlantSpeciesCommand(Guid Id) : IRequest;

public class DeletePlantSpeciesCommandHandler : IRequestHandler<DeletePlantSpeciesCommand>
{
    private readonly IAppDbContext _db;

    public DeletePlantSpeciesCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeletePlantSpeciesCommand request, CancellationToken ct)
    {
        var species = await _db.PlantSpecies.FirstOrDefaultAsync(s => s.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy loài cây.");

        _db.PlantSpecies.Remove(species);
        await _db.SaveChangesAsync(ct);
    }
}
