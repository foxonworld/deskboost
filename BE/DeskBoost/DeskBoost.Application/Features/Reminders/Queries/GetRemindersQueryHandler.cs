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

        var now = DateTime.UtcNow;
        var repaired = false;
        foreach (var reminder in reminders)
        {
            if (reminder.Status == ReminderStatus.Done && reminder.RepeatRule.HasValue)
            {
                reminder.DueAt = GetNextDueAt(reminder.DueAt, reminder.RepeatRule.Value, reminder.LastDoneAt ?? now);
                reminder.Status = ReminderStatus.Pending;
                reminder.UpdatedAt = now;
                repaired = true;
            }
        }

        if (repaired)
        {
            await _db.SaveChangesAsync(ct);
        }

        return reminders.Select(r => new ReminderDto(
            r.Id, r.PlantId, r.Plant.Name, r.Title,
            r.CareType.ToApiString(), r.DueAt,
            r.RepeatRule.ToApiString(), r.Status.ToApiString(),
            r.LastDoneAt, r.Notes, r.CreatedAt, r.UpdatedAt))
        .ToList();
    }

    private static DateTime GetNextDueAt(DateTime dueAt, RepeatRule repeatRule, DateTime completedAt)
    {
        var next = AddInterval(dueAt, repeatRule);
        while (next <= completedAt)
        {
            next = AddInterval(next, repeatRule);
        }
        return next;
    }

    private static DateTime AddInterval(DateTime value, RepeatRule repeatRule) =>
        repeatRule switch
        {
            RepeatRule.Every2Days => value.AddDays(2),
            RepeatRule.Every3Days => value.AddDays(3),
            RepeatRule.Weekly => value.AddDays(7),
            RepeatRule.Biweekly => value.AddDays(14),
            RepeatRule.Monthly => value.AddMonths(1),
            _ => value.AddDays(1)
        };
}
