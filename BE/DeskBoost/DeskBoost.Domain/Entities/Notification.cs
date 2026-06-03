namespace DeskBoost.Domain.Entities;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;           // promo | care_tip | announcement
    public string TargetType { get; set; } = "all";            // all | specific
    public string? TargetUserIdsJson { get; set; }             // JSON array of Guid strings, null = all
    public Guid? CreatedByAdminId { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<NotificationRead> Reads { get; set; } = new List<NotificationRead>();
}
