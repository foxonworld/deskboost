using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Plants.Commands;

public class CreatePlantCommandHandler : IRequestHandler<CreatePlantCommand, PlantDto>
{
    private readonly IAppDbContext _db;

    public CreatePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantDto> Handle(CreatePlantCommand request, CancellationToken ct)
    {
        var species = await _db.PlantSpecies
            .FirstOrDefaultAsync(s => s.Id == request.PlantSpeciesId, ct)
            ?? throw new NotFoundException($"Không tìm thấy loài cây với ID {request.PlantSpeciesId}");

        var plant = new Plant
        {
            UserId = request.UserId,
            PlantSpeciesId = request.PlantSpeciesId,
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            Location = request.Location,
            WateringCycleDays = request.WateringCycleDays,
            Notes = request.Notes
        };

        _db.Plants.Add(plant);
        await _db.SaveChangesAsync(ct);

        return new PlantDto(
            plant.Id,
            plant.UserId,
            plant.PlantSpeciesId,
            species?.Name,
            species?.VietnameseName,
            plant.Name,
            plant.ImageUrl,
            plant.Location,
            plant.WateringCycleDays,
            plant.LastCondition.ToString(),
            plant.Notes,
            plant.CreatedAt,
            plant.UpdatedAt,
            plant.OwnershipCode,
            plant.OwnershipStatus.ToString(),
            plant.IsClaimed
        );
    }
}
