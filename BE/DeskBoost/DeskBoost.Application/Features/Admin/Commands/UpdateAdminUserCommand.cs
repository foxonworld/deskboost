using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public class UpdateAdminUserCommand : IRequest<AdminUserDto>
{
    public Guid UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Role { get; set; }
    public Guid CurrentAdminUserId { get; set; }
}

public class UpdateAdminUserCommandHandler : IRequestHandler<UpdateAdminUserCommand, AdminUserDto>
{
    private readonly IAppDbContext _db;

    public UpdateAdminUserCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserDto> Handle(UpdateAdminUserCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy người dùng.");

        if (!string.IsNullOrWhiteSpace(request.FullName))
            user.FullName = request.FullName.Trim();

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var emailLower = request.Email.Trim().ToLower();
            var emailTaken = await _db.Users.AnyAsync(u => u.Email == emailLower && u.Id != request.UserId, ct);
            if (emailTaken)
                throw new InvalidOperationException("Email đã được sử dụng bởi tài khoản khác.");
            user.Email = emailLower;
        }

        if (request.Phone is not null)
            user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

        if (request.AvatarUrl is not null)
            user.AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl) ? null : request.AvatarUrl.Trim();

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var nextRole = request.Role.ToUserRole();
            var demotesActiveAdmin = IsActiveAdmin(user) && nextRole != UserRole.ADMIN;

            if (user.Id == request.CurrentAdminUserId && nextRole != UserRole.ADMIN)
                throw new ForbiddenException("Khong the tu ha quyen tai khoan admin hien tai.");

            if (demotesActiveAdmin && !await HasAnotherActiveAdminAsync(user.Id, ct))
                throw new ForbiddenException("Khong the xoa, vo hieu hoa hoac ha quyen admin cuoi cung.");

            user.Role = nextRole;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AdminUserDto(user.Id, user.FullName, user.Email, user.Role.ToApiString(), user.Status.ToApiString(), user.AvatarUrl, user.Phone, user.CreatedAt);
    }

    private static bool IsActiveAdmin(DeskBoost.Domain.Entities.User user) =>
        user.Role == UserRole.ADMIN && user.Status == UserStatus.Active && user.IsActive;

    private Task<bool> HasAnotherActiveAdminAsync(Guid targetUserId, CancellationToken ct) =>
        _db.Users.AnyAsync(u =>
            u.Id != targetUserId &&
            u.Role == UserRole.ADMIN &&
            u.Status == UserStatus.Active &&
            u.IsActive, ct);
}
