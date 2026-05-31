using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Reminders.Queries;

public record GetRemindersQuery(Guid UserId) : IRequest<List<ReminderDto>>;
