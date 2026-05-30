namespace DeskBoost.Application.Common.Models;

public record MyPlantDto(
    Guid Id,
    string Name,
    string? Species,
    string? Location,
    string? ImageUrl,
    string Status,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
