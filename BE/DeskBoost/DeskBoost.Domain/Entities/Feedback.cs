namespace DeskBoost.Domain.Entities;

public class Feedback : BaseEntity
{
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? Rating { get; set; }   // 1-5
}
