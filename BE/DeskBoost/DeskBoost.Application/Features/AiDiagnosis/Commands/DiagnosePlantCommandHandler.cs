using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.AiDiagnosis.Commands;

public class DiagnosePlantCommandHandler : IRequestHandler<DiagnosePlantCommand, DiagnosisResultDto>
{
    private readonly IDiagnosisOrchestrator _orchestrator;
    private readonly IAppDbContext _db;

    public DiagnosePlantCommandHandler(IDiagnosisOrchestrator orchestrator, IAppDbContext db)
    {
        _orchestrator = orchestrator;
        _db = db;
    }

    public async Task<DiagnosisResultDto> Handle(DiagnosePlantCommand request, CancellationToken ct)
    {
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
                PlantId = request.PlantId,
                Condition = MapCondition(result.Severity),
                DiseasesJson = JsonSerializer.Serialize(new[] { result.Disease }),
                CausesJson = JsonSerializer.Serialize(new[] { result.Cause }),
                TreatmentsJson = JsonSerializer.Serialize(new[] { result.Treatment }),
                Confidence = result.Confidence
            };
            _db.DiagnosisResults.Add(entity);
            await _db.SaveChangesAsync(ct);
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
