using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public record ClaimPlantCommand : IRequest<MyPlantDto>
{
    public Guid UserId { get; init; }
    public string Code { get; init; } = string.Empty;
    public string? Nickname { get; init; }
    public string? Location { get; init; }
}

public class ClaimPlantCommandHandler : IRequestHandler<ClaimPlantCommand, MyPlantDto>
{
    private readonly IAppDbContext _db;

    public ClaimPlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MyPlantDto> Handle(ClaimPlantCommand request, CancellationToken ct)
    {
        var claimCode = await _db.PlantClaimCodes
            .FirstOrDefaultAsync(c => c.Code == request.Code, ct)
            ?? throw new InvalidOperationException("Mã code không tồn tại.");

        if (claimCode.Status != PlantClaimCodeStatus.Unclaimed)
            throw new InvalidOperationException($"Code này không thể claim (trạng thái: {claimCode.Status.ToApiString()}).");

        if (claimCode.PlantId is null)
            throw new InvalidOperationException("Mã code này không gắn với cây vật lý cụ thể.");

        var plant = await _db.Plants.FirstOrDefaultAsync(p => p.Id == claimCode.PlantId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây trong kho.");

        if (plant.UserId.HasValue)
            throw new InvalidOperationException("Cây này đã có chủ.");

        plant.UserId = request.UserId;
        plant.ClaimCodeId = claimCode.Id;
        plant.Nickname = request.Nickname?.Trim();
        if (request.Location is not null) plant.Location = request.Location.Trim();
        plant.IsClaimed = true;
        plant.OwnershipStatus = OwnershipStatus.Claimed;
        plant.ClaimedAt = DateTime.UtcNow;
        plant.UpdatedAt = DateTime.UtcNow;

        claimCode.Status = PlantClaimCodeStatus.Claimed;
        claimCode.ClaimedByUserId = request.UserId;
        claimCode.ClaimedPlantId = plant.Id;
        claimCode.ClaimedAt = DateTime.UtcNow;
        claimCode.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return CreateMyPlantCommandHandler.ToDto(plant, plant.SpeciesName);
    }
}
