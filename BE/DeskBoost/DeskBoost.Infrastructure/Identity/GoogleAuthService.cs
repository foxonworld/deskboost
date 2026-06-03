using DeskBoost.Application.Common.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;

namespace DeskBoost.Infrastructure.Identity;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly string _clientId;

    public GoogleAuthService(IConfiguration configuration)
    {
        _clientId = configuration["Google:ClientId"]
            ?? throw new InvalidOperationException("Google:ClientId is not configured.");
    }

    public async Task<GoogleUserInfo?> VerifyIdTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_clientId]
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
