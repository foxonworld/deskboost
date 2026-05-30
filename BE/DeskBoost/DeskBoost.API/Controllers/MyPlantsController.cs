using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.MyPlants.Commands;
using DeskBoost.Application.Features.MyPlants.Queries;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/my-plants")]
public class MyPlantsController : ControllerBase
{
    private readonly ISender _sender;

    public MyPlantsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/my-plants</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var items = await _sender.Send(new GetMyPlantsQuery(userId), ct);
        return Ok(new { items });
    }

    /// <summary>GET /api/my-plants/{id}</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetMyPlantByIdQuery(id, userId), ct);
        if (result is null)
            throw new NotFoundException($"Không tìm thấy cây với ID {id}");
        return Ok(result);
    }

    /// <summary>POST /api/my-plants</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMyPlantRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("Tên cây không được để trống.");

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new CreateMyPlantCommand
        {
            UserId = userId,
            Name = request.Name,
            Species = request.Species,
            Location = request.Location,
            ImageUrl = request.ImageUrl,
            Notes = request.Notes
        }, ct);

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>PUT /api/my-plants/{id}</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMyPlantRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new UpdateMyPlantCommand
        {
            PlantId = id,
            UserId = userId,
            Name = request.Name,
            Species = request.Species,
            Location = request.Location,
            ImageUrl = request.ImageUrl,
            Status = request.Status,
            Notes = request.Notes
        }, ct);
        return Ok(result);
    }

    /// <summary>DELETE /api/my-plants/{id}</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _sender.Send(new DeleteMyPlantCommand(id, userId), ct);
        return NoContent();
    }
}
