using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Auth.Commands;

public record RegisterCommand : IRequest<AuthResponse>
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string FullName { get; init; }
}
