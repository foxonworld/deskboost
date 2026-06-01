using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Admin.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record RegenerateOwnershipCodeCommand(Guid PlantId) : IRequest<AdminPlantInventoryDto>;

public class RegenerateOwnershipCodeCommandHandler : IRequestHandler<RegenerateOwnershipCodeCommand, AdminPlantInventoryDto>
{
    private readonly IAppDbContext _db;

    public RegenerateOwnershipCodeCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminPlantInventoryDto> Handle(RegenerateOwnershipCodeCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants.FirstOrDefaultAsync(p => p.Id == request.PlantId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        if (plant.IsClaimed)
            throw new InvalidOperationException("Không thể tạo lại code cho cây đã được claim.");

        string code;
        do
        {
            code = GenerateCode();
        } while (await _db.Plants.AnyAsync(p => p.OwnershipCode == code && p.Id != request.PlantId, ct)
              || await _db.PlantClaimCodes.AnyAsync(c => c.Code == code && c.PlantId != request.PlantId, ct));

        plant.OwnershipCode = code;
        plant.UpdatedAt = DateTime.UtcNow;

        // Also update the linked claim code if it exists
        var claimCode = await _db.PlantClaimCodes
            .FirstOrDefaultAsync(c => c.PlantId == plant.Id, ct);
        if (claimCode is not null)
        {
            claimCode.Code = code;
            claimCode.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);

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
