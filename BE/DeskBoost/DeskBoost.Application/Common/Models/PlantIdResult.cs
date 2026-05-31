namespace DeskBoost.Application.Common.Models;

public class PlantIdResult
{
    public string TopDisease { get; set; } = string.Empty;
    public float Confidence { get; set; }
    public bool IsHealthy { get; set; }
    public List<PlantIdSuggestion> Suggestions { get; set; } = new();
}

public class PlantIdSuggestion
{
    public string Name { get; set; } = string.Empty;
    public float Probability { get; set; }
}
