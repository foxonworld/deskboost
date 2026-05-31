namespace DeskBoost.Domain.Entities;

public class Feedback : BaseEntity
{
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? Rating { get; set; }   // 1-5
    public bool IsVerified { get; set; } = false;
    public Guid? CatalogPlantId { get; set; }  // FK to PlantSpecies
    public DateTime? VerifiedAt { get; set; }

    public User? User { get; set; }
    public PlantSpecies? CatalogPlant { get; set; }
}
