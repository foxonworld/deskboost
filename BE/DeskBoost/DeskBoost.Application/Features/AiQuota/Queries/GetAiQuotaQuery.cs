using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiQuota.Queries;

public record GetAiQuotaQuery(Guid UserId) : IRequest<AiQuotaDto>;

public class GetAiQuotaQueryHandler : IRequestHandler<GetAiQuotaQuery, AiQuotaDto>
{
    private readonly IAiQuotaService _quotaService;

    public GetAiQuotaQueryHandler(IAiQuotaService quotaService) => _quotaService = quotaService;

    public Task<AiQuotaDto> Handle(GetAiQuotaQuery request, CancellationToken ct) =>
        _quotaService.GetQuotaAsync(request.UserId, ct);
}
