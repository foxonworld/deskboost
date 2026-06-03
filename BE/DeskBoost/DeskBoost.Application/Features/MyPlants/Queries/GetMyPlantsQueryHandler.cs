using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.MyPlants.Commands;
using DeskBoost.Domain.Enums;
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

        var now = DateTime.UtcNow;
        var result = new List<MyPlantDto>();

        foreach (var p in plants)
        {
            var computedStatus = await ComputeStatusAsync(_db, p, now, ct);
            result.Add(CreateMyPlantCommandHandler.ToDtoWithStatus(p, p.SpeciesName, computedStatus));
        }

        return result;
    }

    /// <summary>
    /// Tính trạng thái thực tế: issue > needs-water > (DB status)
    /// </summary>
    internal static async Task<string> ComputeStatusAsync(IAppDbContext db, Domain.Entities.Plant p, DateTime now, CancellationToken ct)
    {
        if (p.Status == PlantStatus.Issue)
            return "issue";

        var hasOverdueWatering = await db.Reminders
            .AnyAsync(r => r.PlantId == p.Id
                          && r.CareType == CareType.Watering
                          && r.Status == ReminderStatus.Pending
                          && r.IsActive
                          && r.DueAt < now, ct);

        if (hasOverdueWatering)
            return "needs-water";

        return p.Status.ToApiString();
    }
}
