using DeskBoost.Application.Common.Interfaces;
using MediatR;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record CreateFeedbackCommand : IRequest<Guid>
{
    public Guid UserId { get; init; }
    public string Message { get; init; } = string.Empty;
    public int? Rating { get; init; }
}

public class CreateFeedbackCommandHandler : IRequestHandler<CreateFeedbackCommand, Guid>
{
    private readonly IAppDbContext _db;

    public CreateFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateFeedbackCommand request, CancellationToken ct)
    {
        var feedback = new Domain.Entities.Feedback
        {
            UserId = request.UserId,
            Message = request.Message.Trim(),
            Rating = request.Rating
        };

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync(ct);
        return feedback.Id;
    }
}
