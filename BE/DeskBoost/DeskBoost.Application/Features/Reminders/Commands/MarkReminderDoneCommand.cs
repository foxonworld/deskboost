using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Commands;

public record MarkReminderDoneCommand(Guid ReminderId, Guid UserId) : IRequest<ReminderDto>;

public class MarkReminderDoneCommandHandler : IRequestHandler<MarkReminderDoneCommand, ReminderDto>
{
    private readonly IAppDbContext _db;

    public MarkReminderDoneCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReminderDto> Handle(MarkReminderDoneCommand request, CancellationToken ct)
    {
        var reminder = await _db.Reminders
            .Include(r => r.Plant)
            .FirstOrDefaultAsync(r => r.Id == request.ReminderId && r.UserId == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy reminder.");

        reminder.Status = ReminderStatus.Done;
        reminder.LastDoneAt = DateTime.UtcNow;
        reminder.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new ReminderDto(
            reminder.Id, reminder.PlantId, reminder.Plant?.Name, reminder.Title,
            reminder.CareType.ToApiString(), reminder.DueAt,
            reminder.RepeatRule.ToApiString(), reminder.Status.ToApiString(),
            reminder.LastDoneAt, reminder.Notes, reminder.CreatedAt, reminder.UpdatedAt);
    }
}
