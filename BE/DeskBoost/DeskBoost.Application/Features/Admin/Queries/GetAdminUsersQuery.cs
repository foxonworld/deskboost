using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminUsersQuery : IRequest<List<AdminUserDto>>;

public class GetAdminUsersQueryHandler : IRequestHandler<GetAdminUsersQuery, List<AdminUserDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminUsersQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminUserDto>> Handle(GetAdminUsersQuery request, CancellationToken ct)
    {
        var rows = await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(ct);

        return rows.Select(u => new AdminUserDto(
            u.Id, u.FullName, u.Email, u.Role.ToApiString(), u.Status.ToApiString(),
            u.AvatarUrl, u.Phone, u.CreatedAt
        )).ToList();
    }
}

public record GetAdminUserByIdQuery(Guid UserId) : IRequest<AdminUserDto?>;

public class GetAdminUserByIdQueryHandler : IRequestHandler<GetAdminUserByIdQuery, AdminUserDto?>
{
    private readonly IAppDbContext _db;

    public GetAdminUserByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserDto?> Handle(GetAdminUserByIdQuery request, CancellationToken ct)
    {
        var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct);
        if (u is null) return null;
        return new AdminUserDto(u.Id, u.FullName, u.Email, u.Role.ToApiString(), u.Status.ToApiString(), u.AvatarUrl, u.Phone, u.CreatedAt);
    }
}
