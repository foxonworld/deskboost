using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Auth.Queries;
using DeskBoost.Application.Features.Users.Commands;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender) => _sender = sender;

    /// <summary>GET /api/users/me</summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMe(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetCurrentUserQuery(userId), ct);
        if (result is null)
            throw new NotFoundException("Không tìm thấy người dùng.");
        return Ok(result);
    }

    /// <summary>PUT /api/users/me</summary>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new UpdateUserProfileCommand
        {
            UserId = userId,
            Name = request.Name,
            AvatarUrl = request.AvatarUrl,
            Phone = request.Phone
        }, ct);
        return Ok(result);
    }
}
