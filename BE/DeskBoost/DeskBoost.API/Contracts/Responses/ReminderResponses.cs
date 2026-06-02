namespace DeskBoost.API.Contracts.Responses;

public record ReminderResponse(
    Guid Id,
    Guid PlantId,
    string? PlantName,
    string Title,
    string CareType,    // "watering" | "fertilizing" | "repotting" | "other"
    DateTime DueAt,
    string? RepeatRule, // "daily" | "every-2-days" | "every-3-days" | "weekly" | "biweekly" | "monthly" | null
    string Status,      // "pending" | "done"
    DateTime? LastDoneAt,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record ReminderCalendarResponse(
    string Provider,
    string Title,
    string Description,
    DateTime StartsAt,
    DateTime EndsAt,
    string Timezone,
    string IcsUrl,
    string? RepeatRule);
