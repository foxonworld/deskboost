using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Auth.Queries;

public record GetCurrentUserQuery(Guid UserId) : IRequest<UserProfile?>;
