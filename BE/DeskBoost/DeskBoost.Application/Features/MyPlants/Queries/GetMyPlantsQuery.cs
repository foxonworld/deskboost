using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public record GetMyPlantsQuery(Guid UserId) : IRequest<List<MyPlantDto>>;
