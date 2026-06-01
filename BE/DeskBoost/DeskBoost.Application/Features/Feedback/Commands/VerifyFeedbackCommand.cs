using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record VerifyFeedbackCommand(Guid FeedbackId, bool IsVerified) : IRequest<AdminFeedbackDto>;

public class VerifyFeedbackCommandHandler : IRequestHandler<VerifyFeedbackCommand, AdminFeedbackDto>
{
    private readonly IAppDbContext _db;

    public VerifyFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminFeedbackDto> Handle(VerifyFeedbackCommand request, CancellationToken ct)
    {
        var feedback = await _db.Feedbacks
            .FirstOrDefaultAsync(f => f.Id == request.FeedbackId, ct)
            ?? throw new NotFoundException("Feedback không tồn tại.");

        feedback.IsVerified = request.IsVerified;
        feedback.VerifiedAt = request.IsVerified ? DateTime.UtcNow : null;
        feedback.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return CreateFeedbackCommandHandler.ToAdminDto(feedback);
    }
}
