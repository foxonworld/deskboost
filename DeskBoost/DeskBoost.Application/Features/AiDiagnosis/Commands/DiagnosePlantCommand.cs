using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiDiagnosis.Commands;

public record DiagnosePlantCommand : IRequest<DiagnosisResultDto>
{
    public required Stream ImageStream { get; init; }
    public Guid? PlantId { get; init; }
}
