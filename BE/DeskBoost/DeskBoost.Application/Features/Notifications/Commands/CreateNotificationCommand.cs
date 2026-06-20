using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace DeskBoost.Application.Features.Notifications.Commands;

public record CreateNotificationCommand : IRequest<AdminNotificationDto>
{
    public Guid AdminId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public string Type { get; init; } = "announcement";
    public string TargetType { get; init; } = "all";
    public List<string>? TargetUserIds { get; init; }
}

public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, AdminNotificationDto>
{
    private const string EmailCategory = "admin_notification";
    private const string RelatedEntityType = "Notification";
    private const int MaxErrorMessageLength = 1000;
    private readonly IAppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly IEmailConfiguration _emailConfiguration;

    public CreateNotificationCommandHandler(
        IAppDbContext db,
        IEmailService emailService,
        IEmailConfiguration emailConfiguration)
    {
        _db = db;
        _emailService = emailService;
        _emailConfiguration = emailConfiguration;
    }

    public async Task<AdminNotificationDto> Handle(CreateNotificationCommand request, CancellationToken ct)
    {
        var targetUsers = await GetTargetUsersAsync(request, ct);
        var targetUserIds = targetUsers.Select(u => u.Id).ToList();

        if (request.TargetType == "specific" && targetUserIds.Count == 0)
            throw new ValidationException("Không tìm thấy user nhận thông báo.");

        var entity = new Notification
        {
            Title = request.Title.Trim(),
            Body = request.Body.Trim(),
            Type = request.Type,
            TargetType = request.TargetType,
            TargetUserIdsJson = request.TargetType == "specific"
                ? JsonSerializer.Serialize(targetUserIds)
                : null,
            CreatedByAdminId = request.AdminId,
            IsActive = true
        };

        _db.Notifications.Add(entity);
        await _db.SaveChangesAsync(ct);

        await SendNotificationEmailsAsync(entity, targetUsers, ct);

        return ToDto(entity);
    }

    private async Task SendNotificationEmailsAsync(Notification notification, IReadOnlyList<User> targetUsers, CancellationToken ct)
    {
        var users = targetUsers
            .Where(u => !string.IsNullOrWhiteSpace(u.Email))
            .ToList();

        if (users.Count == 0)
            return;

        var userIds = users.Select(u => u.Id).ToList();
        var preferences = await _db.UserEmailPreferences
            .AsNoTracking()
            .Where(p => userIds.Contains(p.UserId))
            .ToDictionaryAsync(p => p.UserId, ct);

        foreach (var user in users)
        {
            if (!_emailConfiguration.IsEnabled)
            {
                await WriteSkippedEmailLogAsync(notification, user, "EMAIL_DISABLED", "Email delivery disabled by configuration.", ct);
                continue;
            }

            if (preferences.TryGetValue(user.Id, out var preference) &&
                (!preference.EmailEnabled || !preference.AdminNotificationEmailEnabled))
            {
                await WriteSkippedEmailLogAsync(notification, user, "ADMIN_NOTIFICATION_EMAIL_SUPPRESSED", "Admin notification email disabled for user.", ct);
                continue;
            }

            await SendOneEmailAsync(notification, user, ct);
        }
    }

    private async Task<List<User>> GetTargetUsersAsync(CreateNotificationCommand request, CancellationToken ct)
    {
        var query = _db.Users
            .Where(u => u.IsActive)
            .Where(u => u.Status == UserStatus.Active);

        if (request.TargetType == "specific")
        {
            var targets = request.TargetUserIds?
                .Select(v => v.Trim())
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? [];
            if (targets.Count == 0)
                return [];

            var targetIds = targets
                .Where(v => Guid.TryParse(v, out _))
                .Select(Guid.Parse)
                .ToList();
            var targetEmails = targets
                .Where(v => !Guid.TryParse(v, out _))
                .Select(v => v.ToLower())
                .ToList();

            query = query.Where(u =>
                targetIds.Contains(u.Id) ||
                targetEmails.Contains(u.Email.ToLower()));
        }

        return await query.ToListAsync(ct);
    }

    private async Task SendOneEmailAsync(Notification notification, User user, CancellationToken ct)
    {
        var log = CreateEmailLog(notification, user, "pending");
        _db.EmailDeliveryLogs.Add(log);
        await _db.SaveChangesAsync(ct);

        try
        {
            var message = BuildEmailMessage(notification, user);
            await _emailService.SendEmailAsync(message, ct);

            log.Status = "sent";
            log.SentAt = DateTime.UtcNow;
            log.UpdatedAt = DateTime.UtcNow;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            log.Status = "failed";
            log.ErrorCode = ex.GetType().Name;
            log.ErrorMessage = SanitizeError(ex.Message);
            log.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);
    }

    private async Task WriteSkippedEmailLogAsync(Notification notification, User user, string errorCode, string errorMessage, CancellationToken ct)
    {
        var log = CreateEmailLog(notification, user, "skipped");
        log.ErrorCode = errorCode;
        log.ErrorMessage = errorMessage;

        _db.EmailDeliveryLogs.Add(log);
        await _db.SaveChangesAsync(ct);
    }

    private static EmailDeliveryLog CreateEmailLog(Notification notification, User user, string status) => new()
    {
        Category = EmailCategory,
        RecipientUserId = user.Id,
        RecipientEmail = user.Email.Trim(),
        Subject = Truncate(notification.Title, 256),
        Provider = "BrevoApi",
        Status = status,
        IdempotencyKey = $"admin-notification:{notification.Id}:{user.Id}",
        RelatedEntityType = RelatedEntityType,
        RelatedEntityId = notification.Id
    };

    private static EmailMessage BuildEmailMessage(Notification notification, User user)
    {
        var title = WebUtility.HtmlEncode(notification.Title);
        var body = WebUtility.HtmlEncode(notification.Body).ReplaceLineEndings("<br>");
        var textBody = notification.Body.Trim();

        var html = $"""
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
              <p>Xin chào {WebUtility.HtmlEncode(user.FullName)},</p>
              <h2 style="color:#2e7d32">{title}</h2>
              <p>{body}</p>
              <p style="color:#6b7280;font-size:13px">Thông báo từ DeskBoost.</p>
            </div>
            """;

        var text = $"Xin chào {user.FullName},\n\n{notification.Title}\n\n{textBody}\n\nThông báo từ DeskBoost.";
        return new EmailMessage(user.Email.Trim(), user.FullName, notification.Title, html, text);
    }

    private static string Truncate(string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            return value;

        return value[..maxLength];
    }

    private static string SanitizeError(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
            return string.Empty;

        var sanitized = message.ReplaceLineEndings(" ").Trim();
        return Truncate(sanitized, MaxErrorMessageLength);
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
