using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminPlantInventoryQuery(string? Status = null, Guid? MarketplaceItemId = null)
    : IRequest<List<AdminPlantInventoryDto>>;

public class GetAdminPlantInventoryQueryHandler : IRequestHandler<GetAdminPlantInventoryQuery, List<AdminPlantInventoryDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminPlantInventoryQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminPlantInventoryDto>> Handle(GetAdminPlantInventoryQuery request, CancellationToken ct)
    {
        var query = _db.Plants.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            bool isClaimed = request.Status.Equals("claimed", StringComparison.OrdinalIgnoreCase);
            query = query.Where(p => p.IsClaimed == isClaimed);
        }

        if (request.MarketplaceItemId.HasValue)
            query = query.Where(p => p.MarketplaceItemId == request.MarketplaceItemId.Value);

        var plants = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

        // Use Plant.ClaimCodeId (exists in DB) to look up claim codes — PlantClaimCode.PlantId column is not in the DB
        var claimCodeIds = plants.Where(p => p.ClaimCodeId.HasValue).Select(p => p.ClaimCodeId!.Value).Distinct().ToList();
        var claimCodeById = claimCodeIds.Any()
            ? await _db.PlantClaimCodes.Where(c => claimCodeIds.Contains(c.Id)).ToDictionaryAsync(c => c.Id, ct)
            : new Dictionary<Guid, PlantClaimCode>();

        var userIds = plants.Where(p => p.UserId.HasValue).Select(p => p.UserId!.Value).Distinct().ToList();
        var userEmails = userIds.Any()
            ? await _db.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => u.Email, ct)
            : new Dictionary<Guid, string>();

        return plants.Select(p =>
        {
            PlantClaimCode? cc = p.ClaimCodeId.HasValue ? claimCodeById.GetValueOrDefault(p.ClaimCodeId.Value) : null;
            return ToDto(p, p.UserId.HasValue ? userEmails.GetValueOrDefault(p.UserId.Value) : null, cc);
        }).ToList();
    }

    internal static AdminPlantInventoryDto ToDto(Plant p, string? userEmail, PlantClaimCode? claimCode = null) => new(
        p.Id,
        p.MarketplaceItemId,
        p.PlantSpeciesId,
        p.Name,
        p.SpeciesName,
        p.ImageUrl,
        p.Location,
        p.CareLevel,
        p.Light,
        p.Water,
        p.WateringCycleDays,
        p.Notes,
        p.OwnershipCode,
        p.OwnershipStatus.ToString(),
        p.IsClaimed,
        p.ClaimedAt,
        p.UserId,
        userEmail,
        p.OwnershipCode is not null ? $"/claim/{p.OwnershipCode}" : null,
        claimCode?.Id,
        claimCode?.Status.ToApiString(),
        p.CreatedAt,
        p.UpdatedAt
    );
}

public record GetAdminPlantInventoryByIdQuery(Guid PlantId) : IRequest<AdminPlantInventoryDto?>;

public class GetAdminPlantInventoryByIdQueryHandler : IRequestHandler<GetAdminPlantInventoryByIdQuery, AdminPlantInventoryDto?>
{
    private readonly IAppDbContext _db;

    public GetAdminPlantInventoryByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminPlantInventoryDto?> Handle(GetAdminPlantInventoryByIdQuery request, CancellationToken ct)
    {
        var p = await _db.Plants.FirstOrDefaultAsync(x => x.Id == request.PlantId, ct);
        if (p is null) return null;

        string? userEmail = null;
        if (p.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(new object[] { p.UserId.Value }, ct);
            userEmail = user?.Email;
        }

        var claimCode = await _db.PlantClaimCodes
            .FirstOrDefaultAsync(c => c.PlantId == p.Id, ct);

        return GetAdminPlantInventoryQueryHandler.ToDto(p, userEmail, claimCode);
    }
}
