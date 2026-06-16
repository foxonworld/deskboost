using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DeskBoost.Infrastructure.ExternalServices.Email;

public class SmtpEmailService : IEmailService, IEmailConfiguration
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public bool IsEnabled =>
        bool.TryParse(_configuration["Email:Enabled"], out var enabled) && enabled;

    public bool ExposeResetTokenInResponse =>
        bool.TryParse(_configuration["Email:ExposeResetTokenInResponse"], out var exposeToken) && exposeToken;

    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string fullName,
        string resetToken,
        CancellationToken ct)
    {
        if (!IsEnabled)
            return;

        var host = GetRequired("Smtp:Host");
        var port = int.TryParse(_configuration["Smtp:Port"], out var configuredPort)
            ? configuredPort
            : 587;
        var user = GetRequired("Smtp:User");
        var pass = GetRequired("Smtp:Pass");
        var fromAddress = GetRequired("Email:FromAddress");
        var fromName = _configuration["Email:FromName"] ?? "DeskBoost";
        var resetUrl = BuildResetUrl(resetToken);

        using var message = new MailMessage
        {
            From = new MailAddress(fromAddress, fromName, Encoding.UTF8),
            Subject = "DeskBoost password reset",
            SubjectEncoding = Encoding.UTF8,
            BodyEncoding = Encoding.UTF8,
            IsBodyHtml = true,
            Body = BuildPasswordResetBody(fullName, resetUrl)
        };
        message.To.Add(new MailAddress(toEmail));
        message.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(
            $"DeskBoost password reset\n\nOpen this link to reset your password: {resetUrl}",
            Encoding.UTF8,
            MediaTypeNames.Text.Plain));

        using var smtpClient = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(user, pass)
        };

        try
        {
            await smtpClient.SendMailAsync(message, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
            throw new ExternalServiceException("Khong the gui email dat lai mat khau. Vui long thu lai sau.");
        }
    }

    private string GetRequired(string key)
    {
        var value = _configuration[key];
        if (string.IsNullOrWhiteSpace(value))
            throw new ExternalServiceException($"Missing email configuration: {key}");
        return value;
    }

    private string BuildResetUrl(string resetToken)
    {
        var appBaseUrl = GetRequired("Email:AppBaseUrl").TrimEnd('/');
        var resetPath = (_configuration["Email:ResetPasswordPath"] ?? "/forgot-password").Trim();
        if (!resetPath.StartsWith('/'))
            resetPath = "/" + resetPath;

        var separator = resetPath.Contains('?') ? "&" : "?";
        return $"{appBaseUrl}{resetPath}{separator}token={Uri.EscapeDataString(resetToken)}";
    }

    private static string BuildPasswordResetBody(string fullName, string resetUrl)
    {
        var displayName = WebUtility.HtmlEncode(
            string.IsNullOrWhiteSpace(fullName) ? "DeskBoost user" : fullName.Trim());
        var safeUrl = WebUtility.HtmlEncode(resetUrl);

        return $"""
        <!doctype html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
          <p>Hi {displayName},</p>
          <p>We received a request to reset your DeskBoost password.</p>
          <p>
            <a href="{safeUrl}" style="display:inline-block;padding:10px 16px;background:#2f855a;color:#ffffff;text-decoration:none;border-radius:6px;">
              Reset password
            </a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
          <p>This link expires soon for your account security.</p>
        </body>
        </html>
        """;
    }
}
