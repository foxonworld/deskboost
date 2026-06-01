// LEGACY — Thay thế bởi POST /api/ai/diagnose (AiController)
// Giữ lại để tham khảo, không sử dụng trong production.

/*
using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.AiDiagnosis.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DiagnosisController : ControllerBase
{
    private readonly ISender _sender;

    public DiagnosisController(ISender sender) => _sender = sender;

    /// <summary>POST /api/diagnosis (legacy)</summary>
    [HttpPost]
    [DisableRequestSizeLimit]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Diagnose([FromForm] DiagnoseRequest request, CancellationToken ct)
    {
        if (request.Image is null || request.Image.Length == 0)
            return BadRequest(new { message = "Vui lòng cung cấp ảnh cây" });

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new DiagnosePlantCommand
        {
            ImageStream = request.Image.OpenReadStream(),
            PlantId = request.PlantId,
            UserId = userId
        }, ct);

        return Ok(result);
    }
}
*/
