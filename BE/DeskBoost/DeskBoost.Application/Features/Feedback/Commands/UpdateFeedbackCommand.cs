using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record UpdateFeedbackCommand : IRequest<AdminFeedbackDto>
{
    public Guid Id { get; init; }
    public Guid? MarketplaceItemId { get; init; }
    public string? CustomerAlias { get; init; }
    public int? Rating { get; init; }
    public string? Comment { get; init; }
    public string? PurchaseChannel { get; init; }
    public List<string>? PublicImageUrls { get; init; }
    public List<string>? EvidenceImageUrls { get; init; }
    public string? EvidenceNote { get; init; }
}

public class UpdateFeedbackCommandHandler : IRequestHandler<UpdateFeedbackCommand, AdminFeedbackDto>
{
    private readonly IAppDbContext _db;

    public UpdateFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminFeedbackDto> Handle(UpdateFeedbackCommand request, CancellationToken ct)
    {
        var feedback = await _db.Feedbacks.FirstOrDefaultAsync(f => f.Id == request.Id, ct)
            ?? throw new NotFoundException("Feedback không tồn tại.");

        if (request.MarketplaceItemId.HasValue) feedback.MarketplaceItemId = request.MarketplaceItemId;
        if (request.CustomerAlias is not null) feedback.CustomerAlias = request.CustomerAlias.Trim();
        if (request.Rating.HasValue) feedback.Rating = request.Rating;
        if (request.Comment is not null) feedback.Comment = request.Comment.Trim();
        if (request.PurchaseChannel is not null) feedback.PurchaseChannel = request.PurchaseChannel.Trim();
        if (request.PublicImageUrls is not null)
            feedback.PublicImageUrlsJson = request.PublicImageUrls.Count > 0
                ? System.Text.Json.JsonSerializer.Serialize(request.PublicImageUrls) : null;
        if (request.EvidenceImageUrls is not null)
            feedback.EvidenceImageUrlsJson = request.EvidenceImageUrls.Count > 0
                ? System.Text.Json.JsonSerializer.Serialize(request.EvidenceImageUrls) : null;
        if (request.EvidenceNote is not null) feedback.EvidenceNote = request.EvidenceNote.Trim();
        feedback.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return CreateFeedbackCommandHandler.ToAdminDto(feedback);
    }
}
