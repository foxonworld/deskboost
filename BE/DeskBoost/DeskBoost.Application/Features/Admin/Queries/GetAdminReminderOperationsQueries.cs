using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminReminderOperationsSummaryQuery : IRequest<AdminReminderOperationsSummaryDto>;

public record GetAdminReminderOperationsRemindersQuery(
    string? Search,
    string? CareType,
    string? Status,
    bool? IsActive,
    string? DueBucket,
    string? EmailStatus,
    string? RiskLevel,
    int Page = 1,
    int Limit = 20,
    string? Sort = null
) : IRequest<AdminReminderOperationsListDto>;

public class GetAdminReminderOperationsSummaryQueryHandler : IRequestHandler<GetAdminReminderOperationsSummaryQuery, AdminReminderOperationsSummaryDto>
{
    private readonly IAppDbContext _db;

    public GetAdminReminderOperationsSummaryQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminReminderOperationsSummaryDto> Handle(GetAdminReminderOperationsSummaryQuery request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var todayEnd = todayStart.AddDays(1);
        var next24h = now.AddHours(24);

        var activeCounts = await _db.Reminders
            .AsNoTracking()
            .Where(r => r.IsActive)
            .GroupBy(r => r.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        return new AdminReminderOperationsSummaryDto(
            TotalReminders: await _db.Reminders.AsNoTracking().CountAsync(ct),
            ActiveReminders: await _db.Reminders.AsNoTracking().CountAsync(r => r.IsActive, ct),
            DueToday: await _db.Reminders.AsNoTracking().CountAsync(r => r.IsActive && r.DueAt >= todayStart && r.DueAt < todayEnd, ct),
            Overdue: await _db.Reminders.AsNoTracking().CountAsync(r => r.IsActive && r.Status == ReminderStatus.Pending && r.DueAt < now, ct),
            Disabled: await _db.Reminders.AsNoTracking().CountAsync(r => !r.IsActive, ct),
            Watering: await _db.Reminders.AsNoTracking().CountAsync(r => r.CareType == CareType.Watering, ct),
            Fertilizing: await _db.Reminders.AsNoTracking().CountAsync(r => r.CareType == CareType.Fertilizing, ct),
            Other: await _db.Reminders.AsNoTracking().CountAsync(r => r.CareType == CareType.Repotting || r.CareType == CareType.Other, ct),
            PendingEmailLoadNext24h: await _db.Reminders.AsNoTracking().CountAsync(r => r.IsActive && r.Status == ReminderStatus.Pending && r.CareType == CareType.Watering && r.DueAt >= now && r.DueAt <= next24h, ct),
            CriticalUsers: activeCounts.Count(x => x.Count >= 100)
        );
    }
}

public class GetAdminReminderOperationsRemindersQueryHandler : IRequestHandler<GetAdminReminderOperationsRemindersQuery, AdminReminderOperationsListDto>
{
    private readonly IAppDbContext _db;

    public GetAdminReminderOperationsRemindersQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminReminderOperationsListDto> Handle(GetAdminReminderOperationsRemindersQuery request, CancellationToken ct)
    {
        var page = Math.Max(1, request.Page);
        var limit = Math.Clamp(request.Limit <= 0 ? 20 : request.Limit, 1, 100);
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var todayEnd = todayStart.AddDays(1);

        var query = from reminder in _db.Reminders.AsNoTracking()
                    join user in _db.Users.AsNoTracking() on reminder.UserId equals user.Id
                    join plant in _db.Plants.AsNoTracking() on reminder.PlantId equals plant.Id
                    select new { reminder, user, plant };

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x =>
                x.user.Email.ToLower().Contains(search) ||
                x.user.FullName.ToLower().Contains(search) ||
                x.plant.Name.ToLower().Contains(search) ||
                x.reminder.Title.ToLower().Contains(search));
        }

        if (TryCareType(request.CareType, out var careType))
            query = query.Where(x => x.reminder.CareType == careType);

        if (TryStatus(request.Status, out var status))
            query = query.Where(x => x.reminder.Status == status);

        if (request.IsActive.HasValue)
            query = query.Where(x => x.reminder.IsActive == request.IsActive.Value);

        query = (request.DueBucket ?? string.Empty).Trim().ToLowerInvariant() switch
        {
            "today" => query.Where(x => x.reminder.DueAt >= todayStart && x.reminder.DueAt < todayEnd),
            "overdue" => query.Where(x => x.reminder.IsActive && x.reminder.Status == ReminderStatus.Pending && x.reminder.DueAt < now),
            "next7days" => query.Where(x => x.reminder.DueAt >= now && x.reminder.DueAt < now.AddDays(7)),
            _ => query
        };

        var rawRows = await query.ToListAsync(ct);
        var activeCounts = await _db.Reminders.AsNoTracking()
            .Where(r => r.IsActive)
            .GroupBy(r => r.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.UserId, x => x.Count, ct);

        var reminderIds = rawRows.Select(x => x.reminder.Id).ToHashSet();
        var userIds = rawRows.Select(x => x.user.Id).Distinct().ToList();
        var preferences = await _db.UserEmailPreferences.AsNoTracking()
            .Where(p => userIds.Contains(p.UserId))
            .ToDictionaryAsync(p => p.UserId, ct);
        var emailLogs = await _db.EmailDeliveryLogs.AsNoTracking()
            .Where(l => l.RelatedEntityType != null && l.RelatedEntityId.HasValue && reminderIds.Contains(l.RelatedEntityId.Value))
            .ToListAsync(ct);

        var rows = rawRows.Select(x =>
        {
            var logs = emailLogs
                .Where(l => l.RelatedEntityId == x.reminder.Id && string.Equals(l.RelatedEntityType, "Reminder", StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(l => l.SentAt ?? l.CreatedAt)
                .ToList();
            var lastLog = logs.FirstOrDefault();
            var activeCount = activeCounts.GetValueOrDefault(x.reminder.UserId);

            return new AdminReminderOperationsRowDto(
                x.reminder.Id,
                x.user.Id,
                string.IsNullOrWhiteSpace(x.user.FullName) ? x.user.Email : x.user.FullName,
                x.user.Email,
                x.plant.Id,
                string.IsNullOrWhiteSpace(x.plant.Nickname) ? x.plant.Name : x.plant.Nickname,
                x.reminder.Title,
                x.reminder.CareType.ToApiString(),
                x.reminder.DueAt,
                x.reminder.RepeatRule.ToApiString(),
                x.reminder.Status.ToApiString(),
                x.reminder.IsActive,
                x.reminder.LastDoneAt,
                lastLog?.Status ?? "never-sent",
                lastLog?.SentAt,
                logs.Count(l => string.Equals(l.Status, "sent", StringComparison.OrdinalIgnoreCase)),
                ToRiskLevel(activeCount),
                ToPreferenceDto(x.user.Id, preferences.GetValueOrDefault(x.user.Id))
            );
        }).ToList();

        if (!string.IsNullOrWhiteSpace(request.EmailStatus))
        {
            var emailStatus = request.EmailStatus.Trim().ToLowerInvariant();
            rows = rows.Where(r => r.LastEmailStatus.Equals(emailStatus, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.RiskLevel))
        {
            var riskLevel = request.RiskLevel.Trim().ToLowerInvariant();
            rows = rows.Where(r => r.RiskLevel.Equals(riskLevel, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        rows = SortRows(rows, request.Sort).ToList();
        var total = rows.Count;
        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)limit);
        var items = rows.Skip((page - 1) * limit).Take(limit).ToList();

        return new AdminReminderOperationsListDto(items, new AdminOperationsPaginationDto(page, limit, total, totalPages));
    }

    private static UserEmailPreferenceDto ToPreferenceDto(Guid userId, UserEmailPreference? preference) => preference is null
        ? new UserEmailPreferenceDto(userId, true, true, true, true, null, null, null, null)
        : new UserEmailPreferenceDto(
            preference.UserId,
            preference.EmailEnabled,
            preference.ReminderEmailEnabled,
            preference.AdminNotificationEmailEnabled,
            preference.SecurityEmailEnabled,
            preference.SuppressedReason,
            preference.SuppressedByAdminId,
            preference.SuppressedAt,
            preference.UpdatedAt);

    private static IEnumerable<AdminReminderOperationsRowDto> SortRows(IEnumerable<AdminReminderOperationsRowDto> rows, string? sort) =>
        (sort ?? string.Empty).Trim().ToLowerInvariant() switch
        {
            "dueat_asc" or "dueat" => rows.OrderBy(r => r.DueAt),
            "risk_desc" => rows.OrderByDescending(r => RiskRank(r.RiskLevel)).ThenBy(r => r.DueAt),
            "email_desc" => rows.OrderByDescending(r => r.LastEmailSentAt ?? DateTime.MinValue),
            _ => rows.OrderByDescending(r => r.DueAt)
        };

    private static bool TryCareType(string? value, out CareType careType)
    {
        switch ((value ?? string.Empty).Trim().ToLowerInvariant())
        {
            case "watering": careType = CareType.Watering; return true;
            case "fertilizing": careType = CareType.Fertilizing; return true;
            case "repotting": careType = CareType.Repotting; return true;
            case "other": careType = CareType.Other; return true;
            default: careType = CareType.Watering; return false;
        }
    }

    private static bool TryStatus(string? value, out ReminderStatus status)
    {
        switch ((value ?? string.Empty).Trim().ToLowerInvariant())
        {
            case "pending": status = ReminderStatus.Pending; return true;
            case "done": status = ReminderStatus.Done; return true;
            default: status = ReminderStatus.Pending; return false;
        }
    }

    private static string ToRiskLevel(int activeReminderCount) => activeReminderCount switch
    {
        >= 100 => "critical",
        >= 50 => "high",
        >= 20 => "warning",
        _ => "normal"
    };

    private static int RiskRank(string riskLevel) => riskLevel switch
    {
        "critical" => 4,
        "high" => 3,
        "warning" => 2,
        _ => 1
    };
}
