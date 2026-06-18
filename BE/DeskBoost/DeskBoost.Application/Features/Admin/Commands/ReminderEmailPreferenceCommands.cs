using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.Admin.Commands;

public record SuppressReminderEmailCommand(Guid UserId, Guid ActorAdminId, string Reason, string? IpAddress, string? UserAgent) : IRequest<UserEmailPreferenceDto>;
public record UnsuppressReminderEmailCommand(Guid UserId, Guid ActorAdminId, string Reason, string? IpAddress, string? UserAgent) : IRequest<UserEmailPreferenceDto>;

public class SuppressReminderEmailCommandHandler : IRequestHandler<SuppressReminderEmailCommand, UserEmailPreferenceDto>
{
    private readonly IAppDbContext _db;

    public SuppressReminderEmailCommandHandler(IAppDbContext db) => _db = db;

    public async Task<UserEmailPreferenceDto> Handle(SuppressReminderEmailCommand request, CancellationToken ct)
    {
        var reason = ValidateReason(request.Reason, "Lý do suppress reminder email phải từ 10 đến 500 ký tự.");
        await EnsureUserExists(request.UserId, ct);

        var preference = await _db.UserEmailPreferences.FirstOrDefaultAsync(p => p.UserId == request.UserId, ct);
        if (preference is null)
        {
            preference = new UserEmailPreference { UserId = request.UserId };
            _db.UserEmailPreferences.Add(preference);
        }

        if (!preference.ReminderEmailEnabled)
            return ToDto(preference);

        var beforeJson = ToSafeJson(preference);
        var now = DateTime.UtcNow;

        preference.ReminderEmailEnabled = false;
        preference.SuppressedReason = reason;
        preference.SuppressedByAdminId = request.ActorAdminId;
        preference.SuppressedAt = now;
        preference.UpdatedAt = now;

        var afterJson = ToSafeJson(preference);
        AddAudit(preference, request.ActorAdminId, request.UserId, "email_preferences.suppress_reminder_email", reason, beforeJson, afterJson, request.IpAddress, request.UserAgent);

        await _db.SaveChangesAsync(ct);
        return ToDto(preference);
    }

    private async Task EnsureUserExists(Guid userId, CancellationToken ct)
    {
        if (!await _db.Users.AsNoTracking().AnyAsync(u => u.Id == userId, ct))
            throw new NotFoundException($"Không tìm thấy User với ID {userId}");
    }

    private void AddAudit(UserEmailPreference preference, Guid actorAdminId, Guid targetUserId, string action, string reason, string beforeJson, string afterJson, string? ipAddress, string? userAgent)
    {
        _db.AdminAuditLogs.Add(new AdminAuditLog
        {
            ActorAdminId = actorAdminId,
            Action = action,
            EntityType = "UserEmailPreferences",
            EntityId = preference.Id.ToString(),
            TargetUserId = targetUserId,
            Reason = reason,
            BeforeJson = beforeJson,
            AfterJson = afterJson,
            IpAddress = ipAddress,
            UserAgent = userAgent
        });
    }

    private static string ValidateReason(string reason, string message) => UserEmailPreferenceCommandHelpers.ValidateReason(reason, message);
    private static string ToSafeJson(UserEmailPreference preference) => UserEmailPreferenceCommandHelpers.ToSafeJson(preference);
    private static UserEmailPreferenceDto ToDto(UserEmailPreference preference) => UserEmailPreferenceCommandHelpers.ToDto(preference);
}

public class UnsuppressReminderEmailCommandHandler : IRequestHandler<UnsuppressReminderEmailCommand, UserEmailPreferenceDto>
{
    private readonly IAppDbContext _db;

    public UnsuppressReminderEmailCommandHandler(IAppDbContext db) => _db = db;

    public async Task<UserEmailPreferenceDto> Handle(UnsuppressReminderEmailCommand request, CancellationToken ct)
    {
        var reason = UserEmailPreferenceCommandHelpers.ValidateReason(request.Reason, "Lý do unsuppress reminder email phải từ 10 đến 500 ký tự.");
        if (!await _db.Users.AsNoTracking().AnyAsync(u => u.Id == request.UserId, ct))
            throw new NotFoundException($"Không tìm thấy User với ID {request.UserId}");

        var preference = await _db.UserEmailPreferences.FirstOrDefaultAsync(p => p.UserId == request.UserId, ct);
        if (preference is null)
        {
            preference = new UserEmailPreference { UserId = request.UserId };
            _db.UserEmailPreferences.Add(preference);
            await _db.SaveChangesAsync(ct);
            return UserEmailPreferenceCommandHelpers.ToDto(preference);
        }

        if (preference.ReminderEmailEnabled && preference.SuppressedReason is null && preference.SuppressedByAdminId is null && preference.SuppressedAt is null)
            return UserEmailPreferenceCommandHelpers.ToDto(preference);

        var beforeJson = UserEmailPreferenceCommandHelpers.ToSafeJson(preference);
        var now = DateTime.UtcNow;

        preference.ReminderEmailEnabled = true;
        preference.SuppressedReason = null;
        preference.SuppressedByAdminId = null;
        preference.SuppressedAt = null;
        preference.UpdatedAt = now;

        var afterJson = UserEmailPreferenceCommandHelpers.ToSafeJson(preference);
        _db.AdminAuditLogs.Add(new AdminAuditLog
        {
            ActorAdminId = request.ActorAdminId,
            Action = "email_preferences.unsuppress_reminder_email",
            EntityType = "UserEmailPreferences",
            EntityId = preference.Id.ToString(),
            TargetUserId = request.UserId,
            Reason = reason,
            BeforeJson = beforeJson,
            AfterJson = afterJson,
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent
        });

        await _db.SaveChangesAsync(ct);
        return UserEmailPreferenceCommandHelpers.ToDto(preference);
    }
}

internal static class UserEmailPreferenceCommandHelpers
{
    public static string ValidateReason(string reason, string message)
    {
        var trimmed = reason?.Trim() ?? string.Empty;
        if (trimmed.Length < 10 || trimmed.Length > 500)
            throw new ValidationException(message);

        return trimmed;
    }

    public static string ToSafeJson(UserEmailPreference preference) => JsonSerializer.Serialize(new
    {
        preference.UserId,
        preference.EmailEnabled,
        preference.ReminderEmailEnabled,
        preference.AdminNotificationEmailEnabled,
        preference.SecurityEmailEnabled,
        preference.SuppressedReason,
        preference.SuppressedByAdminId,
        preference.SuppressedAt
    });

    public static UserEmailPreferenceDto ToDto(UserEmailPreference preference) => new(
        preference.UserId,
        preference.EmailEnabled,
        preference.ReminderEmailEnabled,
        preference.AdminNotificationEmailEnabled,
        preference.SecurityEmailEnabled,
        preference.SuppressedReason,
        preference.SuppressedByAdminId,
        preference.SuppressedAt,
        preference.UpdatedAt
    );

    public static UserEmailPreferenceDto DefaultDto(Guid userId) => new(
        userId,
        true,
        true,
        true,
        true,
        null,
        null,
        null,
        null
    );
}
