namespace DeskBoost.Application.Common.Models;

public record PlantSpeciesDto(
    Guid Id,
    string Name,
    string VietnameseName,
    string? Description,
    string? CareInstructions,
    string? CommonDiseases,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
