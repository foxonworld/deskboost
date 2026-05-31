using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class DiagnosisOrchestrator : IDiagnosisOrchestrator
{
    private readonly IPlantIdService _plantId;
    private readonly IGeminiService _gemini;
    private readonly float _confidenceThreshold;
    private readonly ILogger<DiagnosisOrchestrator> _logger;

    public DiagnosisOrchestrator(
        IPlantIdService plantId,
        IGeminiService gemini,
        IConfiguration config,
        ILogger<DiagnosisOrchestrator> logger)
    {
        _plantId = plantId;
        _gemini = gemini;
        _confidenceThreshold = config.GetValue<float>("Diagnosis:ConfidenceThreshold", 0.50f);
        _logger = logger;
    }

    public async Task<DiagnosisResultDto> DiagnoseAsync(Stream imageStream, CancellationToken ct = default)
    {
        // Đọc ảnh → base64
        using var ms = new MemoryStream();
        await imageStream.CopyToAsync(ms, ct);
        var base64 = Convert.ToBase64String(ms.ToArray());

        // Tầng 1: Plant.id API
        var plantIdResult = await _plantId.AnalyzeAsync(base64, ct);

        _logger.LogInformation(
            "[PlantId] IsHealthy={IsHealthy} | TopDisease={Disease} | Confidence={Confidence:P0} | Threshold={Threshold:P0}",
            plantIdResult.IsHealthy, plantIdResult.TopDisease, plantIdResult.Confidence, _confidenceThreshold);

        // Confidence thấp → yêu cầu chụp lại
        if (plantIdResult.Confidence < _confidenceThreshold)
        {
            _logger.LogWarning("[PlantId] Confidence quá thấp ({Confidence:P0} < {Threshold:P0}), từ chối chẩn đoán.",
                plantIdResult.Confidence, _confidenceThreshold);

            return new DiagnosisResultDto
            {
                Success = false,
                Confidence = plantIdResult.Confidence,
                Message = "Ảnh chưa đủ rõ, vui lòng chụp gần và đủ sáng hơn",
                Suggestions = plantIdResult.Suggestions
            };
        }

        // Tầng 2: Gemini — tư vấn điều trị
        var advice = await _gemini.GetTreatmentAdviceAsync(
            plantIdResult.TopDisease, plantIdResult.Confidence, ct);

        return new DiagnosisResultDto
        {
            Success = true,
            Disease = plantIdResult.TopDisease,
            Confidence = plantIdResult.Confidence,
            IsHealthy = plantIdResult.IsHealthy,
            Severity = advice.Severity,
            Cause = advice.Cause,
            Treatment = advice.Treatment,
            Prevention = advice.Prevention,
            Suggestions = plantIdResult.Suggestions
        };
    }
}
