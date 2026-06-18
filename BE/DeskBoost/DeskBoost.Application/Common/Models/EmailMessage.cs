namespace DeskBoost.Application.Common.Models;

public record EmailMessage(
    string ToEmail,
    string? ToName,
    string Subject,
    string HtmlContent,
    string TextContent);