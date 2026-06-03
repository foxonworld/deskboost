using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Notifications.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Notifications.Queries;

public record GetAdminNotificationsQuery : IRequest<List<AdminNotificationDto>>;

public class GetAdminNotificationsQueryHandler : IRequestHandler<GetAdminNotificationsQuery, List<AdminNotificationDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminNotificationsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminNotificationDto>> Handle(GetAdminNotificationsQuery request, CancellationToken ct)
    {
        var rows = await _db.Notifications
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct);

        return rows.Select(CreateNotificationCommandHandler.ToDto).ToList();
    }
}
