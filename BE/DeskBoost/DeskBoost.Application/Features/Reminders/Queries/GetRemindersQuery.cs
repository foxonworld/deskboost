using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Reminders.Queries;

public record GetRemindersQuery(Guid UserId, Guid? PlantId = null) : IRequest<List<ReminderDto>>;
