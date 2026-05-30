using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Commands;

public record UpdateReminderCommand : IRequest<ReminderDto>
{
    public Guid ReminderId { get; init; }
    public Guid UserId { get; init; }
    public string? Title { get; init; }
    public string? CareType { get; init; }
    public DateTime? DueAt { get; init; }
    public string? RepeatRule { get; init; }
    public string? Notes { get; init; }
}

public class UpdateReminderCommandHandler : IRequestHandler<UpdateReminderCommand, ReminderDto>
{
    private readonly IAppDbContext _db;

    public UpdateReminderCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReminderDto> Handle(UpdateReminderCommand request, CancellationToken ct)
    {
        var reminder = await _db.Reminders
            .Include(r => r.Plant)
            .FirstOrDefaultAsync(r => r.Id == request.ReminderId && r.UserId == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy reminder.");

        if (!string.IsNullOrWhiteSpace(request.Title)) reminder.Title = request.Title.Trim();
        if (!string.IsNullOrWhiteSpace(request.CareType)) reminder.CareType = request.CareType.ToCareType();
        if (request.DueAt.HasValue) reminder.DueAt = request.DueAt.Value;
        if (request.RepeatRule is not null) reminder.RepeatRule = request.RepeatRule.ToRepeatRule();
        if (request.Notes is not null) reminder.Notes = request.Notes.Trim();
        reminder.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new ReminderDto(
            reminder.Id, reminder.PlantId, reminder.Plant?.Name, reminder.Title,
            reminder.CareType.ToApiString(), reminder.DueAt,
            reminder.RepeatRule.ToApiString(), reminder.Status.ToApiString(),
            reminder.LastDoneAt, reminder.Notes, reminder.CreatedAt, reminder.UpdatedAt);
    }
}
