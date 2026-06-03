using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.PlantSpecies.Queries;

public record GetPlantSpeciesQuery(bool? IsActive = null) : IRequest<List<PlantSpeciesDto>>;

public class GetPlantSpeciesQueryHandler : IRequestHandler<GetPlantSpeciesQuery, List<PlantSpeciesDto>>
{
    private readonly IAppDbContext _db;

    public GetPlantSpeciesQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<PlantSpeciesDto>> Handle(GetPlantSpeciesQuery request, CancellationToken ct)
    {
        var query = _db.PlantSpecies.AsQueryable();

        if (request.IsActive.HasValue)
            query = query.Where(s => s.IsActive == request.IsActive.Value);

        return await query
            .OrderBy(s => s.Name)
            .Select(s => ToDto(s))
            .ToListAsync(ct);
    }

    internal static PlantSpeciesDto ToDto(DeskBoost.Domain.Entities.PlantSpecies s) => new(
        s.Id,
        s.Name,
        s.VietnameseName,
        s.Description,
        s.CareInstructions,
        s.CommonDiseases,
        s.ImageUrl,
        s.IsActive,
        s.CreatedAt,
        s.UpdatedAt
    );
}

public record GetPlantSpeciesByIdQuery(Guid Id) : IRequest<PlantSpeciesDto?>;

public class GetPlantSpeciesByIdQueryHandler : IRequestHandler<GetPlantSpeciesByIdQuery, PlantSpeciesDto?>
{
    private readonly IAppDbContext _db;

    public GetPlantSpeciesByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PlantSpeciesDto?> Handle(GetPlantSpeciesByIdQuery request, CancellationToken ct)
    {
        var s = await _db.PlantSpecies.FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        return s is null ? null : GetPlantSpeciesQueryHandler.ToDto(s);
    }
}
