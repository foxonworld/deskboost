namespace DeskBoost.Application.Common.Interfaces;

public record GoogleUserInfo(string GoogleId, string Email, string FullName, string? AvatarUrl);

public interface IGoogleAuthService
{
    Task<GoogleUserInfo?> VerifyIdTokenAsync(string idToken);
}
