using DeskBoost.Application.Features.Notifications.Commands;
using DeskBoost.Application.Features.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly ISender _sender;

    public NotificationsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/notifications</summary>
    [HttpGet]
    public async Task<IActionResult> GetNotifications(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var items = await _sender.Send(new GetUserNotificationsQuery(userId), ct);
        return Ok(new { items });
    }

    /// <summary>PATCH /api/notifications/{id}/read</summary>
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            await _sender.Send(new MarkNotificationReadCommand(userId, id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PATCH /api/notifications/read-all</summary>
    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _sender.Send(new MarkAllNotificationsReadCommand(userId), ct);
        return NoContent();
    }
}
