namespace DeskBoost.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(
        string toEmail,
        string fullName,
        string resetToken,
        CancellationToken ct);
}
