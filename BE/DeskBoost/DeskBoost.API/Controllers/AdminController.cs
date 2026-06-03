using System.Security.Claims;
using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Admin.Commands;
using DeskBoost.Application.Features.Admin.Queries;
using DeskBoost.Application.Features.Feedback.Commands;
using DeskBoost.Application.Features.Feedback.Queries;
using DeskBoost.Application.Features.Marketplace.Commands;
using DeskBoost.Application.Features.Marketplace.Queries;
using DeskBoost.Application.Features.Notifications.Commands;
using DeskBoost.Application.Features.Notifications.Queries;
using DeskBoost.Application.Features.PlantSpecies.Commands;
using DeskBoost.Application.Features.PlantSpecies.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[Authorize(Roles = "ADMIN")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly ISender _sender;

    public AdminController(ISender sender) => _sender = sender;

    // ── Summary ──────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/summary</summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminSummaryQuery(), ct));

    // ── Users ─────────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/users</summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminUsersQuery(), ct) });

    /// <summary>GET /api/admin/users/{id}</summary>
    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminUserByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy người dùng." });
        return Ok(result);
    }

    /// <summary>PUT /api/admin/users/{id}/status</summary>
    [HttpPut("users/{id:guid}/status")]
    public async Task<IActionResult> UpdateUserStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest(new { message = "Status không hợp lệ." });
        try
        {
            var result = await _sender.Send(new UpdateAdminUserStatusCommand(id, request.Status), ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/admin/users/{id}</summary>
    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateAdminUserRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdateAdminUserCommand
            {
                UserId = id,
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                AvatarUrl = request.AvatarUrl,
                Role = request.Role
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/admin/users/{id}</summary>
    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteAdminUserCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── User Plants (claimed plants with owner) ───────────────────────────────

    /// <summary>GET /api/admin/user-plants</summary>
    [HttpGet("user-plants")]
    public async Task<IActionResult> GetUserPlants(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminUserPlantsQuery(), ct) });

    /// <summary>GET /api/admin/user-plants/{id}</summary>
    [HttpGet("user-plants/{id:guid}")]
    public async Task<IActionResult> GetUserPlantById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminUserPlantByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy cây." });
        return Ok(result);
    }

    /// <summary>PUT /api/admin/user-plants/{id}/status</summary>
    [HttpPut("user-plants/{id:guid}/status")]
    public async Task<IActionResult> UpdateUserPlantStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest(new { message = "Status không hợp lệ." });
        try
        {
            await _sender.Send(new UpdateAdminUserPlantStatusCommand(id, request.Status), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Plant Inventory (all physical plants, claimed + unclaimed) ────────────

    /// <summary>GET /api/admin/plant-inventory?status=unclaimed|claimed&marketplaceItemId=...</summary>
    [HttpGet("plant-inventory")]
    public async Task<IActionResult> GetPlantInventory(
        [FromQuery] string? status,
        [FromQuery] Guid? marketplaceItemId,
        CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminPlantInventoryQuery(status, marketplaceItemId), ct) });

    /// <summary>GET /api/admin/plant-inventory/{id}</summary>
    [HttpGet("plant-inventory/{id:guid}")]
    public async Task<IActionResult> GetPlantInventoryById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminPlantInventoryByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy cây." });
        return Ok(result);
    }

    /// <summary>POST /api/admin/plant-inventory</summary>
    [HttpPost("plant-inventory")]
    public async Task<IActionResult> CreatePlantInventory([FromBody] PlantInventoryUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên cây không được để trống." });

        if (request.MarketplaceItemId == Guid.Empty)
            return BadRequest(new { message = "marketplaceItemId là bắt buộc." });

        try
        {
            var result = await _sender.Send(new CreateAdminPlantInventoryCommand
            {
                MarketplaceItemId = request.MarketplaceItemId,
                PlantSpeciesId = request.PlantSpeciesId,
                Name = request.Name,
                SpeciesName = request.SpeciesName,
                ImageUrl = request.ImageUrl,
                Location = request.Location,
                CareLevel = request.CareLevel,
                Light = request.Light,
                Water = request.Water,
                WateringCycleDays = request.WateringCycleDays,
                Notes = request.Notes
            }, ct);
            return StatusCode(201, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>PUT /api/admin/plant-inventory/{id}</summary>
    [HttpPut("plant-inventory/{id:guid}")]
    public async Task<IActionResult> UpdatePlantInventory(Guid id, [FromBody] PlantInventoryUpsertRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdateAdminPlantInventoryCommand
            {
                PlantId = id,
                MarketplaceItemId = request.MarketplaceItemId,
                Name = request.Name,
                SpeciesName = request.SpeciesName,
                ImageUrl = request.ImageUrl,
                Location = request.Location,
                CareLevel = request.CareLevel,
                Light = request.Light,
                Water = request.Water,
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

    /// <summary>DELETE /api/admin/plant-inventory/{id}</summary>
    [HttpDelete("plant-inventory/{id:guid}")]
    public async Task<IActionResult> DeletePlantInventory(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteAdminPlantInventoryCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>POST /api/admin/plant-inventory/{id}/regenerate-code</summary>
    [HttpPost("plant-inventory/{id:guid}/regenerate-code")]
    public async Task<IActionResult> RegenerateOwnershipCode(Guid id, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new RegenerateOwnershipCodeCommand(id), ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // ── Marketplace Items ─────────────────────────────────────────────────────

    /// <summary>GET /api/admin/marketplace-items — trả tất cả status</summary>
    [HttpGet("marketplace-items")]
    public async Task<IActionResult> GetMarketplaceItems([FromQuery] int page = 1, [FromQuery] int limit = 50, [FromQuery] string? category = null, CancellationToken ct = default)
        => Ok(await _sender.Send(new GetMarketplaceItemsQuery(page, limit, IncludeAll: true, Category: category), ct));

    /// <summary>GET /api/admin/marketplace-items/{id}</summary>
    [HttpGet("marketplace-items/{id:guid}")]
    public async Task<IActionResult> GetMarketplaceItemById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetMarketplaceItemByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = $"Không tìm thấy item với ID {id}" });
        return Ok(result);
    }

    /// <summary>POST /api/admin/marketplace-items</summary>
    [HttpPost("marketplace-items")]
    public async Task<IActionResult> CreateMarketplaceItem([FromBody] MarketplaceItemUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên item không được để trống." });

        var result = await _sender.Send(new CreateMarketplaceItemCommand
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            ImageUrl = request.ImageUrl,
            PriceText = request.PriceText,
            ContactUrl = request.ContactUrl,
            Status = request.Status,
            CareLevel = request.CareLevel,
            Light = request.Light,
            Water = request.Water,
            AttributesJson = request.AttributesJson
        }, ct);
        return StatusCode(201, result);
    }

    /// <summary>PUT /api/admin/marketplace-items/{id}</summary>
    [HttpPut("marketplace-items/{id:guid}")]
    public async Task<IActionResult> UpdateMarketplaceItem(Guid id, [FromBody] MarketplaceItemUpsertRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdateMarketplaceItemCommand
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                Category = request.Category,
                ImageUrl = request.ImageUrl,
                PriceText = request.PriceText,
                ContactUrl = request.ContactUrl,
                Status = request.Status,
                CareLevel = request.CareLevel,
                Light = request.Light,
                Water = request.Water,
                AttributesJson = request.AttributesJson
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/admin/marketplace-items/{id}</summary>
    [HttpDelete("marketplace-items/{id:guid}")]
    public async Task<IActionResult> DeleteMarketplaceItem(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteMarketplaceItemCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Plant Claim Codes ─────────────────────────────────────────────────────

    /// <summary>GET /api/admin/plant-claim-codes?plantInventoryId=...&status=...</summary>
    [HttpGet("plant-claim-codes")]
    public async Task<IActionResult> GetPlantClaimCodes(
        [FromQuery] Guid? plantInventoryId,
        [FromQuery] string? status,
        CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetPlantClaimCodesQuery(plantInventoryId, status), ct) });

    /// <summary>PUT /api/admin/plant-claim-codes/{id} — update buyerContact / note</summary>
    [HttpPut("plant-claim-codes/{id:guid}")]
    public async Task<IActionResult> UpdatePlantClaimCode(Guid id, [FromBody] UpdatePlantClaimCodeRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdatePlantClaimCodeCommand
            {
                Id = id,
                BuyerContact = request.BuyerContact,
                Note = request.Note
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PATCH /api/admin/plant-claim-codes/{id}/cancel</summary>
    [HttpPatch("plant-claim-codes/{id:guid}/cancel")]
    public async Task<IActionResult> CancelPlantClaimCode(Guid id, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new CancelPlantClaimCodeCommand(id), ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // ── Feedback ──────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/feedback?marketplaceItemId=...&amp;isVerified=true&amp;channel=zalo</summary>
    [HttpGet("feedback")]
    public async Task<IActionResult> GetFeedback(
        [FromQuery] Guid? marketplaceItemId,
        [FromQuery] bool? isVerified,
        [FromQuery] string? channel,
        CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminFeedbackQuery(marketplaceItemId, isVerified, channel), ct) });

    /// <summary>POST /api/admin/feedback</summary>
    [HttpPost("feedback")]
    public async Task<IActionResult> CreateFeedback([FromBody] AdminFeedbackUpsertRequest request, CancellationToken ct)
    {
        var adminId = GetCurrentUserId();
        var result = await _sender.Send(new CreateFeedbackCommand
        {
            MarketplaceItemId = request.MarketplaceItemId,
            CustomerAlias = request.CustomerAlias,
            Rating = request.Rating,
            Comment = request.Comment,
            PurchaseChannel = request.PurchaseChannel,
            PublicImageUrls = request.PublicImageUrls,
            EvidenceImageUrls = request.EvidenceImageUrls,
            EvidenceNote = request.EvidenceNote,
            IsVerified = request.IsVerified,
            SourceType = "admin_manual",
            CreatedByAdminId = adminId
        }, ct);
        return StatusCode(201, result);
    }

    /// <summary>PUT /api/admin/feedback/{id}</summary>
    [HttpPut("feedback/{id:guid}")]
    public async Task<IActionResult> UpdateFeedback(Guid id, [FromBody] AdminFeedbackUpsertRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdateFeedbackCommand
            {
                Id = id,
                MarketplaceItemId = request.MarketplaceItemId,
                CustomerAlias = request.CustomerAlias,
                Rating = request.Rating,
                Comment = request.Comment,
                PurchaseChannel = request.PurchaseChannel,
                PublicImageUrls = request.PublicImageUrls,
                EvidenceImageUrls = request.EvidenceImageUrls,
                EvidenceNote = request.EvidenceNote
            }, ct);
            return Ok(result);
        }
        catch (Exception ex) when (ex is DeskBoost.Domain.Exceptions.NotFoundException)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>PATCH /api/admin/feedback/{id}/verify</summary>
    [HttpPatch("feedback/{id:guid}/verify")]
    public async Task<IActionResult> VerifyFeedback(Guid id, [FromBody] VerifyFeedbackRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new VerifyFeedbackCommand(id, request.IsVerified), ct);
            return Ok(result);
        }
        catch (Exception ex) when (ex is DeskBoost.Domain.Exceptions.NotFoundException)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/admin/feedback/{id}</summary>
    [HttpDelete("feedback/{id:guid}")]
    public async Task<IActionResult> DeleteFeedback(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteFeedbackCommand(id), ct);
            return NoContent();
        }
        catch (Exception ex) when (ex is DeskBoost.Domain.Exceptions.NotFoundException)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Plant Species ─────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/plant-species — tất cả loài cây (kể cả inactive)</summary>
    [HttpGet("plant-species")]
    public async Task<IActionResult> GetPlantSpecies(CancellationToken ct)
        => Ok(await _sender.Send(new GetPlantSpeciesQuery(IsActive: null), ct));

    /// <summary>GET /api/admin/plant-species/{id}</summary>
    [HttpGet("plant-species/{id:guid}")]
    public async Task<IActionResult> GetPlantSpeciesById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetPlantSpeciesByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy loài cây." });
        return Ok(result);
    }

    /// <summary>POST /api/admin/plant-species</summary>
    [HttpPost("plant-species")]
    public async Task<IActionResult> CreatePlantSpecies([FromBody] PlantSpeciesUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Tên loài không được để trống." });
        if (string.IsNullOrWhiteSpace(request.VietnameseName))
            return BadRequest(new { message = "Tên tiếng Việt không được để trống." });

        var result = await _sender.Send(new CreatePlantSpeciesCommand
        {
            Name = request.Name,
            VietnameseName = request.VietnameseName,
            Description = request.Description,
            CareInstructions = request.CareInstructions,
            CommonDiseases = request.CommonDiseases,
            ImageUrl = request.ImageUrl,
            IsActive = request.IsActive
        }, ct);
        return StatusCode(201, result);
    }

    /// <summary>PUT /api/admin/plant-species/{id}</summary>
    [HttpPut("plant-species/{id:guid}")]
    public async Task<IActionResult> UpdatePlantSpecies(Guid id, [FromBody] PlantSpeciesUpsertRequest request, CancellationToken ct)
    {
        try
        {
            var result = await _sender.Send(new UpdatePlantSpeciesCommand
            {
                Id = id,
                Name = request.Name,
                VietnameseName = request.VietnameseName,
                Description = request.Description,
                CareInstructions = request.CareInstructions,
                CommonDiseases = request.CommonDiseases,
                ImageUrl = request.ImageUrl,
                IsActive = request.IsActive
            }, ct);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>DELETE /api/admin/plant-species/{id}</summary>
    [HttpDelete("plant-species/{id:guid}")]
    public async Task<IActionResult> DeletePlantSpecies(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeletePlantSpeciesCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── AI Dialogs ────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/ai-dialogs</summary>
    [HttpGet("ai-dialogs")]
    public async Task<IActionResult> GetAiDialogs(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminAiDialogsQuery(), ct) });

    /// <summary>GET /api/admin/ai-dialogs/{id}</summary>
    [HttpGet("ai-dialogs/{id:guid}")]
    public async Task<IActionResult> GetAiDialogById(Guid id, CancellationToken ct)
    {
        var result = await _sender.Send(new GetAdminAiDialogByIdQuery(id), ct);
        if (result is null) return NotFound(new { message = "Không tìm thấy dialog." });
        return Ok(result);
    }

    // ── AI Config ─────────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/ai-config/status</summary>
    [HttpGet("ai-config/status")]
    public async Task<IActionResult> GetAiConfigStatus(CancellationToken ct)
        => Ok(await _sender.Send(new GetAdminAiConfigStatusQuery(), ct));

    // ── Notifications ─────────────────────────────────────────────────────────

    /// <summary>GET /api/admin/notifications</summary>
    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications(CancellationToken ct)
        => Ok(new { items = await _sender.Send(new GetAdminNotificationsQuery(), ct) });

    /// <summary>POST /api/admin/notifications</summary>
    [HttpPost("notifications")]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Tiêu đề không được để trống." });
        if (string.IsNullOrWhiteSpace(request.Body))
            return BadRequest(new { message = "Nội dung không được để trống." });
        if (request.TargetType == "specific" && (request.TargetUserIds is null || request.TargetUserIds.Count == 0))
            return BadRequest(new { message = "Phải chỉ định ít nhất 1 user khi targetType = specific." });

        var adminId = GetCurrentUserId() ?? Guid.Empty;
        var result = await _sender.Send(new CreateNotificationCommand
        {
            AdminId = adminId,
            Title = request.Title,
            Body = request.Body,
            Type = request.Type,
            TargetType = request.TargetType,
            TargetUserIds = request.TargetUserIds
        }, ct);
        return StatusCode(201, result);
    }

    /// <summary>DELETE /api/admin/notifications/{id} — soft delete</summary>
    [HttpDelete("notifications/{id:guid}")]
    public async Task<IActionResult> DeleteNotification(Guid id, CancellationToken ct)
    {
        try
        {
            await _sender.Send(new DeleteNotificationCommand(id), ct);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private Guid? GetCurrentUserId()
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(raw, out var id) ? id : null;
    }
}
