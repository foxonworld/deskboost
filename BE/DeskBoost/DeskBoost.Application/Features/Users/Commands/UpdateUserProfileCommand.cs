using MediatR;

namespace DeskBoost.Application.Features.Users.Commands;

public record UpdateUserProfileCommand : IRequest<UserProfileDto>
{
    public Guid UserId { get; init; }
    public string? Name { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Phone { get; init; }
}

public record UserProfileDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    string? AvatarUrl,
    string? Phone,
    DateTime CreatedAt
);
