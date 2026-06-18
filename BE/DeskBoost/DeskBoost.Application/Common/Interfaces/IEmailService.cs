using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage message, CancellationToken ct);

    Task SendPasswordResetEmailAsync(
        string toEmail,
        string fullName,
        string resetToken,
        CancellationToken ct);
}