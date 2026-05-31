using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private static readonly string[] AllowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    private const long MaxSizeBytes = 5 * 1024 * 1024; // 5MB

    private readonly IStorageService _storage;

    public UploadController(IStorageService storage) => _storage = storage;

    /// <summary>POST /api/upload/image</summary>
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            throw new ValidationException("File ảnh không được để trống.");

        if (!AllowedTypes.Contains(file.ContentType.ToLower()))
            throw new ValidationException("Chỉ chấp nhận ảnh định dạng JPEG, PNG, WebP hoặc GIF.");

        if (file.Length > MaxSizeBytes)
            throw new ValidationException("Kích thước ảnh không được vượt quá 5MB.");

        await using var stream = file.OpenReadStream();
        var url = await _storage.UploadImageAsync(stream, file.FileName, ct);

        return Ok(new { url });
    }
}
