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

        // Accept both Web and Android client IDs so mobile tokens with either audience pass.
        var androidClientId = configuration["Google:AndroidClientId"];
        _audiences = androidClientId is not null
            ? [webClientId, androidClientId]
            : [webClientId];
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
