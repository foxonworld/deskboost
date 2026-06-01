using DeskBoost.Application.Features.Marketplace.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api/marketplace-items")]
public class MarketplaceItemsController : ControllerBase
{
    private readonly ISender _sender;

    public MarketplaceItemsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/marketplace-items — Danh sách marketplace items (public)</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 12, CancellationToken ct = default)
    {
        var result = await _sender.Send(new GetMarketplaceItemsQuery(page, limit), ct);
        return Ok(result);
    }

    /// <summary>GET /api/marketplace-items/{id} — Chi tiết marketplace item (public)</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetMarketplaceItemByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = $"Không tìm thấy item với ID {id}" });
        return Ok(result);
    }
}
