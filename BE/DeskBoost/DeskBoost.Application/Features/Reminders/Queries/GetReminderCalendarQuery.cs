using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Reminders.Queries;

public record GetReminderCalendarQuery(Guid ReminderId, Guid UserId, string? Format = null) : IRequest<ReminderCalendarDto?>;
