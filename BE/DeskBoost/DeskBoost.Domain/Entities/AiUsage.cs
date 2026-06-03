namespace DeskBoost.Domain.Entities;

public class AiUsage : BaseEntity
{
    public Guid UserId { get; set; }
    public string Feature { get; set; } = string.Empty; // "chat" | "diagnosis"
    public Guid? PlantId { get; set; }
    public Guid? DiagnosisResultId { get; set; }
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Plant? Plant { get; set; }
    public DiagnosisResult? DiagnosisResult { get; set; }
}
