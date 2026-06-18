using DeskBoost.Application.Features.Admin.Commands;
using DeskBoost.Application.Features.Admin.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize(Roles = "ADMIN")]
[ApiController]
[Route("api/admin")]
public class AdminOperationsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminOperationsController(ISender sender) => _sender = sender;

    [HttpGet("reminder-operations/summary")]
    public async Task<IActionResult> GetReminderOperationsSummary(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminReminderOperationsSummaryQuery(), ct));

    [HttpGet("reminder-operations/reminders")]
    public async Task<IActionResult> GetReminderOperationsReminders(
        [FromQuery] string? search,
        [FromQuery] string? careType,
        [FromQuery] string? status,
        [FromQuery] bool? isActive,
        [FromQuery] string? dueBucket,
        [FromQuery] string? emailStatus,
        [FromQuery] string? riskLevel,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? sort = null,
        CancellationToken ct = default)
        => Ok(await _sender.Send(new GetAdminReminderOperationsRemindersQuery(
            search,
            careType,
            status,
            isActive,
            dueBucket,
            emailStatus,
            riskLevel,
            page,
            limit,
            sort), ct));

    [HttpGet("email-operations/summary")]
    public async Task<IActionResult> GetEmailOperationsSummary(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminEmailOperationsSummaryQuery(), ct));

    [HttpGet("email-operations/logs")]
    public async Task<IActionResult> GetEmailOperationsLogs(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] string? provider,
        [FromQuery] Guid? userId,
        [FromQuery] string? relatedEntityType,
        [FromQuery] Guid? relatedEntityId,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? sort = null,
        CancellationToken ct = default)
        => Ok(await _sender.Send(new GetAdminEmailOperationsLogsQuery(
            search,
            category,
            status,
            dateFrom,
            dateTo,
            provider,
            userId,
            relatedEntityType,
            relatedEntityId,
            page,
            limit,
            sort), ct));


    [HttpPut("email-operations/users/{userId:guid}/reminder-email/suppress")]
    public async Task<IActionResult> SuppressReminderEmail(Guid userId, [FromBody] DeskBoost.Application.Common.Models.ReminderGovernanceRequestDto request, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        var result = await _sender.Send(new SuppressReminderEmailCommand(userId, adminId, request.Reason, ipAddress, userAgent), ct);
        return Ok(result);
    }

    [HttpPut("email-operations/users/{userId:guid}/reminder-email/unsuppress")]
    public async Task<IActionResult> UnsuppressReminderEmail(Guid userId, [FromBody] DeskBoost.Application.Common.Models.ReminderGovernanceRequestDto request, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        var result = await _sender.Send(new UnsuppressReminderEmailCommand(userId, adminId, request.Reason, ipAddress, userAgent), ct);
        return Ok(result);
    }
    [HttpPut("reminder-operations/reminders/{id:guid}/disable")]
    public async Task<IActionResult> DisableReminder(Guid id, [FromBody] DeskBoost.Application.Common.Models.ReminderGovernanceRequestDto request, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        await _sender.Send(new DeskBoost.Application.Features.Admin.Commands.DisableReminderGovernanceCommand(id, adminId, request.Reason, ipAddress, userAgent), ct);
        return Ok(new { message = "ÄÃ£ vÃ´ hiá»‡u hÃ³a reminder." });
    }

    [HttpPut("reminder-operations/reminders/{id:guid}/enable")]
    public async Task<IActionResult> EnableReminder(Guid id, [FromBody] DeskBoost.Application.Common.Models.ReminderGovernanceRequestDto request, CancellationToken ct)
    {
        var adminId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

        await _sender.Send(new DeskBoost.Application.Features.Admin.Commands.EnableReminderGovernanceCommand(id, adminId, request.Reason, ipAddress, userAgent), ct);
        return Ok(new { message = "ÄÃ£ kÃ­ch hoáº¡t reminder." });
    }
}
