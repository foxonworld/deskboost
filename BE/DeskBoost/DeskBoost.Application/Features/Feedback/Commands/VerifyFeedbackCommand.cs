using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record VerifyFeedbackCommand(Guid FeedbackId, bool IsVerified) : IRequest<FeedbackDto>;

public class VerifyFeedbackCommandHandler : IRequestHandler<VerifyFeedbackCommand, FeedbackDto>
{
    private readonly IAppDbContext _db;

    public VerifyFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task<FeedbackDto> Handle(VerifyFeedbackCommand request, CancellationToken ct)
    {
        var feedback = await _db.Feedbacks
            .Include(f => f.User)
            .FirstOrDefaultAsync(f => f.Id == request.FeedbackId, ct)
            ?? throw new NotFoundException("Feedback không tồn tại.");

        feedback.IsVerified = request.IsVerified;
        feedback.VerifiedAt = request.IsVerified ? DateTime.UtcNow : null;
        feedback.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new FeedbackDto(
            feedback.Id,
            feedback.UserId,
            feedback.User?.FullName,
            feedback.Message,
            feedback.Rating,
            feedback.IsVerified,
            feedback.CatalogPlantId,
            feedback.VerifiedAt,
            feedback.CreatedAt
        );
    }
}
