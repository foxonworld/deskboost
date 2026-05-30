namespace DeskBoost.Application.Common.Models;

public record AdminSummaryDto(
    int Users,
    int UserPlants,
    int MarketplacePlants,
    int AiDialogs,
    bool AiConfigured
);

public record AdminUserDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    string Status,
    string? AvatarUrl,
    string? Phone,
    DateTime CreatedAt
);

public record AdminUserPlantDto(
    Guid Id,
    Guid UserId,
    string UserEmail,
    string Name,
    string? Species,
    string? Location,
    string Status,
    DateTime CreatedAt
);

public record AdminAiConfigStatusDto(
    string Provider,
    bool Configured,
    DateTime LastCheckedAt
);
