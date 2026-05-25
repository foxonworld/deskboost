using DeskBoost.Application.Features.AiChat.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

public class SendMessageRequest
{
    public string? PlantId { get; set; }
    public string? UserId { get; set; }
    public string? Message { get; set; }
}

[ApiController]
[Route("api/ai-chat")]
public class AiChatController : ControllerBase
{
    private readonly ISender _sender;

    public AiChatController(ISender sender) => _sender = sender;

    /// <summary>POST /api/ai-chat/send — Gửi tin nhắn cho AI (plantId/userId optional)</summary>
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Tin nhắn không được để trống" });

        Guid? plantId = Guid.TryParse(request.PlantId, out var pid) ? pid : null;
        Guid? userId  = Guid.TryParse(request.UserId,  out var uid) ? uid : null;

        try
        {
            var result = await _sender.Send(new SendChatMessageCommand
            {
                PlantId = plantId,
                UserId  = userId,
                Message = request.Message!
            }, ct);

            return Ok(new { content = result.Content });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
