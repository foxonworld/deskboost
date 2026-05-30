using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IAppDbContext _db;
    private readonly IJwtTokenService _jwt;

    public RefreshTokenCommandHandler(IAppDbContext db, IJwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var existing = await _db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == request.Token, ct);

        if (existing is null || existing.IsRevoked || existing.ExpiresAt <= DateTime.UtcNow)
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn.");

        if (!existing.User.IsActive)
            throw new UnauthorizedException("Tài khoản đã bị vô hiệu hoá.");

        // Revoke old token
        existing.IsRevoked = true;
        existing.RevokedAt = DateTime.UtcNow;

        // Issue new token pair
        var refreshInfo = _jwt.GenerateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = existing.UserId,
            Token = refreshInfo.Token,
            ExpiresAt = refreshInfo.ExpiresAt
        });

        await _db.SaveChangesAsync(ct);

        var user = existing.User;
        return new AuthResponse(
            _jwt.GenerateAccessToken(user),
            refreshInfo.Token,
            new UserProfile(user.Id, user.Email, user.FullName, user.Role.ToApiString())
        );
    }
}
