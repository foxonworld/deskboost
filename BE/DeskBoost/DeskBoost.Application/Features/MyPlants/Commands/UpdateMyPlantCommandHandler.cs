using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public class UpdateMyPlantCommandHandler : IRequestHandler<UpdateMyPlantCommand, MyPlantDto>
{
    private readonly IAppDbContext _db;

    public UpdateMyPlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MyPlantDto> Handle(UpdateMyPlantCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants
            .FirstOrDefaultAsync(p => p.Id == request.PlantId && p.UserId == request.UserId, ct)
            ?? throw new NotFoundException("Không tìm thấy cây.");

        if (!string.IsNullOrWhiteSpace(request.Name)) plant.Name = request.Name.Trim();
        if (request.Species is not null) plant.SpeciesName = request.Species.Trim();
        if (request.Location is not null) plant.Location = request.Location.Trim();
        if (request.ImageUrl is not null) plant.ImageUrl = request.ImageUrl;
        if (!string.IsNullOrWhiteSpace(request.Status)) plant.Status = request.Status.ToPlantStatus();
        if (request.Notes is not null) plant.Notes = request.Notes.Trim();
        plant.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        string? speciesName = plant.SpeciesName;
        if (speciesName is null && plant.PlantSpeciesId.HasValue)
        {
            var species = await _db.PlantSpecies.FindAsync(new object[] { plant.PlantSpeciesId.Value }, ct);
            speciesName = species?.Name;
        }

        return new MyPlantDto(plant.Id, plant.Name, speciesName, plant.Location, plant.ImageUrl, plant.Status.ToApiString(), plant.Notes, plant.CreatedAt, plant.UpdatedAt);
    }
}
