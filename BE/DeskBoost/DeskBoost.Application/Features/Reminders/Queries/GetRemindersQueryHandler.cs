using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Queries;

public class GetRemindersQueryHandler : IRequestHandler<GetRemindersQuery, List<ReminderDto>>
{
    private readonly IAppDbContext _db;

    public GetRemindersQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<ReminderDto>> Handle(GetRemindersQuery request, CancellationToken ct)
    {
        var reminders = await _db.Reminders
            .Include(r => r.Plant)
            .Where(r => r.UserId == request.UserId && r.IsActive)
            .OrderBy(r => r.DueAt)
            .ToListAsync(ct);

        return reminders.Select(r => new ReminderDto(
            r.Id, r.PlantId, r.Plant.Name, r.Title,
            r.CareType.ToApiString(), r.DueAt,
            r.RepeatRule.ToApiString(), r.Status.ToApiString(),
            r.LastDoneAt, r.Notes, r.CreatedAt, r.UpdatedAt))
        .ToList();
    }
}
