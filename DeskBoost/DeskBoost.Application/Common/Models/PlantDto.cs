namespace DeskBoost.Application.Common.Models;

public record PlantDto(
    Guid Id,
    Guid UserId,
    Guid PlantSpeciesId,
    string SpeciesName,
    string SpeciesVietnameseName,
    string Name,
    string? ImageUrl,
    string? Location,
    int WateringCycleDays,
    string LastCondition,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
