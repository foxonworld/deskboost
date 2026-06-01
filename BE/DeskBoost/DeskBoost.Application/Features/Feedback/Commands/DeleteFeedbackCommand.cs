using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record DeleteFeedbackCommand(Guid Id) : IRequest;

public class DeleteFeedbackCommandHandler : IRequestHandler<DeleteFeedbackCommand>
{
    private readonly IAppDbContext _db;

    public DeleteFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteFeedbackCommand request, CancellationToken ct)
    {
        var feedback = await _db.Feedbacks.FirstOrDefaultAsync(f => f.Id == request.Id, ct)
            ?? throw new NotFoundException("Feedback không tồn tại.");

        _db.Feedbacks.Remove(feedback);
        await _db.SaveChangesAsync(ct);
    }
}
