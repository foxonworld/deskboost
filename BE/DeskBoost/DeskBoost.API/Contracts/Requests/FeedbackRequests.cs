namespace DeskBoost.API.Contracts.Requests;

// Old user-submitted feedback request (kept for reference; endpoint replaced by admin-managed feedback)
public class CreateFeedbackRequest
{
    public string Message { get; set; } = string.Empty;
    public int? Rating { get; set; }
}
