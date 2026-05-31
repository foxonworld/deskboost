using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Commands;

public record CreateReminderCommand : IRequest<ReminderDto>
{
    public Guid UserId { get; init; }
    public Guid PlantId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string CareType { get; init; } = "watering";
    public DateTime DueAt { get; init; }
    public string? RepeatRule { get; init; }
    public string? Notes { get; init; }
}

public class CreateReminderCommandHandler : IRequestHandler<CreateReminderCommand, ReminderDto>
{
    private readonly IAppDbContext _db;

    public CreateReminderCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReminderDto> Handle(CreateReminderCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants
            .FirstOrDefaultAsync(p => p.Id == request.PlantId && p.UserId == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây hoặc cây không thuộc người dùng này.");

        var reminder = new Reminder
        {
            UserId = request.UserId,
            PlantId = request.PlantId,
            Title = request.Title.Trim(),
            CareType = request.CareType.ToCareType(),
            DueAt = request.DueAt,
            RepeatRule = request.RepeatRule.ToRepeatRule(),
            Notes = request.Notes?.Trim(),
            Status = ReminderStatus.Pending
        };

        _db.Reminders.Add(reminder);
        await _db.SaveChangesAsync(ct);

        return new ReminderDto(
            reminder.Id, reminder.PlantId, plant.Name, reminder.Title,
            reminder.CareType.ToApiString(), reminder.DueAt,
            reminder.RepeatRule.ToApiString(), reminder.Status.ToApiString(),
            reminder.LastDoneAt, reminder.Notes, reminder.CreatedAt, reminder.UpdatedAt);
    }
}
