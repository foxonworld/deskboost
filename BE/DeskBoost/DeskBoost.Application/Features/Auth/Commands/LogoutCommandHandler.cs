using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IAppDbContext _db;

    public LogoutCommandHandler(IAppDbContext db) => _db = db;

    public async Task<bool> Handle(LogoutCommand request, CancellationToken ct)
    {
        var token = await _db.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == request.RefreshToken && !r.IsRevoked, ct);

        if (token is null) return false;

        token.IsRevoked = true;
        token.RevokedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
