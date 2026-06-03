using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Admin.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record UpdateAdminPlantInventoryCommand : IRequest<AdminPlantInventoryDto>
{
    public Guid PlantId { get; init; }
    public Guid? MarketplaceItemId { get; init; }
    public string? Name { get; init; }
    public string? SpeciesName { get; init; }
    public string? ImageUrl { get; init; }
    public string? Location { get; init; }
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public int? WateringCycleDays { get; init; }
    public string? Notes { get; init; }
}

public class UpdateAdminPlantInventoryCommandHandler : IRequestHandler<UpdateAdminPlantInventoryCommand, AdminPlantInventoryDto>
{
    private readonly IAppDbContext _db;

    public UpdateAdminPlantInventoryCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminPlantInventoryDto> Handle(UpdateAdminPlantInventoryCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants.FirstOrDefaultAsync(p => p.Id == request.PlantId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        if (request.MarketplaceItemId.HasValue) plant.MarketplaceItemId = request.MarketplaceItemId;
        if (!string.IsNullOrWhiteSpace(request.Name)) plant.Name = request.Name.Trim();
        if (request.SpeciesName is not null) plant.SpeciesName = request.SpeciesName.Trim();
        if (request.ImageUrl is not null) plant.ImageUrl = request.ImageUrl;
        if (request.Location is not null) plant.Location = request.Location.Trim();
        if (request.CareLevel is not null) plant.CareLevel = request.CareLevel;
        if (request.Light is not null) plant.Light = request.Light;
        if (request.Water is not null) plant.Water = request.Water;
        if (request.WateringCycleDays.HasValue && request.WateringCycleDays.Value > 0)
            plant.WateringCycleDays = request.WateringCycleDays.Value;
        if (request.Notes is not null) plant.Notes = request.Notes.Trim();
        plant.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        string? userEmail = null;
        if (plant.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(new object[] { plant.UserId.Value }, ct);
            userEmail = user?.Email;
        }

        var claimCode = await _db.PlantClaimCodes
            .FirstOrDefaultAsync(c => c.PlantId == plant.Id, ct);

        return GetAdminPlantInventoryQueryHandler.ToDto(plant, userEmail, claimCode);
    }
}
