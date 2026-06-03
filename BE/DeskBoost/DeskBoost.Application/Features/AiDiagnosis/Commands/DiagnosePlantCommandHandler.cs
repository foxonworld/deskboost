using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.AiDiagnosis.Commands;

public class DiagnosePlantCommandHandler : IRequestHandler<DiagnosePlantCommand, DiagnosisResultDto>
{
    private readonly IDiagnosisOrchestrator _orchestrator;
    private readonly IAppDbContext _db;
    private readonly IAiQuotaService _quotaService;

    public DiagnosePlantCommandHandler(IDiagnosisOrchestrator orchestrator, IAppDbContext db, IAiQuotaService quotaService)
    {
        _orchestrator = orchestrator;
        _db = db;
        _quotaService = quotaService;
    }

    public async Task<DiagnosisResultDto> Handle(DiagnosePlantCommand request, CancellationToken ct)
    {
        // Enforce quota trước khi xử lý
        if (request.UserId.HasValue)
            await _quotaService.EnforceQuotaAsync(request.UserId.Value, AiFeature.Diagnosis, ct);

        if (request.PlantId.HasValue && request.UserId.HasValue)
        {
            var plantBelongsToUser = await _db.Plants
                .AnyAsync(p => p.Id == request.PlantId.Value && p.UserId == request.UserId.Value, ct);
            if (!plantBelongsToUser)
                throw new InvalidOperationException("Không tìm thấy cây hoặc cây không thuộc người dùng này.");
        }

        var result = await _orchestrator.DiagnoseAsync(request.ImageStream, ct);

        if (result.Success)
        {
            var entity = new DiagnosisResult
            {
                UserId = request.UserId,
                PlantId = request.PlantId,
                Condition = MapCondition(result.Severity),
                DiseasesJson = JsonSerializer.Serialize(new[] { result.Disease }),
                CausesJson = JsonSerializer.Serialize(new[] { result.Cause }),
                TreatmentsJson = JsonSerializer.Serialize(new[] { result.Treatment }),
                Confidence = result.Confidence
            };
            _db.DiagnosisResults.Add(entity);

            // Cập nhật Plant.Status dựa trên kết quả AI
            if (request.PlantId.HasValue)
            {
                var plant = await _db.Plants.FindAsync(new object[] { request.PlantId.Value }, ct);
                if (plant is not null)
                {
                    plant.Status = result.IsHealthy ? PlantStatus.Healthy : PlantStatus.Issue;
                    plant.LastCondition = result.IsHealthy ? PlantCondition.Healthy : PlantCondition.Critical;
                    plant.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _db.SaveChangesAsync(ct);

            result.DiagnosisId = entity.Id;

            // Ghi usage sau khi thành công
            if (request.UserId.HasValue)
                await _quotaService.RecordUsageAsync(request.UserId.Value, AiFeature.Diagnosis, request.PlantId, entity.Id, ct);
        }

        return result;
    }

    private static string MapCondition(string? severity) => severity switch
    {
        "high" => "Critical",
        "medium" => "Warning",
        _ => "Healthy"
    };
}
