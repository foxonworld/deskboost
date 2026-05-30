using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public record UpdateMyPlantCommand : IRequest<MyPlantDto>
{
    public Guid PlantId { get; init; }
    public Guid UserId { get; init; }
    public string? Name { get; init; }
    public string? Species { get; init; }
    public string? Location { get; init; }
    public string? ImageUrl { get; init; }
    public string? Status { get; init; }
    public string? Notes { get; init; }
}
