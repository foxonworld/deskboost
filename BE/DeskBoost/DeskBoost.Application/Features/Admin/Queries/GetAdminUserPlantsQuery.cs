using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminUserPlantsQuery : IRequest<List<AdminUserPlantDto>>;

public class GetAdminUserPlantsQueryHandler : IRequestHandler<GetAdminUserPlantsQuery, List<AdminUserPlantDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminUserPlantsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminUserPlantDto>> Handle(GetAdminUserPlantsQuery request, CancellationToken ct)
    {
        return await _db.Plants
            .Join(_db.Users, p => p.UserId, u => u.Id, (p, u) => new AdminUserPlantDto(
                p.Id, p.UserId, u.Email, p.Name,
                p.SpeciesName ?? (p.Species != null ? p.Species.Name : null),
                p.Location, p.Status.ToApiString(), p.CreatedAt))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }
}

public record GetAdminUserPlantByIdQuery(Guid PlantId) : IRequest<AdminUserPlantDto?>;

public class GetAdminUserPlantByIdQueryHandler : IRequestHandler<GetAdminUserPlantByIdQuery, AdminUserPlantDto?>
{
    private readonly IAppDbContext _db;

    public GetAdminUserPlantByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserPlantDto?> Handle(GetAdminUserPlantByIdQuery request, CancellationToken ct)
    {
        var result = await _db.Plants
            .Where(p => p.Id == request.PlantId)
            .Join(_db.Users, p => p.UserId, u => u.Id, (p, u) => new AdminUserPlantDto(
                p.Id, p.UserId, u.Email, p.Name,
                p.SpeciesName ?? (p.Species != null ? p.Species.Name : null),
                p.Location, p.Status.ToApiString(), p.CreatedAt))
            .FirstOrDefaultAsync(ct);
        return result;
    }
}
