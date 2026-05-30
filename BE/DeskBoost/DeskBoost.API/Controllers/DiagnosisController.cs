using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.AiDiagnosis.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        var result = await _sender.Send(new DiagnosePlantCommand
        {
            ImageStream = request.Image.OpenReadStream(),
            PlantId = request.PlantId
        }, ct);

        return Ok(result);
    }
}
