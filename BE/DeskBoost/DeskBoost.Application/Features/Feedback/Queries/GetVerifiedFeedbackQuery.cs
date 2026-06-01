using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.Feedback.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Queries;

public record GetVerifiedFeedbackQuery(Guid? MarketplaceItemId = null) : IRequest<List<FeedbackDto>>;

public class GetVerifiedFeedbackQueryHandler : IRequestHandler<GetVerifiedFeedbackQuery, List<FeedbackDto>>
{
    private readonly IAppDbContext _db;

    public GetVerifiedFeedbackQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<FeedbackDto>> Handle(GetVerifiedFeedbackQuery request, CancellationToken ct)
    {
        var query = _db.Feedbacks.Where(f => f.IsVerified).AsQueryable();

        if (request.MarketplaceItemId.HasValue)
            query = query.Where(f => f.MarketplaceItemId == request.MarketplaceItemId.Value);

        var feedbacks = await query.OrderByDescending(f => f.VerifiedAt).ToListAsync(ct);
        return feedbacks.Select(CreateFeedbackCommandHandler.ToPublicDto).ToList();
    }
}

public record GetAdminFeedbackQuery(
    Guid? MarketplaceItemId = null,
    bool? IsVerified = null,
    string? Channel = null
) : IRequest<List<AdminFeedbackDto>>;

public class GetAdminFeedbackQueryHandler : IRequestHandler<GetAdminFeedbackQuery, List<AdminFeedbackDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminFeedbackQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AdminFeedbackDto>> Handle(GetAdminFeedbackQuery request, CancellationToken ct)
    {
        var query = _db.Feedbacks.AsQueryable();

        if (request.MarketplaceItemId.HasValue)
            query = query.Where(f => f.MarketplaceItemId == request.MarketplaceItemId.Value);

        if (request.IsVerified.HasValue)
            query = query.Where(f => f.IsVerified == request.IsVerified.Value);

        if (!string.IsNullOrWhiteSpace(request.Channel))
            query = query.Where(f => f.PurchaseChannel == request.Channel);

        var feedbacks = await query.OrderByDescending(f => f.CreatedAt).ToListAsync(ct);
        return feedbacks.Select(CreateFeedbackCommandHandler.ToAdminDto).ToList();
    }
}
