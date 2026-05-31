namespace DeskBoost.API.Contracts.Requests;

public class CreateFeedbackRequest
{
    public string Message { get; set; } = string.Empty;
    public int? Rating { get; set; }
}
