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
            Status = PlantStatus.Healthy,
            IsClaimed = true,
            OwnershipStatus = OwnershipStatus.Claimed,
            ClaimedAt = DateTime.UtcNow
        };

        _db.Plants.Add(plant);
        await _db.SaveChangesAsync(ct);

        return ToDto(plant, plant.SpeciesName);
    }

    internal static MyPlantDto ToDto(Plant p, string? speciesName) =>
        ToDtoWithStatus(p, speciesName, p.Status.ToApiString());

    internal static MyPlantDto ToDtoWithStatus(Plant p, string? speciesName, string computedStatus) => new(
        p.Id,
        p.MarketplaceItemId,
        p.ClaimCodeId,
        p.Name,
        p.Nickname,
        speciesName,
        p.PlantSpeciesId,
        p.Location,
        p.ImageUrl,
        computedStatus,
        p.CareLevel,
        p.Light,
        p.Water,
        p.LastCondition.ToString(),
        p.WateringCycleDays,
        p.Notes,
        p.OwnershipCode,
        p.OwnershipStatus.ToString(),
        p.IsClaimed,
        p.ClaimedAt,
        p.CreatedAt,
        p.UpdatedAt
    );
}
