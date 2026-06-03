namespace DeskBoost.Application.Common.Models;

public record NotificationItemDto(
    Guid Id,
    string Title,
    string Body,
    string Type,
    DateTime CreatedAt,
    bool IsRead
);

public record AdminNotificationDto(
    Guid Id,
    string Title,
    string Body,
    string Type,
    string TargetType,
    List<Guid>? TargetUserIds,
    Guid? CreatedByAdminId,
    DateTime CreatedAt,
    bool IsActive
);
