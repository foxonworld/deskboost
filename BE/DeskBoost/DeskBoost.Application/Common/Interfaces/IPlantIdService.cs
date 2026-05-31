using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Common.Interfaces;

public interface IPlantIdService
{
    Task<PlantIdResult> AnalyzeAsync(string base64Image, CancellationToken ct = default);
}
