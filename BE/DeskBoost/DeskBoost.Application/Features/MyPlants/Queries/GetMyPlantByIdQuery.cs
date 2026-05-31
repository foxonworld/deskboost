using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public record GetMyPlantByIdQuery(Guid PlantId, Guid UserId) : IRequest<MyPlantDto?>;
