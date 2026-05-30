namespace DeskBoost.Application.Common.Models;

public class GeminiAdvice
{
    public string Cause { get; set; } = string.Empty;
    public string Severity { get; set; } = "medium";  // "low" | "medium" | "high"
    public string Treatment { get; set; } = string.Empty;
    public string Prevention { get; set; } = string.Empty;
}
