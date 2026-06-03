using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;
using System.Text.Json;

namespace DeskBoost.Application.Features.Notifications.Commands;

public record CreateNotificationCommand : IRequest<AdminNotificationDto>
{
    public Guid AdminId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public string Type { get; init; } = "announcement";
    public string TargetType { get; init; } = "all";
    public List<Guid>? TargetUserIds { get; init; }
}

public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, AdminNotificationDto>
{
    private readonly IAppDbContext _db;

    public CreateNotificationCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminNotificationDto> Handle(CreateNotificationCommand request, CancellationToken ct)
    {
        var entity = new Notification
        {
            Title = request.Title.Trim(),
            Body = request.Body.Trim(),
            Type = request.Type,
            TargetType = request.TargetType,
            TargetUserIdsJson = request.TargetType == "specific" && request.TargetUserIds?.Count > 0
                ? JsonSerializer.Serialize(request.TargetUserIds)
                : null,
            CreatedByAdminId = request.AdminId,
            IsActive = true
        };

        _db.Notifications.Add(entity);
        await _db.SaveChangesAsync(ct);

        return ToDto(entity);
    }

    internal static AdminNotificationDto ToDto(Notification n)
    {
        List<Guid>? targetIds = null;
        if (n.TargetUserIdsJson is not null)
        {
            try { targetIds = JsonSerializer.Deserialize<List<Guid>>(n.TargetUserIdsJson); }
            catch { /* ignore malformed json */ }
        }
        return new AdminNotificationDto(n.Id, n.Title, n.Body, n.Type, n.TargetType, targetIds, n.CreatedByAdminId, n.CreatedAt, n.IsActive);
    }
}
