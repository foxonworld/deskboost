using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Admin.Queries;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record CreateAdminPlantInventoryCommand : IRequest<AdminPlantInventoryDto>
{
    public Guid? MarketplaceItemId { get; init; }
    public Guid? PlantSpeciesId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? SpeciesName { get; init; }
    public string? ImageUrl { get; init; }
    public string? Location { get; init; }
    public int WateringCycleDays { get; init; } = 3;
    public string? Notes { get; init; }
}

public class CreateAdminPlantInventoryCommandHandler : IRequestHandler<CreateAdminPlantInventoryCommand, AdminPlantInventoryDto>
{
    private readonly IAppDbContext _db;

    public CreateAdminPlantInventoryCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminPlantInventoryDto> Handle(CreateAdminPlantInventoryCommand request, CancellationToken ct)
    {
        string code;
        do
        {
            code = GenerateCode();
        } while (await _db.Plants.AnyAsync(p => p.OwnershipCode == code, ct)
              || await _db.PlantClaimCodes.AnyAsync(c => c.Code == code, ct));

        var plant = new Plant
        {
            UserId = null,
            MarketplaceItemId = request.MarketplaceItemId,
            PlantSpeciesId = request.PlantSpeciesId,
            Name = request.Name.Trim(),
            SpeciesName = request.SpeciesName?.Trim(),
            ImageUrl = request.ImageUrl,
            Location = request.Location?.Trim(),
            WateringCycleDays = request.WateringCycleDays,
            Notes = request.Notes?.Trim(),
            OwnershipCode = code,
            OwnershipStatus = OwnershipStatus.Unclaimed,
            IsClaimed = false,
            Status = PlantStatus.Healthy
        };

        _db.Plants.Add(plant);
        await _db.SaveChangesAsync(ct);

        // Auto-create claim code only when a Plant-category marketplace item is linked
        PlantClaimCode? claimCode = null;
        if (request.MarketplaceItemId.HasValue)
        {
            var item = await _db.MarketplaceItems.FindAsync(new object[] { request.MarketplaceItemId.Value }, ct);
            if (item?.Category == MarketplaceCategory.Plant)
            {
                claimCode = new PlantClaimCode
                {
                    Code = code,
                    MarketplaceItemId = request.MarketplaceItemId.Value,
                    PlantId = plant.Id,
                    Status = PlantClaimCodeStatus.Unclaimed
                };
                _db.PlantClaimCodes.Add(claimCode);
                await _db.SaveChangesAsync(ct);
            }
        }

        return GetAdminPlantInventoryQueryHandler.ToDto(plant, null, claimCode);
    }

    private static string GenerateCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        static string Part(int len) => new(
            Enumerable.Range(0, len).Select(_ => chars[Random.Shared.Next(chars.Length)]).ToArray());
        return $"DB-{Part(4)}-{Part(4)}";
    }
}
