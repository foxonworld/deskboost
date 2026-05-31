using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Feedback.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackController(ISender sender) => _sender = sender;

    /// <summary>POST /api/feedback</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFeedbackRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { message = "Nội dung feedback không được để trống." });

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var id = await _sender.Send(new CreateFeedbackCommand
        {
            UserId = userId,
            Message = request.Message,
            Rating = request.Rating
        }, ct);

        return StatusCode(201, new { id, message = "Feedback đã được ghi nhận." });
    }
}
