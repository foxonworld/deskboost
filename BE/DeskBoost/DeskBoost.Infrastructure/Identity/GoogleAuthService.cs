using DeskBoost.Application.Common.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace DeskBoost.Infrastructure.Identity;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IEnumerable<string> _audiences;

    public GoogleAuthService(IConfiguration configuration)
    {
        var webClientId = configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Google:ClientId is not configured.");

        // Collect all valid audiences: new Web, Android, and legacy Web (old GCP project).
        // Remove nulls so missing optional keys are silently skipped.
        _audiences = new[]
        {
            webClientId,
            configuration["Google:AndroidClientId"],
            configuration["Google:LegacyClientId"]
        }.Where(id => id is not null).Cast<string>().ToList();
    }

    public async Task<GoogleUserInfo?> VerifyIdTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = _audiences
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            return new GoogleUserInfo(
                GoogleId: payload.Subject,
                Email: payload.Email,
                FullName: payload.Name ?? payload.Email,
                AvatarUrl: payload.Picture
            );
        }
        catch
        {
            return null;
        }
    }
}
