using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public class GoogleLoginCommandHandler : IRequestHandler<GoogleLoginCommand, AuthResponse>
{
    private readonly IAppDbContext _db;
    private readonly IJwtTokenService _jwt;
    private readonly IGoogleAuthService _google;

    public GoogleLoginCommandHandler(IAppDbContext db, IJwtTokenService jwt, IGoogleAuthService google)
    {
        _db = db;
        _jwt = jwt;
        _google = google;
    }

    public async Task<AuthResponse> Handle(GoogleLoginCommand request, CancellationToken ct)
    {
        var googleUser = await _google.VerifyIdTokenAsync(request.IdToken)
            ?? throw new UnauthorizedException("Google token không hợp lệ.");

        var emailLower = googleUser.Email.Trim().ToLower();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == emailLower || u.GoogleId == googleUser.GoogleId, ct);

        if (user is null)
        {
            user = new User
            {
                Email = emailLower,
                FullName = googleUser.FullName,
                GoogleId = googleUser.GoogleId,
                AvatarUrl = googleUser.AvatarUrl,
                Role = UserRole.USER,
                Status = UserStatus.Active,
                IsActive = true
            };
            _db.Users.Add(user);
        }
        else
        {
            if (user.GoogleId is null)
                user.GoogleId = googleUser.GoogleId;

            if (googleUser.AvatarUrl is not null)
                user.AvatarUrl = googleUser.AvatarUrl;
        }

        var refreshInfo = _jwt.GenerateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refreshInfo.Token,
            ExpiresAt = refreshInfo.ExpiresAt
        });

        await _db.SaveChangesAsync(ct);

        return new AuthResponse(
            _jwt.GenerateAccessToken(user),
            refreshInfo.Token,
            new UserProfile(user.Id, user.Email, user.FullName, user.Role.ToApiString(), user.AvatarUrl, user.Phone)
        );
    }
}
