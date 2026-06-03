using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.AiDiagnosis.Queries;

public record GetDiagnosisListQuery(Guid UserId, Guid? PlantId = null, int Limit = 10) : IRequest<List<DiagnosisListItemDto>>;

public class GetDiagnosisListQueryHandler : IRequestHandler<GetDiagnosisListQuery, List<DiagnosisListItemDto>>
{
    private readonly IAppDbContext _db;

    public GetDiagnosisListQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<DiagnosisListItemDto>> Handle(GetDiagnosisListQuery request, CancellationToken ct)
    {
        // Join với Plants để đảm bảo chỉ trả diagnosis của user hiện tại
        var query = _db.DiagnosisResults
            .Where(d => d.PlantId == null
                        || _db.Plants.Any(p => p.Id == d.PlantId && p.UserId == request.UserId))
            .Where(d => request.PlantId == null || d.PlantId == request.PlantId)
            .OrderByDescending(d => d.CreatedAt)
            .Take(request.Limit);

        var results = await query.ToListAsync(ct);

        return results.Select(d =>
        {
            string? disease = null;
            string? treatment = null;
            try
            {
                var diseases = JsonSerializer.Deserialize<string[]>(d.DiseasesJson);
                disease = diseases?.FirstOrDefault();
                var treatments = JsonSerializer.Deserialize<string[]>(d.TreatmentsJson);
                treatment = treatments?.FirstOrDefault();
            }
            catch { /* ignore malformed JSON */ }

            return new DiagnosisListItemDto(d.Id, d.PlantId, d.Condition, d.Confidence, d.CreatedAt, disease, treatment);
        }).ToList();
    }
}
