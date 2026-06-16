using MediatR;

namespace DeskBoost.Application.Features.Auth.Commands;

public record LogoutCommand : IRequest<bool>
{
    public required string RefreshToken { get; init; }
    public required Guid CurrentUserId { get; init; }
}
