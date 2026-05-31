using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record UpdateAdminUserStatusCommand(Guid UserId, string Status) : IRequest<AdminUserDto>;

public class UpdateAdminUserStatusCommandHandler : IRequestHandler<UpdateAdminUserStatusCommand, AdminUserDto>
{
    private readonly IAppDbContext _db;

    public UpdateAdminUserStatusCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminUserDto> Handle(UpdateAdminUserStatusCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy người dùng.");

        user.Status = request.Status.ToUserStatus();
        user.IsActive = user.Status == UserStatus.Active;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AdminUserDto(user.Id, user.FullName, user.Email, user.Role.ToApiString(), user.Status.ToApiString(), user.AvatarUrl, user.Phone, user.CreatedAt);
    }
}
