using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Queries;

public class GetReminderCalendarQueryHandler : IRequestHandler<GetReminderCalendarQuery, ReminderCalendarDto?>
{
    private readonly IAppDbContext _db;

    public GetReminderCalendarQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ReminderCalendarDto?> Handle(GetReminderCalendarQuery request, CancellationToken ct)
    {
        var reminder = await _db.Reminders
            .Include(r => r.Plant)
            .FirstOrDefaultAsync(r => r.Id == request.ReminderId && r.UserId == request.UserId, ct);

        if (reminder is null) return null;

        var description = $"DeskBoost reminder for {reminder.Plant?.Name ?? "your plant"}.{(string.IsNullOrEmpty(reminder.Notes) ? "" : " " + reminder.Notes)}";
        var icsUrl = $"/api/reminders/{reminder.Id}/calendar?format=ics";

        return new ReminderCalendarDto(
            "google-calendar-compatible",
            reminder.Title,
            description,
            reminder.DueAt,
            reminder.DueAt.AddMinutes(15),
            "Asia/Ho_Chi_Minh",
            icsUrl
        );
    }
}
