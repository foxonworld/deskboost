namespace DeskBoost.Application.Common.Models;

public record ReminderDto(
    Guid Id,
    Guid PlantId,
    string? PlantName,
    string Title,
    string CareType,
    DateTime DueAt,
    string? RepeatRule,
    string Status,
    DateTime? LastDoneAt,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record ReminderCalendarDto(
    string Provider,
    string Title,
    string Description,
    DateTime StartsAt,
    DateTime EndsAt,
    string Timezone,
    string IcsUrl,
    string? RepeatRule
);
