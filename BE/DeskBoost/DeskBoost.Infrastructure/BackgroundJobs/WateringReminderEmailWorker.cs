using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Features.Reminders.Emails;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using DeskBoost.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace DeskBoost.Infrastructure.BackgroundJobs;

public class WateringReminderEmailWorker : BackgroundService
{
    private const string Category = "watering_reminder";
    private const string RelatedEntityType = "Reminder";
    private const int MaxErrorMessageLength = 1000;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WateringReminderEmailWorker> _logger;

    public WateringReminderEmailWorker(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<WateringReminderEmailWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _configuration = configuration;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(GetIntervalMinutes()));

        while (!stoppingToken.IsCancellationRequested)
        {
            await RunOnceAsync(stoppingToken);

            try
            {
                await timer.WaitForNextTickAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }

    private async Task RunOnceAsync(CancellationToken ct)
    {
        if (!IsReminderEmailEnabled())
            return;

        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var emailConfiguration = scope.ServiceProvider.GetRequiredService<IEmailConfiguration>();

            if (!emailConfiguration.IsEnabled)
                return;

            var appBaseUrl = _configuration["Email:AppBaseUrl"];
            if (string.IsNullOrWhiteSpace(appBaseUrl))
            {
                _logger.LogWarning("Reminder email skipped because Email:AppBaseUrl is not configured.");
                return;
            }

            var now = DateTime.UtcNow;
            var from = now.AddHours(-GetDueLookbackHours());
            var batchSize = GetBatchSize();

            var reminders = await db.Reminders
                .Include(r => r.Plant)
                .Where(r => r.IsActive)
                .Where(r => r.Status == ReminderStatus.Pending)
                .Where(r => r.CareType == CareType.Watering)
                .Where(r => r.DueAt <= now && r.DueAt >= from)
                .OrderBy(r => r.DueAt)
                .ThenBy(r => r.Id)
                .Take(batchSize)
                .ToListAsync(ct);

            if (reminders.Count == 0)
                return;

            var userIds = reminders.Select(r => r.UserId).Distinct().ToList();
            var users = await db.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, ct);

            foreach (var reminder in reminders)
            {
                await ProcessReminderAsync(db, emailService, users, reminder, appBaseUrl, ct);
            }
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Watering reminder email worker tick failed.");
        }
    }

    private async Task ProcessReminderAsync(
        AppDbContext db,
        IEmailService emailService,
        IReadOnlyDictionary<Guid, User> users,
        Reminder reminder,
        string appBaseUrl,
        CancellationToken ct)
    {
        if (!users.TryGetValue(reminder.UserId, out var user))
            return;

        if (!user.IsActive || user.Status != UserStatus.Active || string.IsNullOrWhiteSpace(user.Email))
            return;

        var message = WateringReminderEmailTemplate.Build(
            user.Email.Trim(),
            user.FullName,
            reminder.Plant.Name,
            reminder.Title,
            reminder.DueAt,
            appBaseUrl);

        var log = new EmailDeliveryLog
        {
            Category = Category,
            RecipientUserId = user.Id,
            RecipientEmail = user.Email.Trim(),
            Subject = Truncate(message.Subject, 256),
            Provider = _configuration["Email:Provider"] ?? "Unknown",
            Status = "pending",
            IdempotencyKey = BuildIdempotencyKey(reminder),
            RelatedEntityType = RelatedEntityType,
            RelatedEntityId = reminder.Id
        };

        db.EmailDeliveryLogs.Add(log);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (IsUniqueViolation(ex))
        {
            db.Entry(log).State = EntityState.Detached;
            return;
        }

        try
        {
            await emailService.SendEmailAsync(message, ct);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            log.Status = "failed";
            log.ErrorCode = ex.GetType().Name;
            log.ErrorMessage = SanitizeError(ex.Message);
            log.UpdatedAt = DateTime.UtcNow;

            try
            {
                await db.SaveChangesAsync(ct);
            }
            catch (Exception updateEx)
            {
                _logger.LogError(updateEx, "Failed to update reminder email delivery log {LogId}.", log.Id);
            }

            _logger.LogWarning(ex, "Failed to send watering reminder email for reminder {ReminderId}.", reminder.Id);
            return;
        }

        log.Status = "sent";
        log.SentAt = DateTime.UtcNow;
        log.UpdatedAt = DateTime.UtcNow;

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to mark reminder email delivery log {LogId} as sent after provider success.", log.Id);
        }
    }

    private bool IsReminderEmailEnabled() =>
        bool.TryParse(_configuration["ReminderEmail:Enabled"], out var enabled) && enabled;

    private int GetIntervalMinutes() =>
        int.TryParse(_configuration["ReminderEmail:IntervalMinutes"], out var value) && value > 0
            ? value
            : 10;

    private int GetBatchSize() =>
        int.TryParse(_configuration["ReminderEmail:BatchSize"], out var value) && value > 0
            ? Math.Min(value, 100)
            : 25;

    private int GetDueLookbackHours() =>
        int.TryParse(_configuration["ReminderEmail:DueLookbackHours"], out var value) && value > 0
            ? value
            : 24;

    private static string BuildIdempotencyKey(Reminder reminder)
    {
        var dueAtUtc = reminder.DueAt.Kind == DateTimeKind.Utc
            ? reminder.DueAt
            : DateTime.SpecifyKind(reminder.DueAt, DateTimeKind.Utc);
        var roundedTicks = dueAtUtc.Ticks - dueAtUtc.Ticks % TimeSpan.TicksPerMinute;
        return $"watering-reminder:{reminder.Id}:{roundedTicks}";
    }

    private static bool IsUniqueViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException postgresException && postgresException.SqlState == PostgresErrorCodes.UniqueViolation;

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
}