namespace DeskBoost.API.Contracts.Responses;

public record AdminSummaryResponse(
    int Users,
    int UserPlants,
    int MarketplacePlants,
    int AiDialogs,
    bool AiConfigured);

public record AdminUserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role,        // "USER" | "ADMIN"
    string Status,      // "active" | "inactive" | "banned"
    string? AvatarUrl,
    string? Phone,
    DateTime CreatedAt);

public record AdminUserPlantResponse(
    Guid Id,
    Guid UserId,
    string UserEmail,
    string Name,
    string? Species,
    string? Location,
    string Status,
    DateTime CreatedAt);

public record AdminAiConfigResponse(
    string Provider,
    bool Configured,
    DateTime LastCheckedAt);
