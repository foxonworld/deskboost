using DeskBoost.Domain.Entities;

namespace DeskBoost.Application.Common.Interfaces;

public record RefreshTokenInfo(string Token, DateTime ExpiresAt);

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    RefreshTokenInfo GenerateRefreshToken();
}
