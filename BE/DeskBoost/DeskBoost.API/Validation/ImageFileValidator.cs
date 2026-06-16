using DeskBoost.Domain.Exceptions;

namespace DeskBoost.API.Validation;

public static class ImageFileValidator
{
    public const long MaxImageBytes = 5 * 1024 * 1024;

    private static readonly IReadOnlyDictionary<string, ImageFormat> ExtensionFormats =
        new Dictionary<string, ImageFormat>(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = ImageFormat.Jpeg,
            [".jpeg"] = ImageFormat.Jpeg,
            [".png"] = ImageFormat.Png,
            [".webp"] = ImageFormat.WebP
        };

    private static readonly IReadOnlyDictionary<string, ImageFormat> MimeFormats =
        new Dictionary<string, ImageFormat>(StringComparer.OrdinalIgnoreCase)
        {
            ["image/jpeg"] = ImageFormat.Jpeg,
            ["image/png"] = ImageFormat.Png,
            ["image/webp"] = ImageFormat.WebP
        };

    public static async Task<ValidatedImageFile> ValidateAsync(IFormFile? file, CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
        {
            throw new ValidationException("Image file is required.");
        }

        if (file.Length > MaxImageBytes)
        {
            throw new ValidationException("Image file must not exceed 5 MB.");
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !ExtensionFormats.TryGetValue(extension, out var extensionFormat))
        {
            throw new ValidationException("Image format is not supported.");
        }

        var contentType = NormalizeContentType(file.ContentType);
        if (!MimeFormats.TryGetValue(contentType, out var mimeFormat) || mimeFormat != extensionFormat)
        {
            throw new ValidationException("Image content type does not match the file extension.");
        }

        await using var stream = file.OpenReadStream();
        var magicFormat = await ReadMagicFormatAsync(stream, ct);
        if (magicFormat is null || magicFormat != extensionFormat)
        {
            throw new ValidationException("Image file content is invalid.");
        }

        return new ValidatedImageFile(file, CreateSafeFileName(file.FileName, extension));
    }

    private static string NormalizeContentType(string? contentType)
    {
        return contentType?.Split(';', 2)[0].Trim().ToLowerInvariant() ?? string.Empty;
    }

    private static async Task<ImageFormat?> ReadMagicFormatAsync(Stream stream, CancellationToken ct)
    {
        var buffer = new byte[12];
        var totalRead = 0;
        while (totalRead < buffer.Length)
        {
            var read = await stream.ReadAsync(buffer.AsMemory(totalRead, buffer.Length - totalRead), ct);
            if (read == 0)
            {
                break;
            }

            totalRead += read;
        }

        if (totalRead >= 3 && buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
        {
            return ImageFormat.Jpeg;
        }

        if (totalRead >= 8 &&
            buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47 &&
            buffer[4] == 0x0D && buffer[5] == 0x0A && buffer[6] == 0x1A && buffer[7] == 0x0A)
        {
            return ImageFormat.Png;
        }

        if (totalRead >= 12 &&
            buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
            buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50)
        {
            return ImageFormat.WebP;
        }

        return null;
    }

    private static string CreateSafeFileName(string? fileName, string extension)
    {
        var safeName = Path.GetFileName(fileName);
        if (string.IsNullOrWhiteSpace(safeName) || safeName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
        {
            return $"deskboost-image-{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        }

        return safeName;
    }

    private enum ImageFormat
    {
        Jpeg,
        Png,
        WebP
    }
}

public sealed record ValidatedImageFile(IFormFile File, string SafeFileName);