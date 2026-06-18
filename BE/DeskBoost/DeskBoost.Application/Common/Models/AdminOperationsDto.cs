namespace DeskBoost.Application.Common.Models;

public record AdminOperationsPaginationDto(int Page, int Limit, int Total, int TotalPages);

public record UserEmailPreferenceDto(
    Guid UserId,
    bool EmailEnabled,
    bool ReminderEmailEnabled,
    bool AdminNotificationEmailEnabled,
    bool SecurityEmailEnabled,
    string? SuppressedReason,
    Guid? SuppressedByAdminId,
    DateTime? SuppressedAt,
    DateTime? UpdatedAt
);

public record AdminReminderOperationsSummaryDto(
    int TotalReminders,
    int ActiveReminders,
    int DueToday,
    int Overdue,
    int Disabled,
    int Watering,
    int Fertilizing,
    int Other,
    int PendingEmailLoadNext24h,
    int CriticalUsers
);

public record AdminReminderOperationsRowDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string UserEmail,
    Guid PlantId,
    string PlantName,
    string Title,
    string CareType,
    DateTime DueAt,
    string? RepeatRule,
    string Status,
    bool IsActive,
    DateTime? LastDoneAt,
    string LastEmailStatus,
    DateTime? LastEmailSentAt,
    int EmailSendCount,
    string RiskLevel,
    UserEmailPreferenceDto EmailPreference
);

public record AdminReminderOperationsListDto(
    IReadOnlyList<AdminReminderOperationsRowDto> Items,
    AdminOperationsPaginationDto Pagination
);

public record AdminEmailOperationsSummaryDto(
    int SentToday,
    int FailedToday,
    int Pending,
    int SkippedToday,
    double SuccessRate,
    int DailyQuotaLimit,
    int DailyQuotaUsed,
    double DailyQuotaPercent,
    string? TopErrorCode
);

public record AdminEmailOperationsLogRowDto(
    Guid Id,
    Guid? RecipientUserId,
    string RecipientEmail,
    string? UserName,
    string Category,
    string Subject,
    string Status,
    string Provider,
    DateTime? SentAt,
    DateTime CreatedAt,
    string? ErrorCode,
    string? ErrorMessage,
    string? RelatedEntityType,
    Guid? RelatedEntityId,
    UserEmailPreferenceDto? EmailPreference
);

public record AdminEmailOperationsListDto(
    IReadOnlyList<AdminEmailOperationsLogRowDto> Items,
    AdminOperationsPaginationDto Pagination
);

public record ReminderGovernanceRequestDto(
    string Reason
);
