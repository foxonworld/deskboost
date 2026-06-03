namespace DeskBoost.Domain.Entities;

public class NotificationRead : BaseEntity
{
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }
    public DateTime ReadAt { get; set; } = DateTime.UtcNow;

    public Notification? Notification { get; set; }
    public User? User { get; set; }
}
