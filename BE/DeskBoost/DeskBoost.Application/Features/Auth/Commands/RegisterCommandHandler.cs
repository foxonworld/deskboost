using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IAppDbContext _db;
    private readonly IJwtTokenService _jwt;

    public RegisterCommandHandler(IAppDbContext db, IJwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken ct)
    {
        var emailLower = request.Email.Trim().ToLower();

        if (await _db.Users.AnyAsync(u => u.Email == emailLower, ct))
            throw new ConflictException("Email đã được sử dụng.");

        var user = new User
        {
            Email = emailLower,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName.Trim(),
            Role = UserRole.USER,
            Status = UserStatus.Active
        };

        _db.Users.Add(user);

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
