using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Plants.Queries;

public class GetPlantByIdQueryHandler : IRequestHandler<GetPlantByIdQuery, PlantDto?>
{
    private readonly IAppDbContext _db;

    public GetPlantByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PlantDto?> Handle(GetPlantByIdQuery request, CancellationToken ct)
    {
        return await _db.Plants
            .Include(p => p.Species)
            .Where(p => p.Id == request.PlantId)
            .Select(p => new PlantDto(
                p.Id,
                p.UserId,
                p.PlantSpeciesId,
                p.Species != null ? p.Species.Name : null,
                p.Species != null ? p.Species.VietnameseName : null,
                p.Name,
                p.ImageUrl,
                p.Location,
                p.WateringCycleDays,
                p.LastCondition.ToString(),
                p.Notes,
                p.CreatedAt,
                p.UpdatedAt,
                p.OwnershipCode,
                p.OwnershipStatus.ToString(),
                p.IsClaimed
            ))
            .FirstOrDefaultAsync(ct);
    }
}
