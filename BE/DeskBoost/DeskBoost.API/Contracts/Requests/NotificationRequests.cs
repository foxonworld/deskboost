namespace DeskBoost.API.Contracts.Requests;

public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string Type { get; set; } = "announcement";         // promo | care_tip | announcement
    public string TargetType { get; set; } = "all";            // all | specific
    public List<Guid>? TargetUserIds { get; set; }
}
