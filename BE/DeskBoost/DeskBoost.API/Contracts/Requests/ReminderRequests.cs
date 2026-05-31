namespace DeskBoost.API.Contracts.Requests;

public class CreateReminderRequest
{
    public Guid PlantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CareType { get; set; } = "watering";
    public DateTime DueAt { get; set; }
    public string? RepeatRule { get; set; }
    public string? Notes { get; set; }
}

public class UpdateReminderRequest
{
    public string? Title { get; set; }
    public string? CareType { get; set; }
    public DateTime? DueAt { get; set; }
    public string? RepeatRule { get; set; }
    public string? Notes { get; set; }
}
