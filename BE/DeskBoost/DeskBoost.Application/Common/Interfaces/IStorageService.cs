namespace DeskBoost.Application.Common.Interfaces;

public interface IStorageService
{
    Task<string> UploadImageAsync(Stream stream, string fileName, CancellationToken ct = default);
    Task DeleteImageAsync(string publicId, CancellationToken ct = default);
}
