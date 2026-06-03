using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using Microsoft.Extensions.Configuration;

namespace DeskBoost.Infrastructure.ExternalServices.Storage;

public class CloudinaryStorageService : IStorageService
{
    private readonly Cloudinary _cloudinary;
    private const string Folder = "deskboost";

    public CloudinaryStorageService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
    }

    public async Task<string> UploadImageAsync(Stream stream, string fileName, CancellationToken ct = default)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, stream),
            Folder = Folder,
            Transformation = new Transformation().Width(1280).Height(1280).Crop("limit").Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error is not null)
            throw new ExternalServiceException($"Upload thất bại: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }

    public async Task DeleteImageAsync(string publicId, CancellationToken ct = default)
    {
        await _cloudinary.DestroyAsync(new DeletionParams(publicId));
    }
}
