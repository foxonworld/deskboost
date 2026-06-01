using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Plants.Queries;

public record GetPlantByIdQuery(Guid PlantId, Guid UserId) : IRequest<PlantDto?>;
