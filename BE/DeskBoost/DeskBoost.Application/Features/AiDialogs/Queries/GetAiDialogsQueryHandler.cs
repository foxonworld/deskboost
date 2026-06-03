using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.AiDialogs.Queries;

public class GetAiDialogsQueryHandler : IRequestHandler<GetAiDialogsQuery, List<AiDialogListItemDto>>
{
    private readonly IAppDbContext _db;

    public GetAiDialogsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AiDialogListItemDto>> Handle(GetAiDialogsQuery request, CancellationToken ct)
    {
        var query = _db.AiDialogs
            .Include(d => d.Plant)
            .Where(d => d.UserId == request.UserId
                        && (request.PlantId == null || d.PlantId == request.PlantId))
            .OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt)
            .Select(d => new AiDialogListItemDto(
                d.Id,
                d.PlantId,
                d.Plant != null ? d.Plant.Name : null,
                d.Title,
                d.LastMessage,
                d.CreatedAt));

        if (request.Limit.HasValue)
            query = query.Take(request.Limit.Value);

        return await query.ToListAsync(ct);
    }
}
