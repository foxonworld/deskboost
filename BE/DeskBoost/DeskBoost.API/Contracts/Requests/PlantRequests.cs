namespace DeskBoost.API.Contracts.Requests;

public class CreatePlantRequest
{
    public Guid PlantSpeciesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public string? Notes { get; set; }
}

public class UpdatePlantRequest
{
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public string? Notes { get; set; }
}
