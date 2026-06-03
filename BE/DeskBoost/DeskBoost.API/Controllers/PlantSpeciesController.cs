using DeskBoost.Application.Features.PlantSpecies.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api/plant-species")]
[AllowAnonymous]
public class PlantSpeciesController : ControllerBase
{
    private readonly ISender _sender;

    public PlantSpeciesController(ISender sender) => _sender = sender;

    /// <summary>GET /api/plant-species — danh sách loài cây active (dùng cho dropdown FE)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _sender.Send(new GetPlantSpeciesQuery(IsActive: true), ct));

    /// <summary>GET /api/plant-species/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetPlantSpeciesByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy loài cây." });
        return Ok(result);
    }
}
