using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Notifications.Commands;

public record DeleteNotificationCommand(Guid NotificationId) : IRequest;

public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand>
{
    private readonly IAppDbContext _db;

    public DeleteNotificationCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteNotificationCommand request, CancellationToken ct)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy thông báo.");

        notification.IsActive = false;
        notification.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }
}
