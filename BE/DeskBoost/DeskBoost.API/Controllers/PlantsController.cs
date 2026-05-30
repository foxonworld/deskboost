using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Plants.Commands;
using DeskBoost.Application.Features.Plants.Queries;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/plants")]
public class PlantsController : ControllerBase
{
    private readonly ISender _sender;

    public PlantsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/plants</summary>
    [HttpGet]
    public async Task<IActionResult> GetByUser(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetUserPlantsQuery(userId), ct);
        return Ok(result);
    }

    /// <summary>GET /api/plants/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetPlantByIdQuery(id), ct);
        if (result is null)
            throw new NotFoundException($"Không tìm thấy cây với ID {id}");
        return Ok(result);
    }

    /// <summary>POST /api/plants</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePlantRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("Tên cây không được để trống.");

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new CreatePlantCommand
        {
            UserId = userId,
            PlantSpeciesId = request.PlantSpeciesId,
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            Location = request.Location,
            WateringCycleDays = request.WateringCycleDays,
            Notes = request.Notes
        }, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>PUT /api/plants/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlantRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("Tên cây không được để trống.");

        var result = await _sender.Send(new UpdatePlantCommand
        {
            Id = id,
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            Location = request.Location,
            WateringCycleDays = request.WateringCycleDays,
            Notes = request.Notes
        }, ct);
        return Ok(result);
    }

    /// <summary>DELETE /api/plants/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _sender.Send(new DeletePlantCommand(id), ct);
        return NoContent();
    }
}
