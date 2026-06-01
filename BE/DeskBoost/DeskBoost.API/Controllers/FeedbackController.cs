using DeskBoost.Application.Features.Feedback.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackController(ISender sender) => _sender = sender;

    /// <summary>GET /api/feedback/verified?marketplaceItemId=uuid — Public verified feedback</summary>
    [HttpGet("verified")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVerified([FromQuery] Guid? marketplaceItemId, CancellationToken ct)
    {
        var items = await _sender.Send(new GetVerifiedFeedbackQuery(marketplaceItemId), ct);
        return Ok(new { items });
    }
}
