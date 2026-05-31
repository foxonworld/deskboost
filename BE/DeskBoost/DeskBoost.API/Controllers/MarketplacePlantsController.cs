using DeskBoost.Application.Features.Marketplace.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api/marketplace-plants")]
public class MarketplacePlantsController : ControllerBase
{
    private readonly ISender _sender;

    public MarketplacePlantsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/marketplace-plants — Danh sách cây marketplace (public)</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 12, CancellationToken ct = default)
    {
        var result = await _sender.Send(new GetMarketplacePlantsQuery(page, limit), ct);
        return Ok(result);
    }

    /// <summary>GET /api/marketplace-plants/{id} — Chi tiết cây marketplace (public)</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetMarketplacePlantByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = $"Không tìm thấy cây với ID {id}" });
        return Ok(result);
    }
}
