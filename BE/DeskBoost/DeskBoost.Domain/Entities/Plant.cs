using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class Plant : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid? PlantSpeciesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? SpeciesName { get; set; }
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public PlantCondition LastCondition { get; set; } = PlantCondition.Healthy;
    public PlantStatus Status { get; set; } = PlantStatus.Healthy;
    public string? Notes { get; set; }

    public PlantSpecies? Species { get; set; }
}
