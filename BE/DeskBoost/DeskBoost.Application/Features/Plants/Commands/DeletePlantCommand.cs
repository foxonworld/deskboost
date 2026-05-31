using MediatR;

namespace DeskBoost.Application.Features.Plants.Commands;

public record DeletePlantCommand(Guid Id) : IRequest;
