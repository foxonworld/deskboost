using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminEmailOperationsSummaryQuery : IRequest<AdminEmailOperationsSummaryDto>;

public record GetAdminEmailOperationsLogsQuery(
    string? Search,
    string? Category,
    string? Status,
    DateTime? DateFrom,
    DateTime? DateTo,
    string? Provider,
    Guid? UserId,
    string? RelatedEntityType,
    Guid? RelatedEntityId,
    int Page = 1,
    int Limit = 20,
    string? Sort = null
) : IRequest<AdminEmailOperationsListDto>;

public class GetAdminEmailOperationsSummaryQueryHandler : IRequestHandler<GetAdminEmailOperationsSummaryQuery, AdminEmailOperationsSummaryDto>
{
    private const int DailyQuotaLimit = 300;
    private readonly IAppDbContext _db;

    public GetAdminEmailOperationsSummaryQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminEmailOperationsSummaryDto> Handle(GetAdminEmailOperationsSummaryQuery request, CancellationToken ct)
    {
        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

        var sentToday = await _db.EmailDeliveryLogs.AsNoTracking()
            .CountAsync(l => l.Status == "sent" && l.SentAt >= todayStart && l.SentAt < todayEnd, ct);
        var failedToday = await _db.EmailDeliveryLogs.AsNoTracking()
            .CountAsync(l => l.Status == "failed" && l.CreatedAt >= todayStart && l.CreatedAt < todayEnd, ct);
        var skippedToday = await _db.EmailDeliveryLogs.AsNoTracking()
            .CountAsync(l => l.Status == "skipped" && l.CreatedAt >= todayStart && l.CreatedAt < todayEnd, ct);
        var pending = await _db.EmailDeliveryLogs.AsNoTracking()
            .CountAsync(l => l.Status == "pending", ct);

        var attemptsToday = sentToday + failedToday;
        var successRate = attemptsToday == 0 ? 0 : Math.Round(sentToday * 100d / attemptsToday, 1);
        var quotaPercent = Math.Round(sentToday * 100d / DailyQuotaLimit, 1);

        var topErrorCode = await _db.EmailDeliveryLogs.AsNoTracking()
            .Where(l => l.Status == "failed" && l.CreatedAt >= todayStart && l.CreatedAt < todayEnd && l.ErrorCode != null && l.ErrorCode != "")
            .GroupBy(l => l.ErrorCode)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync(ct);

        return new AdminEmailOperationsSummaryDto(
            sentToday,
            failedToday,
            pending,
            skippedToday,
            successRate,
            DailyQuotaLimit,
            sentToday,
            quotaPercent,
            topErrorCode
        );
    }
}

public class GetAdminEmailOperationsLogsQueryHandler : IRequestHandler<GetAdminEmailOperationsLogsQuery, AdminEmailOperationsListDto>
{
    private readonly IAppDbContext _db;

    public GetAdminEmailOperationsLogsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminEmailOperationsListDto> Handle(GetAdminEmailOperationsLogsQuery request, CancellationToken ct)
    {
        var page = Math.Max(1, request.Page);
        var limit = Math.Clamp(request.Limit <= 0 ? 20 : request.Limit, 1, 100);
        var query = _db.EmailDeliveryLogs.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(l =>
                l.RecipientEmail.ToLower().Contains(search) ||
                l.Subject.ToLower().Contains(search) ||
                (l.ErrorCode != null && l.ErrorCode.ToLower().Contains(search)) ||
                (l.ErrorMessage != null && l.ErrorMessage.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var category = request.Category.Trim().ToLower();
            query = query.Where(l => l.Category.ToLower() == category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = request.Status.Trim().ToLower();
            query = query.Where(l => l.Status.ToLower() == status);
        }

        if (!string.IsNullOrWhiteSpace(request.Provider))
        {
            var provider = request.Provider.Trim().ToLower();
            query = query.Where(l => l.Provider.ToLower() == provider);
        }

        if (request.UserId.HasValue)
            query = query.Where(l => l.RecipientUserId == request.UserId.Value);

        if (!string.IsNullOrWhiteSpace(request.RelatedEntityType))
        {
            var relatedEntityType = request.RelatedEntityType.Trim().ToLower();
            query = query.Where(l => l.RelatedEntityType != null && l.RelatedEntityType.ToLower() == relatedEntityType);
        }

        if (request.RelatedEntityId.HasValue)
            query = query.Where(l => l.RelatedEntityId == request.RelatedEntityId.Value);

        if (request.DateFrom.HasValue)
            query = query.Where(l => l.CreatedAt >= ToUtc(request.DateFrom.Value));

        if (request.DateTo.HasValue)
        {
            var dateTo = ToUtc(request.DateTo.Value);
            var exclusiveEnd = dateTo.TimeOfDay == TimeSpan.Zero ? dateTo.AddDays(1) : dateTo;
            query = query.Where(l => l.CreatedAt < exclusiveEnd);
        }

        query = (request.Sort ?? string.Empty).Trim().ToLowerInvariant() switch
        {
            "createdat_asc" or "created_asc" => query.OrderBy(l => l.CreatedAt),
            "sentat_desc" or "sent_desc" => query.OrderByDescending(l => l.SentAt ?? l.CreatedAt),
            "status_asc" => query.OrderBy(l => l.Status).ThenByDescending(l => l.CreatedAt),
            _ => query.OrderByDescending(l => l.CreatedAt)
        };

        var total = await query.CountAsync(ct);
        var logs = await query.Skip((page - 1) * limit).Take(limit).ToListAsync(ct);
        var userIds = logs.Where(l => l.RecipientUserId.HasValue).Select(l => l.RecipientUserId!.Value).Distinct().ToList();
        var users = await _db.Users.AsNoTracking()
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => string.IsNullOrWhiteSpace(u.FullName) ? u.Email : u.FullName, ct);
        var preferences = await _db.UserEmailPreferences.AsNoTracking()
            .Where(p => userIds.Contains(p.UserId))
            .ToDictionaryAsync(p => p.UserId, ct);

        var items = logs.Select(l => new AdminEmailOperationsLogRowDto(
            l.Id,
            l.RecipientUserId,
            l.RecipientEmail,
            l.RecipientUserId.HasValue && users.TryGetValue(l.RecipientUserId.Value, out var userName) ? userName : null,
            l.Category,
            l.Subject,
            l.Status,
            l.Provider,
            l.SentAt,
            l.CreatedAt,
            l.ErrorCode,
            SanitizeError(l.ErrorMessage),
            l.RelatedEntityType,
            l.RelatedEntityId,
            l.RecipientUserId.HasValue ? ToPreferenceDto(l.RecipientUserId.Value, preferences.GetValueOrDefault(l.RecipientUserId.Value)) : null
        )).ToList();

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)limit);
        return new AdminEmailOperationsListDto(items, new AdminOperationsPaginationDto(page, limit, total, totalPages));
    }

    private static DateTime ToUtc(DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc => value,
        DateTimeKind.Local => value.ToUniversalTime(),
        _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
    };

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

    private static string? SanitizeError(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return value;
        var sanitized = value.Replace("\r", " ").Replace("\n", " ").Trim();
        return sanitized.Length <= 500 ? sanitized : sanitized[..500];
    }
}
