namespace DeskBoost.API.Contracts.Requests;

public class PlantSpeciesUpsertRequest
{
    public string Name { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CareInstructions { get; set; }
    public string? CommonDiseases { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
