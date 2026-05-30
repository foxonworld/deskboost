using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Auth.Commands;

public record RefreshTokenCommand : IRequest<AuthResponse>
{
    public required string Token { get; init; }
}
