using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Reminders.Commands;

public record DeleteReminderCommand(Guid ReminderId, Guid UserId) : IRequest;

public class DeleteReminderCommandHandler : IRequestHandler<DeleteReminderCommand>
{
    private readonly IAppDbContext _db;

    public DeleteReminderCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteReminderCommand request, CancellationToken ct)
    {
        var reminder = await _db.Reminders
            .FirstOrDefaultAsync(r => r.Id == request.ReminderId && r.UserId == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy reminder.");

        _db.Reminders.Remove(reminder);
        await _db.SaveChangesAsync(ct);
    }
}
