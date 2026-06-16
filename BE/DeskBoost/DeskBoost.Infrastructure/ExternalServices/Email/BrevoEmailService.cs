using System.Net;
using System.Net.Http.Json;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DeskBoost.Infrastructure.ExternalServices.Email;

public class BrevoEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly IEmailConfiguration _emailConfiguration;
    private readonly ILogger<BrevoEmailService> _logger;

    public BrevoEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        IEmailConfiguration emailConfiguration,
        ILogger<BrevoEmailService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _emailConfiguration = emailConfiguration;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string fullName,
        string resetToken,
        CancellationToken ct)
    {
        if (!_emailConfiguration.IsEnabled)
            return;

        var apiKey = GetRequired("Brevo:ApiKey");
        var fromAddress = GetRequired("Email:FromAddress");
        var fromName = _configuration["Email:FromName"] ?? "DeskBoost";
        var resetUrl = BuildResetUrl(resetToken);

        using var request = new HttpRequestMessage(HttpMethod.Post, "smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Content = JsonContent.Create(new
        {
            sender = new
            {
                name = fromName,
                email = fromAddress
            },
            to = new[]
            {
                new
                {
                    email = toEmail,
                    name = string.IsNullOrWhiteSpace(fullName) ? toEmail : fullName.Trim()
                }
            },
            subject = "DeskBoost password reset",
            htmlContent = BuildPasswordResetBody(fullName, resetUrl),
            textContent = $"DeskBoost password reset\n\nOpen this link to reset your password: {resetUrl}"
        });

        HttpResponseMessage response;
        try
        {
            response = await _httpClient.SendAsync(request, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to call Brevo email API for {Email}", toEmail);
            throw new ExternalServiceException("Khong the gui email dat lai mat khau. Vui long thu lai sau.");
        }

        if (response.IsSuccessStatusCode)
            return;

        var errorBody = await response.Content.ReadAsStringAsync(ct);
        _logger.LogError(
            "Brevo email API failed for {Email}. StatusCode: {StatusCode}. Body: {Body}",
            toEmail,
            (int)response.StatusCode,
            errorBody);

        throw new ExternalServiceException("Khong the gui email dat lai mat khau. Vui long thu lai sau.");
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
