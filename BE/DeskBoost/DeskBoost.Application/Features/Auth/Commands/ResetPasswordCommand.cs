using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public record ResetPasswordCommand(string Token, string NewPassword) : IRequest<ResetPasswordResult>;

public record ResetPasswordResult(bool Success, string Message);

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResult>
{
    private readonly IAppDbContext _db;

    public ResetPasswordCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ResetPasswordResult> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            throw new ValidationException("Token không hợp lệ.");

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            throw new ValidationException("Mật khẩu mới phải có ít nhất 6 ký tự.");

        var now = DateTime.UtcNow;
        var user = await _db.Users
            .FirstOrDefaultAsync(u =>
                u.PasswordResetToken == request.Token &&
                u.PasswordResetTokenExpiresAt != null &&
                u.PasswordResetTokenExpiresAt > now, ct);

        if (user is null)
            throw new ValidationException("Token không hợp lệ hoặc đã hết hạn.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new ResetPasswordResult(true, "Mật khẩu đã được đặt lại thành công.");
    }
}
