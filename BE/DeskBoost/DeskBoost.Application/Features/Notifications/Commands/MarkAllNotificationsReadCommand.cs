using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.Notifications.Commands;

public record MarkAllNotificationsReadCommand(Guid UserId) : IRequest;

public class MarkAllNotificationsReadCommandHandler : IRequestHandler<MarkAllNotificationsReadCommand>
{
    private readonly IAppDbContext _db;

    public MarkAllNotificationsReadCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(MarkAllNotificationsReadCommand request, CancellationToken ct)
    {
        var notifications = await _db.Notifications
            .Where(n => n.IsActive)
            .ToListAsync(ct);

        var alreadyReadList = await _db.NotificationReads
            .Where(r => r.UserId == request.UserId)
            .Select(r => r.NotificationId)
            .ToListAsync(ct);
        var alreadyReadIds = alreadyReadList.ToHashSet();

        var now = DateTime.UtcNow;
        var newReads = notifications
            .Where(n => IsVisibleToUser(n, request.UserId) && !alreadyReadIds.Contains(n.Id))
            .Select(n => new NotificationRead
            {
                NotificationId = n.Id,
                UserId = request.UserId,
                ReadAt = now
            })
            .ToList();

        if (newReads.Count > 0)
        {
            _db.NotificationReads.AddRange(newReads);
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
