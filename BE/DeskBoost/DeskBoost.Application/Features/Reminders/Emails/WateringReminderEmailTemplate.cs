using System.Net;
using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Features.Reminders.Emails;

public static class WateringReminderEmailTemplate
{
    private const string DefaultPlantName = "c\u00e2y c\u1ee7a b\u1ea1n";
    private const string DefaultReminderTitle = "Nh\u1eafc t\u01b0\u1edbi c\u00e2y";
    private const string SubjectPrefix = "DeskBoost nh\u1eafc t\u01b0\u1edbi c\u00e2y: ";
    private const string Greeting = "Xin ch\u00e0o";
    private const string DueLine = "\u0110\u1ebfn l\u1ecbch t\u01b0\u1edbi c\u00e2y cho";
    private const string ReminderLabel = "Nh\u1eafc nh\u1edf";
    private const string TimeLabel = "Th\u1eddi gian";
    private const string OpenDeskBoost = "M\u1edf DeskBoost";
    private const string CompletionNote = "B\u1ea1n v\u1eabn c\u1ea7n t\u1ef1 \u0111\u00e1nh d\u1ea5u ho\u00e0n t\u1ea5t sau khi t\u01b0\u1edbi.";
    private const string TextCtaLead = "M\u1edf DeskBoost \u0111\u1ec3 xem v\u00e0 \u0111\u00e1nh d\u1ea5u ho\u00e0n t\u1ea5t sau khi t\u01b0\u1edbi:";

    public static EmailMessage Build(
        string toEmail,
        string fullName,
        string plantName,
        string reminderTitle,
        DateTime dueAtUtc,
        string appBaseUrl)
    {
        var displayName = string.IsNullOrWhiteSpace(fullName) ? "DeskBoost user" : fullName.Trim();
        var normalizedPlant = string.IsNullOrWhiteSpace(plantName) ? DefaultPlantName : plantName.Trim();
        var normalizedTitle = string.IsNullOrWhiteSpace(reminderTitle) ? DefaultReminderTitle : reminderTitle.Trim();
        var safeName = WebUtility.HtmlEncode(displayName);
        var safePlant = WebUtility.HtmlEncode(normalizedPlant);
        var safeTitle = WebUtility.HtmlEncode(normalizedTitle);
        var dueText = dueAtUtc.ToUniversalTime().ToString("dd/MM/yyyy HH:mm 'UTC'");
        var settingsUrl = $"{appBaseUrl.TrimEnd('/')}/app/settings";
        var safeUrl = WebUtility.HtmlEncode(settingsUrl);
        var subject = $"{SubjectPrefix}{normalizedPlant}";

        var html = $"""
        <!doctype html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
          <p>{Greeting} {safeName},</p>
          <p>{DueLine} <strong>{safePlant}</strong>.</p>
          <p><strong>{ReminderLabel}:</strong> {safeTitle}</p>
          <p><strong>{TimeLabel}:</strong> {WebUtility.HtmlEncode(dueText)}</p>
          <p>
            <a href="{safeUrl}" style="display:inline-block;padding:10px 16px;background:#2f855a;color:#ffffff;text-decoration:none;border-radius:6px;">
              {OpenDeskBoost}
            </a>
          </p>
          <p>{CompletionNote}</p>
        </body>
        </html>
        """;

        var text = $"""
        {Greeting} {displayName},

        {DueLine} {normalizedPlant}.
        {ReminderLabel}: {normalizedTitle}
        {TimeLabel}: {dueText}

        {TextCtaLead}
        {settingsUrl}
        """;

        return new EmailMessage(toEmail, displayName, subject, html, text);
    }
}