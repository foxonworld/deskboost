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
    public Guid MarketplaceItemId { get; init; }
    public Guid? PlantSpeciesId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? SpeciesName { get; init; }
    public string? ImageUrl { get; init; }
    public string? Location { get; init; }
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public int WateringCycleDays { get; init; } = 3;
    public string? Notes { get; init; }
}

public class CreateAdminPlantInventoryCommandHandler : IRequestHandler<CreateAdminPlantInventoryCommand, AdminPlantInventoryDto>
{
    private readonly IAppDbContext _db;

    public CreateAdminPlantInventoryCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminPlantInventoryDto> Handle(CreateAdminPlantInventoryCommand request, CancellationToken ct)
    {
        // 1. Validate BEFORE any DB writes
        var item = await _db.MarketplaceItems.FindAsync(new object[] { request.MarketplaceItemId }, ct)
            ?? throw new InvalidOperationException("Không tìm thấy sản phẩm marketplace.");

        if (item.Category != MarketplaceCategory.Plant)
            throw new InvalidOperationException("Sản phẩm này không phải loại cây (category phải là plant).");

        string? speciesNameFallback = request.SpeciesName;
        if (request.PlantSpeciesId.HasValue)
        {
            var species = await _db.PlantSpecies.FindAsync(new object[] { request.PlantSpeciesId.Value }, ct)
                ?? throw new InvalidOperationException("Không tìm thấy loài cây (PlantSpeciesId không hợp lệ).");
            speciesNameFallback ??= species.VietnameseName;
        }

        // 2. Transaction wrapped in CreateExecutionStrategy for NpgsqlRetryingExecutionStrategy compatibility
        AdminPlantInventoryDto result = null!;
        var strategy = _db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Generate unique code inside lambda so retries get a fresh code
            string code;
            do
            {
                code = GenerateCode();
            } while (await _db.Plants.AnyAsync(p => p.OwnershipCode == code, ct)
                  || await _db.PlantClaimCodes.AnyAsync(c => c.Code == code, ct));

            // Create fresh entities on each attempt
            var plant = new Plant
            {
                UserId = null,
                MarketplaceItemId = request.MarketplaceItemId,
                PlantSpeciesId = request.PlantSpeciesId,
                Name = request.Name.Trim(),
                SpeciesName = speciesNameFallback?.Trim(),
                ImageUrl = request.ImageUrl,
                Location = request.Location?.Trim(),
                CareLevel = request.CareLevel ?? item.CareLevel,
                Light = request.Light ?? item.Light,
                Water = request.Water ?? item.Water,
                WateringCycleDays = request.WateringCycleDays,
                Notes = request.Notes?.Trim(),
                OwnershipCode = code,
                OwnershipStatus = OwnershipStatus.Unclaimed,
                IsClaimed = false,
                Status = PlantStatus.Healthy
            };

            await using var tx = await _db.Database.BeginTransactionAsync(ct);
            try
            {
                _db.Plants.Add(plant);
                await _db.SaveChangesAsync(ct);

                var claimCode = new PlantClaimCode
                {
                    Code = code,
                    MarketplaceItemId = request.MarketplaceItemId,
                    PlantId = plant.Id,
                    Status = PlantClaimCodeStatus.Unclaimed
                };
                _db.PlantClaimCodes.Add(claimCode);
                await _db.SaveChangesAsync(ct);

                plant.ClaimCodeId = claimCode.Id;
                plant.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync(ct);

                await tx.CommitAsync(ct);

                result = GetAdminPlantInventoryQueryHandler.ToDto(plant, null, claimCode);
            }
            catch
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        });

        return result;
    }

    private static string GenerateCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        static string Part(int len) => new(
            Enumerable.Range(0, len).Select(_ => chars[Random.Shared.Next(chars.Length)]).ToArray());
        return $"DB-{Part(4)}-{Part(4)}";
    }
}
