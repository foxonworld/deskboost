using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminUserPlantsQuery : IRequest<List<AdminUserPlantDto>>;

public class GetAdminUserPlantsQueryHandler : IRequestHandler<GetAdminUserPlantsQuery, List<AdminUserPlantDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminUserPlantsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminUserPlantDto>> Handle(GetAdminUserPlantsQuery request, CancellationToken ct)
    {
        var plants = await _db.Plants
            .Where(p => p.UserId.HasValue)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

        var userIds = plants.Select(p => p.UserId!.Value).Distinct().ToList();
        var users = await _db.Users.Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Email, ct);

        var marketplaceItemIds = plants.Where(p => p.MarketplaceItemId.HasValue)
            .Select(p => p.MarketplaceItemId!.Value).Distinct().ToList();
        var marketplaceItems = marketplaceItemIds.Any()
            ? await _db.MarketplaceItems.Where(i => marketplaceItemIds.Contains(i.Id))
                .ToDictionaryAsync(i => i.Id, i => i.Name, ct)
            : new Dictionary<Guid, string>();

        var claimCodeIds = plants.Where(p => p.ClaimCodeId.HasValue)
            .Select(p => p.ClaimCodeId!.Value).Distinct().ToList();
        var claimCodes = claimCodeIds.Any()
            ? await _db.PlantClaimCodes.Where(c => claimCodeIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, c => c.Code, ct)
            : new Dictionary<Guid, string>();

        return plants.Select(p => new AdminUserPlantDto(
            p.Id,
            p.UserId!.Value,
            users.GetValueOrDefault(p.UserId!.Value) ?? "",
            p.MarketplaceItemId,
            p.MarketplaceItemId.HasValue ? marketplaceItems.GetValueOrDefault(p.MarketplaceItemId.Value) : null,
            p.ClaimCodeId,
            p.ClaimCodeId.HasValue ? claimCodes.GetValueOrDefault(p.ClaimCodeId.Value) : null,
            p.Name, p.Nickname, p.SpeciesName, p.Location,
            p.Status.ToApiString(),
            p.CareLevel, p.Light, p.Water, p.Notes,
            p.OwnershipCode, p.OwnershipStatus.ToString(), p.IsClaimed, p.ClaimedAt,
            p.CreatedAt, p.UpdatedAt
        )).ToList();
    }
}

public record GetAdminUserPlantByIdQuery(Guid PlantId) : IRequest<AdminUserPlantDto?>;

public class GetAdminUserPlantByIdQueryHandler : IRequestHandler<GetAdminUserPlantByIdQuery, AdminUserPlantDto?>
{
    private readonly IAppDbContext _db;

    public GetAdminUserPlantByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserPlantDto?> Handle(GetAdminUserPlantByIdQuery request, CancellationToken ct)
    {
        var p = await _db.Plants.FirstOrDefaultAsync(x => x.Id == request.PlantId && x.UserId.HasValue, ct);
        if (p is null) return null;

        var userEmail = p.UserId.HasValue
            ? (await _db.Users.FindAsync(new object[] { p.UserId.Value }, ct))?.Email ?? ""
            : "";

        string? marketplaceItemName = null;
        if (p.MarketplaceItemId.HasValue)
        {
            var mi = await _db.MarketplaceItems.FindAsync(new object[] { p.MarketplaceItemId.Value }, ct);
            marketplaceItemName = mi?.Name;
        }

        string? claimCode = null;
        if (p.ClaimCodeId.HasValue)
        {
            var cc = await _db.PlantClaimCodes.FindAsync(new object[] { p.ClaimCodeId.Value }, ct);
            claimCode = cc?.Code;
        }

        return new AdminUserPlantDto(
            p.Id, p.UserId!.Value, userEmail,
            p.MarketplaceItemId, marketplaceItemName,
            p.ClaimCodeId, claimCode,
            p.Name, p.Nickname, p.SpeciesName, p.Location,
            p.Status.ToApiString(),
            p.CareLevel, p.Light, p.Water, p.Notes,
            p.OwnershipCode, p.OwnershipStatus.ToString(), p.IsClaimed, p.ClaimedAt,
            p.CreatedAt, p.UpdatedAt);
    }
}
