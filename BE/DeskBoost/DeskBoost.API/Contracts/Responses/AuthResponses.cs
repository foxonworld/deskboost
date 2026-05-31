namespace DeskBoost.API.Contracts.Responses;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    UserResponse User);

public record UserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role,        // "USER" | "ADMIN"
    string? AvatarUrl,
    string? Phone,
    DateTime CreatedAt);
