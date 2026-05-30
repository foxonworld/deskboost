using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Auth.Commands;

public record LoginCommand : IRequest<AuthResponse>
{
    public required string Email { get; init; }
    public required string Password { get; init; }
}
