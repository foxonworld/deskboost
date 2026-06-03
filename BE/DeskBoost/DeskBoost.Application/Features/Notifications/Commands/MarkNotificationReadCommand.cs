using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.Notifications.Commands;

public record MarkNotificationReadCommand(Guid UserId, Guid NotificationId) : IRequest;

public class MarkNotificationReadCommandHandler : IRequestHandler<MarkNotificationReadCommand>
{
    private readonly IAppDbContext _db;

    public MarkNotificationReadCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(MarkNotificationReadCommand request, CancellationToken ct)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId && n.IsActive, ct)
            ?? throw new InvalidOperationException("Không tìm thấy thông báo.");

        // Validate notification visible to user
        if (!IsVisibleToUser(notification, request.UserId))
            throw new InvalidOperationException("Thông báo này không dành cho bạn.");

        var already = await _db.NotificationReads
            .AnyAsync(r => r.NotificationId == request.NotificationId && r.UserId == request.UserId, ct);

        if (!already)
        {
            _db.NotificationReads.Add(new NotificationRead
            {
                NotificationId = request.NotificationId,
                UserId = request.UserId,
                ReadAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync(ct);
        }
    }

    private static bool IsVisibleToUser(Notification n, Guid userId)
    {
        if (n.TargetType == "all") return true;
        if (n.TargetUserIdsJson is null) return false;
        try
        {
            var ids = JsonSerializer.Deserialize<List<Guid>>(n.TargetUserIdsJson);
            return ids?.Contains(userId) ?? false;
        }
        catch { return false; }
    }
}
