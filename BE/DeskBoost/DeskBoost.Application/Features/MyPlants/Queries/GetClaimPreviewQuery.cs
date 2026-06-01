using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public record GetClaimPreviewQuery(string Code) : IRequest<ClaimPreviewDto?>;

public class GetClaimPreviewQueryHandler : IRequestHandler<GetClaimPreviewQuery, ClaimPreviewDto?>
{
    private readonly IAppDbContext _db;

    public GetClaimPreviewQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ClaimPreviewDto?> Handle(GetClaimPreviewQuery request, CancellationToken ct)
    {
        var claimCode = await _db.PlantClaimCodes
            .Include(c => c.MarketplaceItem)
            .FirstOrDefaultAsync(c => c.Code == request.Code, ct);

        if (claimCode is null) return null;

        var codeStatus = claimCode.Status.ToApiString();

        if (claimCode.Status != PlantClaimCodeStatus.Unclaimed)
            return new ClaimPreviewDto(false, codeStatus, null);

        var item = claimCode.MarketplaceItem!;
        return new ClaimPreviewDto(
            true,
            codeStatus,
            new ClaimPreviewItemDto(
                item.Id, item.Name, item.Description,
                item.Category.ToApiString(),
                item.ImageUrl, item.CareLevel, item.Light, item.Water));
    }
}
