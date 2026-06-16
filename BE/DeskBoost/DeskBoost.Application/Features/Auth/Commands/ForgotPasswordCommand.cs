using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Auth.Commands;

public record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResult>;

public record ForgotPasswordResult(bool Success, string Message, string? ResetToken = null);

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResult>
{
    private const string GenericSuccessMessage = "Neu email ton tai, huong dan dat lai mat khau da duoc gui.";

    private readonly IAppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly IEmailConfiguration _emailConfiguration;

    public ForgotPasswordCommandHandler(
        IAppDbContext db,
        IEmailService emailService,
        IEmailConfiguration emailConfiguration)
    {
        _db = db;
        _emailService = emailService;
        _emailConfiguration = emailConfiguration;
    }

    public async Task<ForgotPasswordResult> Handle(ForgotPasswordCommand request, CancellationToken ct)
    {
        var emailLower = request.Email.Trim().ToLower();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailLower, ct);

        if (user is null)
            return new ForgotPasswordResult(true, GenericSuccessMessage);

        var token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");

        user.PasswordResetToken = token;
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddHours(2);
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        await _emailService.SendPasswordResetEmailAsync(user.Email, user.FullName, token, ct);

        return new ForgotPasswordResult(
            true,
            GenericSuccessMessage,
            _emailConfiguration.ExposeResetTokenInResponse ? token : null);
    }
}
