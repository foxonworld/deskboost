using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record UpdatePlantClaimCodeCommand : IRequest<PlantClaimCodeDto>
{
    public Guid Id { get; init; }
    public string? BuyerContact { get; init; }
    public string? Note { get; init; }
}

public class UpdatePlantClaimCodeCommandHandler : IRequestHandler<UpdatePlantClaimCodeCommand, PlantClaimCodeDto>
{
    private readonly IAppDbContext _db;

    public UpdatePlantClaimCodeCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantClaimCodeDto> Handle(UpdatePlantClaimCodeCommand request, CancellationToken ct)
    {
        var claimCode = await _db.PlantClaimCodes
            .Include(c => c.MarketplaceItem)
            .FirstOrDefaultAsync(c => c.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy mã claim.");

        if (request.BuyerContact is not null) claimCode.BuyerContact = request.BuyerContact.Trim();
        if (request.Note is not null) claimCode.Note = request.Note.Trim();
        claimCode.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        string? claimedByEmail = null;
        if (claimCode.ClaimedByUserId.HasValue)
        {
            var user = await _db.Users.FindAsync(new object[] { claimCode.ClaimedByUserId.Value }, ct);
            claimedByEmail = user?.Email;
        }

        return new PlantClaimCodeDto(
            claimCode.Id, claimCode.Code,
            claimCode.MarketplaceItemId, claimCode.MarketplaceItem?.Name ?? "",
            claimCode.PlantId,
            claimCode.Status.ToApiString(),
            claimCode.BuyerContact, claimCode.Note,
            claimCode.ClaimedByUserId, claimedByEmail,
            claimCode.ClaimedPlantId, claimCode.ClaimedAt, claimCode.CreatedAt);
    }
}
