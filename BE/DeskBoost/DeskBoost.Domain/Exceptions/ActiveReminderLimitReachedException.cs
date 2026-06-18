namespace DeskBoost.Domain.Exceptions;

public class ActiveReminderLimitReachedException : ConflictException
{
    public string Code { get; } = "ACTIVE_REMINDER_LIMIT_REACHED";
    public int Limit { get; }
    public int CurrentActiveReminders { get; }

    public ActiveReminderLimitReachedException(int limit, int currentActiveReminders)
        : base("Bạn đã đạt giới hạn 30 nhắc nhở đang hoạt động. Hãy hoàn tất, xoá hoặc tắt bớt nhắc nhở trước khi tạo mới.")
    {
        Limit = limit;
        CurrentActiveReminders = currentActiveReminders;
    }
}
