using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public class GetMyPlantsQueryHandler : IRequestHandler<GetMyPlantsQuery, List<MyPlantDto>>
{
    private readonly IAppDbContext _db;

    public GetMyPlantsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<MyPlantDto>> Handle(GetMyPlantsQuery request, CancellationToken ct)
    {
        return await _db.Plants
            .Where(p => p.UserId == request.UserId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new MyPlantDto(
                p.Id,
                p.Name,
                p.SpeciesName ?? (p.Species != null ? p.Species.Name : null),
                p.Location,
                p.ImageUrl,
                p.Status.ToApiString(),
                p.Notes,
                p.CreatedAt,
                p.UpdatedAt
            ))
            .ToListAsync(ct);
    }
}
