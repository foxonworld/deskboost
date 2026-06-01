using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record CancelPlantClaimCodeCommand(Guid Id) : IRequest<PlantClaimCodeDto>;

public class CancelPlantClaimCodeCommandHandler : IRequestHandler<CancelPlantClaimCodeCommand, PlantClaimCodeDto>
{
    private readonly IAppDbContext _db;

    public CancelPlantClaimCodeCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantClaimCodeDto> Handle(CancelPlantClaimCodeCommand request, CancellationToken ct)
    {
        var code = await _db.PlantClaimCodes
            .Include(c => c.MarketplaceItem)
            .FirstOrDefaultAsync(c => c.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy claim code.");

        if (code.Status == PlantClaimCodeStatus.Claimed)
            throw new InvalidOperationException("Không thể hủy code đã được claim.");

        if (code.Status == PlantClaimCodeStatus.Cancelled)
            throw new InvalidOperationException("Code này đã bị hủy.");

        code.Status = PlantClaimCodeStatus.Cancelled;
        code.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new PlantClaimCodeDto(
            code.Id, code.Code, code.MarketplaceItemId, code.MarketplaceItem?.Name ?? "",
            code.PlantId,
            code.Status.ToApiString(),
            code.BuyerContact, code.Note,
            code.ClaimedByUserId, null, code.ClaimedPlantId, code.ClaimedAt, code.CreatedAt);
    }
}
