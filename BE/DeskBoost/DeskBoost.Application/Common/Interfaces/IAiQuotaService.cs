using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Common.Interfaces;

public interface IAiQuotaService
{
    Task<AiQuotaDto> GetQuotaAsync(Guid userId, CancellationToken ct);

    /// <summary>Throws AiQuotaExceededException if user has no remaining quota.</summary>
    Task EnforceQuotaAsync(Guid userId, string feature, CancellationToken ct);

    Task RecordUsageAsync(Guid userId, string feature, Guid? plantId, Guid? diagnosisResultId, CancellationToken ct);
}
