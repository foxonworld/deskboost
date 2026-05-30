using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class AiDialog : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid? PlantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;

    public Plant? Plant { get; set; }
    public ICollection<AiMessage> Messages { get; set; } = new List<AiMessage>();
}

public class AiMessage : BaseEntity
{
    public Guid DialogId { get; set; }
    public MessageRole Role { get; set; }
    public string Content { get; set; } = string.Empty;

    public AiDialog Dialog { get; set; } = null!;
}
