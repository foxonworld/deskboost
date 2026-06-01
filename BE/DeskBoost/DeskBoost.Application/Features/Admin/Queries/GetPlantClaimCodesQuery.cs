using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetPlantClaimCodesQuery(
    Guid? PlantInventoryId = null,
    string? Status = null
) : IRequest<List<PlantClaimCodeDto>>;

public class GetPlantClaimCodesQueryHandler : IRequestHandler<GetPlantClaimCodesQuery, List<PlantClaimCodeDto>>
{
    private readonly IAppDbContext _db;

    public GetPlantClaimCodesQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<PlantClaimCodeDto>> Handle(GetPlantClaimCodesQuery request, CancellationToken ct)
    {
        var query = _db.PlantClaimCodes
            .Include(c => c.MarketplaceItem)
            .AsQueryable();

        if (request.PlantInventoryId.HasValue)
            query = query.Where(c => c.PlantId == request.PlantInventoryId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var statusEnum = request.Status.ToPlantClaimCodeStatus();
            query = query.Where(c => c.Status == statusEnum);
        }

        var codes = await query.OrderByDescending(c => c.CreatedAt).ToListAsync(ct);

        var userIds = codes.Where(c => c.ClaimedByUserId.HasValue).Select(c => c.ClaimedByUserId!.Value).Distinct().ToList();
        var userEmails = userIds.Any()
            ? await _db.Users.Where(u => userIds.Contains(u.Id)).ToDictionaryAsync(u => u.Id, u => u.Email, ct)
            : new Dictionary<Guid, string>();

        return codes.Select(c => new PlantClaimCodeDto(
            c.Id, c.Code, c.MarketplaceItemId, c.MarketplaceItem?.Name ?? "",
            c.PlantId,
            c.Status.ToApiString(),
            c.BuyerContact, c.Note,
            c.ClaimedByUserId,
            c.ClaimedByUserId.HasValue ? userEmails.GetValueOrDefault(c.ClaimedByUserId.Value) : null,
            c.ClaimedPlantId, c.ClaimedAt, c.CreatedAt
        )).ToList();
    }
}
