using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Plants.Commands;

public record CreatePlantCommand : IRequest<PlantDto>
{
    public required Guid UserId { get; init; }
    public required Guid PlantSpeciesId { get; init; }
    public required string Name { get; init; }
    public string? ImageUrl { get; init; }
    public string? Location { get; init; }
    public int WateringCycleDays { get; init; } = 3;
    public string? Notes { get; init; }
}
