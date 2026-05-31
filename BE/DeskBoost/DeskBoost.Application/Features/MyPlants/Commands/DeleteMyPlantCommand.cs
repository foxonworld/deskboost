using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Commands;

public record DeleteMyPlantCommand(Guid PlantId, Guid UserId) : IRequest;
