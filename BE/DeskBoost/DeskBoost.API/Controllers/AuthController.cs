using DeskBoost.API.Contracts.Requests;
using DeskBoost.Application.Features.Auth.Commands;
using DeskBoost.Application.Features.Auth.Queries;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender) => _sender = sender;

    /// <summary>POST /api/auth/register</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthStrict")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Email và mật khẩu không được để trống.");

        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ValidationException("Họ và tên không được để trống.");

        if (request.Password != request.ConfirmPassword)
            throw new ValidationException("Mật khẩu xác nhận không khớp.");

        var result = await _sender.Send(new RegisterCommand
        {
            Email = request.Email,
            Password = request.Password,
            FullName = request.FullName
        }, ct);

        return StatusCode(201, result);
    }

    /// <summary>POST /api/auth/login</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthLogin")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Email và mật khẩu không được để trống.");

        var result = await _sender.Send(new LoginCommand
        {
            Email = request.Email,
            Password = request.Password
        }, ct);

        return Ok(result);
    }

    /// <summary>POST /api/auth/refresh-token</summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthRefresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var refreshToken = string.IsNullOrWhiteSpace(request.Token) ? request.RefreshToken : request.Token;

        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new ValidationException("Refresh token không được để trống.");

        var result = await _sender.Send(new RefreshTokenCommand { Token = refreshToken }, ct);
        return Ok(result);
    }

    /// <summary>POST /api/auth/logout</summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request, CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _sender.Send(new LogoutCommand
        {
            RefreshToken = request.RefreshToken,
            CurrentUserId = userId
        }, ct);
        return NoContent();
    }

    /// <summary>GET /api/auth/me</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _sender.Send(new GetCurrentUserQuery(userId), ct);

        if (result is null)
            throw new NotFoundException("Không tìm thấy người dùng.");

        return Ok(result);
    }

    /// <summary>POST /api/auth/forgot-password</summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("PasswordRecovery")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("Email không được để trống.");

        var result = await _sender.Send(new ForgotPasswordCommand(request.Email), ct);
        return Ok(result);
    }

    /// <summary>POST /api/auth/reset-password</summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        var result = await _sender.Send(new ResetPasswordCommand(request.Token, request.NewPassword), ct);
        return Ok(result);
    }

    /// <summary>POST /api/auth/google</summary>
    [HttpPost("google")]
    [AllowAnonymous]
    [EnableRateLimiting("AuthLogin")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
            throw new ValidationException("Google ID token không được để trống.");

        var result = await _sender.Send(new GoogleLoginCommand(request.IdToken), ct);
        return Ok(result);
    }
}
