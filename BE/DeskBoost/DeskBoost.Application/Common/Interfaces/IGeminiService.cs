using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Common.Interfaces;

public interface IGeminiService
{
    Task<GeminiAdvice> GetTreatmentAdviceAsync(
        string disease,
        float confidence,
        CancellationToken ct = default);
}
