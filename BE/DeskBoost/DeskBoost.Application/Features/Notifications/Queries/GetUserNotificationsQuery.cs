using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.Notifications.Queries;

public record GetUserNotificationsQuery(Guid UserId) : IRequest<List<NotificationItemDto>>;

public class GetUserNotificationsQueryHandler : IRequestHandler<GetUserNotificationsQuery, List<NotificationItemDto>>
{
    private readonly IAppDbContext _db;

    public GetUserNotificationsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<NotificationItemDto>> Handle(GetUserNotificationsQuery request, CancellationToken ct)
    {
        var notifications = await _db.Notifications
            .Where(n => n.IsActive)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct);

        var readIdList = await _db.NotificationReads
            .Where(r => r.UserId == request.UserId)
            .Select(r => r.NotificationId)
            .ToListAsync(ct);
        var readIds = readIdList.ToHashSet();

        return notifications
            .Where(n => IsVisibleToUser(n, request.UserId))
            .Select(n => new NotificationItemDto(
                n.Id, n.Title, n.Body, n.Type, n.CreatedAt, readIds.Contains(n.Id)))
            .ToList();
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
