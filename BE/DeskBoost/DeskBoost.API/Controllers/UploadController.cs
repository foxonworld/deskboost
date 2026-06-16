using DeskBoost.API.Validation;
using DeskBoost.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace DeskBoost.API.Controllers;

[Authorize]
[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storage;

    public UploadController(IStorageService storage) => _storage = storage;

    /// <summary>POST /api/upload/image</summary>
    [HttpPost("image")]
    [EnableRateLimiting("UploadUser")]
    [RequestSizeLimit(ImageFileValidator.MaxImageBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = ImageFileValidator.MaxImageBytes)]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken ct)
    {
        var image = await ImageFileValidator.ValidateAsync(file, ct);

        await using var stream = image.File.OpenReadStream();
        var url = await _storage.UploadImageAsync(stream, image.SafeFileName, ct);

        return Ok(new { url });
    }
}
