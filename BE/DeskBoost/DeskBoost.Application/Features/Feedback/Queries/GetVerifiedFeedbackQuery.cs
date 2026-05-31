using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Queries;

public record GetVerifiedFeedbackQuery(Guid? CatalogPlantId) : IRequest<List<FeedbackDto>>;

public class GetVerifiedFeedbackQueryHandler : IRequestHandler<GetVerifiedFeedbackQuery, List<FeedbackDto>>
{
    private readonly IAppDbContext _db;

    public GetVerifiedFeedbackQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<FeedbackDto>> Handle(GetVerifiedFeedbackQuery request, CancellationToken ct)
    {
        var query = _db.Feedbacks
            .Include(f => f.User)
            .Where(f => f.IsVerified);

        if (request.CatalogPlantId.HasValue)
            query = query.Where(f => f.CatalogPlantId == request.CatalogPlantId.Value);

        return await query
            .OrderByDescending(f => f.VerifiedAt)
            .Select(f => new FeedbackDto(
                f.Id,
                f.UserId,
                f.User != null ? f.User.FullName : null,
                f.Message,
                f.Rating,
                f.IsVerified,
                f.CatalogPlantId,
                f.VerifiedAt,
                f.CreatedAt
            ))
            .ToListAsync(ct);
    }
}
