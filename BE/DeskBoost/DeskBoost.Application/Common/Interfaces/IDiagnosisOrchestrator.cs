using DeskBoost.Application.Common.Models;

namespace DeskBoost.Application.Common.Interfaces;

public interface IDiagnosisOrchestrator
{
    Task<DiagnosisResultDto> DiagnoseAsync(Stream imageStream, CancellationToken ct = default);
}
