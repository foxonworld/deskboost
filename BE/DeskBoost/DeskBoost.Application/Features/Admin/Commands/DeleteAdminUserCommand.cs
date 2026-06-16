using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record DeleteAdminUserCommand(Guid UserId, Guid CurrentAdminUserId) : IRequest;

public class DeleteAdminUserCommandHandler : IRequestHandler<DeleteAdminUserCommand>
{
    private readonly IAppDbContext _db;

    public DeleteAdminUserCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteAdminUserCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy người dùng.");

        // Soft delete — set status Inactive và IsActive = false
        if (user.Id == request.CurrentAdminUserId)
            throw new ForbiddenException("Khong the tu xoa tai khoan admin hien tai.");

        if (IsActiveAdmin(user) && !await HasAnotherActiveAdminAsync(user.Id, ct))
            throw new ForbiddenException("Khong the xoa, vo hieu hoa hoac ha quyen admin cuoi cung.");

        user.Status = UserStatus.Inactive;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
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
