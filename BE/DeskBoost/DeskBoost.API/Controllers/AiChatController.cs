// LEGACY — Thay thế bởi POST /api/ai/chat (AiController)
// Giữ lại để tham khảo, không sử dụng trong production.

/*
using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.AiChat.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/ai-chat")]
public class AiChatController : ControllerBase
{
    private readonly ISender _sender;

    public AiChatController(ISender sender) => _sender = sender;

    /// <summary>POST /api/ai-chat/send (legacy)</summary>
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Tin nhắn không được để trống" });

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        Guid? plantId = Guid.TryParse(request.PlantId, out var pid) ? pid : null;

        try
        {
            var result = await _sender.Send(new SendChatMessageCommand
            {
                PlantId = plantId,
                UserId = userId,
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
*/
