using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminSummaryQuery : IRequest<AdminSummaryDto>;

public class GetAdminSummaryQueryHandler : IRequestHandler<GetAdminSummaryQuery, AdminSummaryDto>
{
    private readonly IAppDbContext _db;
    private readonly IAiConfiguration _aiConfig;

    public GetAdminSummaryQueryHandler(IAppDbContext db, IAiConfiguration aiConfig)
    {
        _db = db;
        _aiConfig = aiConfig;
    }

    public async Task<AdminSummaryDto> Handle(GetAdminSummaryQuery request, CancellationToken ct)
    {
        var users = await _db.Users.CountAsync(ct);
        var userPlants = await _db.Plants.CountAsync(ct);
        var marketplaceItems = await _db.MarketplaceItems.CountAsync(ct);
        var aiDialogs = await _db.AiDialogs.CountAsync(ct);

        return new AdminSummaryDto(users, userPlants, marketplaceItems, aiDialogs, _aiConfig.IsConfigured);
    }
}
