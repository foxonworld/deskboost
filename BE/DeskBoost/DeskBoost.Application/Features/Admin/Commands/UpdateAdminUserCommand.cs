using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
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
            user.Role = request.Role.ToUserRole();

        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new AdminUserDto(user.Id, user.FullName, user.Email, user.Role.ToApiString(), user.Status.ToApiString(), user.AvatarUrl, user.Phone, user.CreatedAt);
    }
}
