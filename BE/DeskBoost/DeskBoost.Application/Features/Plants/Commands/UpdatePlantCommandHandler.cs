using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Plants.Commands;

public class UpdatePlantCommandHandler : IRequestHandler<UpdatePlantCommand, PlantDto>
{
    private readonly IAppDbContext _db;

    public UpdatePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantDto> Handle(UpdatePlantCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants
            .Include(p => p.Species)
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.UserId == request.UserId, ct)
            ?? throw new NotFoundException($"Không tìm thấy cây với ID {request.Id}");

        plant.Name = request.Name;
        plant.ImageUrl = request.ImageUrl;
        plant.Location = request.Location;
        plant.WateringCycleDays = request.WateringCycleDays;
        plant.Notes = request.Notes;
        plant.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new PlantDto(
            plant.Id,
            plant.UserId,
            plant.PlantSpeciesId,
            plant.Species?.Name,
            plant.Species?.VietnameseName,
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
