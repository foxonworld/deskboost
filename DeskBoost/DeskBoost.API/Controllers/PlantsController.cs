using DeskBoost.Application.Features.Plants.Commands;
using DeskBoost.Application.Features.Plants.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

public class CreatePlantRequest
{
    public Guid UserId { get; set; }
    public Guid PlantSpeciesId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public string? Notes { get; set; }
}

public class UpdatePlantRequest
{
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public int WateringCycleDays { get; set; } = 3;
    public string? Notes { get; set; }
}

[ApiController]
[Route("api/plants")]
public class PlantsController : ControllerBase
{
    private readonly ISender _sender;

    public PlantsController(ISender sender) => _sender = sender;

    /// <summary>GET /api/plants?userId={userId} — Lấy danh sách cây của user</summary>
    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] Guid userId, CancellationToken ct)
    {
        if (userId == Guid.Empty)
            return BadRequest(new { message = "userId không hợp lệ" });

        var result = await _sender.Send(new GetUserPlantsQuery(userId), ct);
        return Ok(result);
    }

    /// <summary>GET /api/plants/{id} — Lấy chi tiết một cây</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetPlantByIdQuery(id), ct);
        if (result is null)
            return NotFound(new { message = $"Không tìm thấy cây với ID {id}" });

        return Ok(result);
    }

    /// <summary>POST /api/plants — Thêm cây mới</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePlantRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên cây không được để trống" });

        try
        {
            var result = await _sender.Send(new CreatePlantCommand
            {
                UserId = request.UserId,
                PlantSpeciesId = request.PlantSpeciesId,
                Name = request.Name,
                ImageUrl = request.ImageUrl,
                Location = request.Location,
                WateringCycleDays = request.WateringCycleDays,
                Notes = request.Notes
            }, ct);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/plants/{id} — Sửa thông tin cây</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlantRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên cây không được để trống" });

        try
        {
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
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/plants/{id} — Xóa cây</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeletePlantCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
