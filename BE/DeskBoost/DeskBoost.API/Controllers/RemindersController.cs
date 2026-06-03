using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Reminders.Commands;
using DeskBoost.Application.Features.Reminders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/reminders")]
public class RemindersController : ControllerBase
{
    private readonly ISender _sender;

    public RemindersController(ISender sender) => _sender = sender;

    /// <summary>GET /api/reminders</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? plantId, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var items = await _sender.Send(new GetRemindersQuery(userId, plantId), ct);
        return Ok(new { items });
    }

    /// <summary>POST /api/reminders</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReminderRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Tiêu đề reminder không được để trống." });

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _sender.Send(new CreateReminderCommand
            {
                UserId = userId,
                PlantId = request.PlantId,
                Title = request.Title,
                CareType = request.CareType,
                DueAt = request.DueAt,
                RepeatRule = request.RepeatRule,
                Notes = request.Notes
            }, ct);
            return StatusCode(201, result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/reminders/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateReminderRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _sender.Send(new UpdateReminderCommand
            {
                ReminderId = id,
                UserId = userId,
                Title = request.Title,
                CareType = request.CareType,
                DueAt = request.DueAt,
                RepeatRule = request.RepeatRule,
                Notes = request.Notes
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/reminders/{id}/done</summary>
    [HttpPut("{id:guid}/done")]
    public async Task<IActionResult> MarkDone(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _sender.Send(new MarkReminderDoneCommand(id, userId), ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>GET /api/reminders/{id}/calendar</summary>
    [HttpGet("{id:guid}/calendar")]
    public async Task<IActionResult> GetCalendar(Guid id, [FromQuery] string? format, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetReminderCalendarQuery(id, userId, format), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy reminder." });

        if (format?.ToLower() == "ics")
        {
            var ics = BuildIcsContent(result);
            return File(System.Text.Encoding.UTF8.GetBytes(ics), "text/calendar", "reminder.ics");
        }

        return Ok(result);
    }

    /// <summary>DELETE /api/reminders/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            await _sender.Send(new DeleteReminderCommand(id, userId), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private static string BuildIcsContent(Application.Common.Models.ReminderCalendarDto dto) =>
        $"""
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//DeskBoost//DeskBoost//EN
        BEGIN:VEVENT
        UID:{Guid.NewGuid()}@deskboost
        DTSTAMP:{DateTime.UtcNow:yyyyMMddTHHmmssZ}
        DTSTART:{dto.StartsAt:yyyyMMddTHHmmssZ}
        DTEND:{dto.EndsAt:yyyyMMddTHHmmssZ}
        SUMMARY:{dto.Title}
        DESCRIPTION:{dto.Description}
        {BuildRecurrenceLine(dto.RepeatRule)}
        END:VEVENT
        END:VCALENDAR
        """;

    private static string BuildRecurrenceLine(string? repeatRule) =>
        repeatRule?.ToLowerInvariant() switch
        {
            "daily" => "RRULE:FREQ=DAILY",
            "every-2-days" => "RRULE:FREQ=DAILY;INTERVAL=2",
            "every-3-days" => "RRULE:FREQ=DAILY;INTERVAL=3",
            "weekly" => "RRULE:FREQ=WEEKLY",
            "biweekly" => "RRULE:FREQ=WEEKLY;INTERVAL=2",
            "monthly" => "RRULE:FREQ=MONTHLY",
            _ => string.Empty
        };
}
