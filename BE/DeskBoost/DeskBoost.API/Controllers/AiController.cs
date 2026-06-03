using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.AiDiagnosis.Commands;
using DeskBoost.Application.Features.AiDiagnosis.Queries;
using DeskBoost.Application.Features.AiDialogs.Commands;
using DeskBoost.Application.Features.AiDialogs.Queries;
using DeskBoost.Application.Features.AiQuota.Queries;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly ISender _sender;

    public AiController(ISender sender) => _sender = sender;

    /// <summary>GET /api/ai/quota</summary>
    [HttpGet("quota")]
    public async Task<IActionResult> GetQuota(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var quota = await _sender.Send(new GetAiQuotaQuery(userId), ct);
        return Ok(new
        {
            hasVerifiedPlant = quota.HasVerifiedPlant,
            chat = new
            {
                limit = quota.Chat.Limit,
                used = quota.Chat.Used,
                remaining = quota.Chat.Remaining,
                resetAt = quota.Chat.ResetAt
            },
            diagnosis = new
            {
                limit = quota.Diagnosis.Limit,
                used = quota.Diagnosis.Used,
                remaining = quota.Diagnosis.Remaining,
                resetAt = quota.Diagnosis.ResetAt
            }
        });
    }

    /// <summary>POST /api/ai/chat</summary>
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Tin nhắn không được để trống." });

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _sender.Send(new SendAiChatCommand
            {
                UserId = userId,
                PlantId = request.PlantId,
                DiagnosisResultId = request.DiagnosisResultId,
                Message = request.Message,
                History = [.. request.History.Select(h => new ChatHistoryItem(h.Role, h.Content))],
                PlantContext = request.PlantContext is null ? null : new PlantContextDto(
                    request.PlantContext.Id,
                    request.PlantContext.Nickname,
                    request.PlantContext.Name,
                    request.PlantContext.Species,
                    request.PlantContext.Status,
                    request.PlantContext.Light,
                    request.PlantContext.Water,
                    request.PlantContext.Notes)
            }, ct);

            return Ok(result);
        }
        catch (AiQuotaExceededException ex)
        {
            return StatusCode(429, new
            {
                message = ex.HasVerifiedPlant
                    ? "Bạn đã dùng hết lượt AI chat hôm nay."
                    : "Bạn nên chăm sóc 1 cây của DeskBoost để sử dụng đầy đủ AI.",
                feature = ex.Feature,
                limit = ex.Limit,
                used = ex.Used,
                remaining = 0,
                hasVerifiedPlant = ex.HasVerifiedPlant
            });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>POST /api/ai/diagnose</summary>
    [HttpPost("diagnose")]
    [DisableRequestSizeLimit]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Diagnose([FromForm] DiagnoseFormRequest request, CancellationToken ct)
    {
        if (request.Image is null)
            return BadRequest(new { message = "Vui lòng cung cấp ảnh để chẩn đoán." });

        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            using var stream = request.Image.OpenReadStream();
            var result = await _sender.Send(new DiagnosePlantCommand
            {
                ImageStream = stream,
                PlantId = request.PlantId,
                UserId = userId
            }, ct);
            return Ok(result);
        }
        catch (AiQuotaExceededException ex)
        {
            return StatusCode(429, new
            {
                message = ex.HasVerifiedPlant
                    ? "Bạn đã dùng hết lượt chẩn đoán hôm nay."
                    : "Bạn nên chăm sóc 1 cây của DeskBoost để sử dụng đầy đủ AI.",
                feature = ex.Feature,
                limit = ex.Limit,
                used = ex.Used,
                remaining = 0,
                hasVerifiedPlant = ex.HasVerifiedPlant
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>GET /api/ai/dialogs</summary>
    [HttpGet("dialogs")]
    public async Task<IActionResult> GetDialogs([FromQuery] Guid? plantId, [FromQuery] int? limit, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var items = await _sender.Send(new GetAiDialogsQuery(userId, plantId, limit), ct);
        return Ok(new { items });
    }

    /// <summary>GET /api/ai/dialogs/{id}</summary>
    [HttpGet("dialogs/{id:guid}")]
    public async Task<IActionResult> GetDialogById(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetAiDialogByIdQuery(id, userId), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy dialog." });
        return Ok(result);
    }

    /// <summary>GET /api/ai/diagnosis?plantId={id}&amp;limit=3</summary>
    [HttpGet("diagnosis")]
    public async Task<IActionResult> GetDiagnosis([FromQuery] Guid? plantId, [FromQuery] int limit = 10, CancellationToken ct = default)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var items = await _sender.Send(new GetDiagnosisListQuery(userId, plantId, limit), ct);
        return Ok(new { items });
    }
}
