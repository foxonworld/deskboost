namespace DeskBoost.Application.Common.Models;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    UserProfile User
);

public record UserProfile(
    Guid Id,
    string Email,
    string FullName,
    string Role,
    string? AvatarUrl,
    string? Phone
);
