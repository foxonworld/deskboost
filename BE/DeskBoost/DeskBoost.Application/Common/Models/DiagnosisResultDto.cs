namespace DeskBoost.Application.Common.Models;

public class DiagnosisResultDto
{
    public bool Success { get; set; }
    public string? Disease { get; set; }
    public float Confidence { get; set; }
    public bool IsHealthy { get; set; }
    public string? Severity { get; set; }
    public string? Cause { get; set; }
    public string? Treatment { get; set; }
    public string? Prevention { get; set; }
    public string? Message { get; set; }
    public List<PlantIdSuggestion> Suggestions { get; set; } = new();
}
