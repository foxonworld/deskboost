using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public record CreateMyPlantCommand : IRequest<MyPlantDto>
{
    public Guid UserId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Species { get; init; }
    public string? Location { get; init; }
    public string? ImageUrl { get; init; }
    public string? Notes { get; init; }
}
