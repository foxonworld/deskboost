using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class Reminder : BaseEntity
{
    public Guid PlantId { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public CareType CareType { get; set; } = CareType.Watering;
    public DateTime DueAt { get; set; }
    public RepeatRule? RepeatRule { get; set; }
    public ReminderStatus Status { get; set; } = ReminderStatus.Pending;
    public DateTime? LastDoneAt { get; set; }
    public string? Notes { get; set; }
    public bool IsSent { get; set; } = false;
    public bool IsActive { get; set; } = true;

    public Plant Plant { get; set; } = null!;
}
