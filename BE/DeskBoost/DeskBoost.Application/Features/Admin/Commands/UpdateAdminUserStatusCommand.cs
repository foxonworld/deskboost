using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record UpdateAdminUserStatusCommand(Guid UserId, string Status, Guid CurrentAdminUserId) : IRequest<AdminUserDto>;

public class UpdateAdminUserStatusCommandHandler : IRequestHandler<UpdateAdminUserStatusCommand, AdminUserDto>
{
    private readonly IAppDbContext _db;

    public UpdateAdminUserStatusCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserDto> Handle(UpdateAdminUserStatusCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy người dùng.");

        var nextStatus = request.Status.ToUserStatus();
        var removesActiveAdmin = IsActiveAdmin(user) && nextStatus != UserStatus.Active;

        if (user.Id == request.CurrentAdminUserId && nextStatus != UserStatus.Active)
            throw new ForbiddenException("Khong the tu vo hieu hoa tai khoan admin hien tai.");

        if (removesActiveAdmin && !await HasAnotherActiveAdminAsync(user.Id, ct))
            throw new ForbiddenException("Khong the xoa, vo hieu hoa hoac ha quyen admin cuoi cung.");

        user.Status = nextStatus;
        user.IsActive = user.Status == UserStatus.Active;
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
