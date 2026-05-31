using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Queries;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserProfile?>
{
    private readonly IAppDbContext _db;

    public GetCurrentUserQueryHandler(IAppDbContext db) => _db = db;

    public async Task<UserProfile?> Handle(GetCurrentUserQuery request, CancellationToken ct)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId && u.IsActive, ct);

        if (user is null) return null;

        return new UserProfile(user.Id, user.Email, user.FullName, user.Role.ToApiString(), user.AvatarUrl, user.Phone);
    }
}
