using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResult>;

public record ForgotPasswordResult(bool Success, string Message,
    // Token trả về trong dev/test — production nên gửi qua email thay vì expose
    string? ResetToken = null);

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResult>
{
    private readonly IAppDbContext _db;

    public ForgotPasswordCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ForgotPasswordResult> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        var emailLower = request.Email.Trim().ToLower();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailLower, ct);

        // Trả success dù email không tồn tại (tránh email enumeration attack)
        if (user is null)
            return new ForgotPasswordResult(true, "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");

        // Tạo reset token ngẫu nhiên (32 bytes base64url)
        var token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");

        user.PasswordResetToken = token;
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddHours(2); // token hết hạn sau 2 giờ
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        // TODO: Tích hợp email service để gửi link reset thay vì trả token trực tiếp
        // Ví dụ link: https://yourdomain.com/#/reset-password?token={token}
        return new ForgotPasswordResult(true, "Token đặt lại mật khẩu đã được tạo.", token);
    }
}
