using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.MyPlants.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public class GetMyPlantByIdQueryHandler : IRequestHandler<GetMyPlantByIdQuery, MyPlantDto?>
{
    private readonly IAppDbContext _db;

    public GetMyPlantByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MyPlantDto?> Handle(GetMyPlantByIdQuery request, CancellationToken ct)
    {
        var p = await _db.Plants
            .Where(p => p.Id == request.PlantId && p.UserId == request.UserId)
            .FirstOrDefaultAsync(ct);

        if (p is null) return null;

        string? speciesName = p.SpeciesName;
        if (speciesName is null && p.PlantSpeciesId.HasValue)
        {
            var species = await _db.PlantSpecies.FindAsync(new object[] { p.PlantSpeciesId.Value }, ct);
            speciesName = species?.Name;
        }

        return CreateMyPlantCommandHandler.ToDto(p, speciesName);
    }
}
