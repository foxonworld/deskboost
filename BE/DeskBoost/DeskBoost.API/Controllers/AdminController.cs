using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Admin.Commands;
using DeskBoost.Application.Features.Admin.Queries;
using DeskBoost.Application.Features.Marketplace.Commands;
using DeskBoost.Application.Features.Marketplace.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[Authorize(Roles = "ADMIN")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly ISender _sender;

    public AdminController(ISender sender) => _sender = sender;

    // ── Summary ──────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/summary</summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminSummaryQuery(), ct));

    // ── Users ─────────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/users</summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminUsersQuery(), ct) });

    /// <summary>GET /api/admin/users/{id}</summary>
    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminUserByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy người dùng." });
        return Ok(result);
    }

    /// <summary>PUT /api/admin/users/{id}/status</summary>
    [HttpPut("users/{id:guid}/status")]
    public async Task<IActionResult> UpdateUserStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest(new { message = "Status không hợp lệ." });
        try
        {
            var result = await _sender.Send(new UpdateAdminUserStatusCommand(id, request.Status), ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── User Plants ───────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/user-plants</summary>
    [HttpGet("user-plants")]
    public async Task<IActionResult> GetUserPlants(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminUserPlantsQuery(), ct) });

    /// <summary>GET /api/admin/user-plants/{id}</summary>
    [HttpGet("user-plants/{id:guid}")]
    public async Task<IActionResult> GetUserPlantById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminUserPlantByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy cây." });
        return Ok(result);
    }

    /// <summary>PUT /api/admin/user-plants/{id}/status</summary>
    [HttpPut("user-plants/{id:guid}/status")]
    public async Task<IActionResult> UpdateUserPlantStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest(new { message = "Status không hợp lệ." });
        try
        {
            await _sender.Send(new UpdateAdminUserPlantStatusCommand(id, request.Status), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Marketplace Plants ────────────────────────────────────────────────────

    /// <summary>GET /api/admin/marketplace-plants</summary>
    [HttpGet("marketplace-plants")]
    public async Task<IActionResult> GetMarketplacePlants([FromQuery] int page = 1, [FromQuery] int limit = 50, CancellationToken ct = default)
        => Ok(await _sender.Send(new GetMarketplacePlantsQuery(page, limit), ct));

    /// <summary>POST /api/admin/marketplace-plants</summary>
    [HttpPost("marketplace-plants")]
    public async Task<IActionResult> CreateMarketplacePlant([FromBody] MarketplacePlantUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên cây không được để trống." });

        var result = await _sender.Send(new CreateMarketplacePlantCommand
        {
            Name = request.Name,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            PriceText = request.PriceText,
            CareLevel = request.CareLevel,
            Light = request.Light,
            Water = request.Water,
            ContactUrl = request.ContactUrl,
            Status = request.Status
        }, ct);
        return StatusCode(201, result);
    }

    /// <summary>PUT /api/admin/marketplace-plants/{id}</summary>
    [HttpPut("marketplace-plants/{id:guid}")]
    public async Task<IActionResult> UpdateMarketplacePlant(Guid id, [FromBody] MarketplacePlantUpsertRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdateMarketplacePlantCommand
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                PriceText = request.PriceText,
                CareLevel = request.CareLevel,
                Light = request.Light,
                Water = request.Water,
                ContactUrl = request.ContactUrl,
                Status = request.Status
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/admin/marketplace-plants/{id}</summary>
    [HttpDelete("marketplace-plants/{id:guid}")]
    public async Task<IActionResult> DeleteMarketplacePlant(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteMarketplacePlantCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── AI Dialogs ────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/ai-dialogs</summary>
    [HttpGet("ai-dialogs")]
    public async Task<IActionResult> GetAiDialogs(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminAiDialogsQuery(), ct) });

    /// <summary>GET /api/admin/ai-dialogs/{id}</summary>
    [HttpGet("ai-dialogs/{id:guid}")]
    public async Task<IActionResult> GetAiDialogById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminAiDialogByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy dialog." });
        return Ok(result);
    }

    // ── AI Config ─────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/ai-config/status</summary>
    [HttpGet("ai-config/status")]
    public async Task<IActionResult> GetAiConfigStatus(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminAiConfigStatusQuery(), ct));
}
