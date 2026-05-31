using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public class CreateMyPlantCommandHandler : IRequestHandler<CreateMyPlantCommand, MyPlantDto>
{
    private readonly IAppDbContext _db;

    public CreateMyPlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MyPlantDto> Handle(CreateMyPlantCommand request, CancellationToken ct)
    {
        var plant = new Plant
        {
            UserId = request.UserId,
            Name = request.Name.Trim(),
            SpeciesName = request.Species?.Trim(),
            Location = request.Location?.Trim(),
            ImageUrl = request.ImageUrl,
            Notes = request.Notes?.Trim(),
            Status = PlantStatus.Healthy
        };

        _db.Plants.Add(plant);
        await _db.SaveChangesAsync(ct);

        return new MyPlantDto(plant.Id, plant.Name, plant.SpeciesName, plant.Location, plant.ImageUrl, plant.Status.ToApiString(), plant.Notes, plant.CreatedAt, plant.UpdatedAt);
    }
}
