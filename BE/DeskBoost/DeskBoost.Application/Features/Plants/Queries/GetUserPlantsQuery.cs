using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Plants.Queries;

public record GetUserPlantsQuery(Guid UserId) : IRequest<List<PlantDto>>;
