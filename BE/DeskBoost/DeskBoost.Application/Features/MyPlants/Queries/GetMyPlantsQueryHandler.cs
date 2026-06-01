using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.MyPlants.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public class GetMyPlantsQueryHandler : IRequestHandler<GetMyPlantsQuery, List<MyPlantDto>>
{
    private readonly IAppDbContext _db;

    public GetMyPlantsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<MyPlantDto>> Handle(GetMyPlantsQuery request, CancellationToken ct)
    {
        var plants = await _db.Plants
            .Where(p => p.UserId == request.UserId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);

        return plants.Select(p =>
            CreateMyPlantCommandHandler.ToDto(p, p.SpeciesName)
        ).ToList();
    }
}
