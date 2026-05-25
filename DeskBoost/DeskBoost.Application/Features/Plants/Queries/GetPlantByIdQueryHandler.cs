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
                p.Species.Name,
                p.Species.VietnameseName,
                p.Name,
                p.ImageUrl,
                p.Location,
                p.WateringCycleDays,
                p.LastCondition,
                p.Notes,
                p.CreatedAt,
                p.UpdatedAt
            ))
            .FirstOrDefaultAsync(ct);
    }
}
