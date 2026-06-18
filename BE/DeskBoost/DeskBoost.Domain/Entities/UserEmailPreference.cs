namespace DeskBoost.Domain.Entities;

public class UserEmailPreference : BaseEntity
{
    public Guid UserId { get; set; }
    public bool EmailEnabled { get; set; } = true;
    public bool ReminderEmailEnabled { get; set; } = true;
    public bool AdminNotificationEmailEnabled { get; set; } = true;
    public bool SecurityEmailEnabled { get; set; } = true;
    public string? SuppressedReason { get; set; }
    public Guid? SuppressedByAdminId { get; set; }
    public DateTime? SuppressedAt { get; set; }

    public User User { get; set; } = null!;
}
