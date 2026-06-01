using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Feedback.Commands;

public record CreateFeedbackCommand : IRequest<AdminFeedbackDto>
{
    public Guid? MarketplaceItemId { get; init; }
    public string? CustomerAlias { get; init; }
    public int? Rating { get; init; }
    public string? Comment { get; init; }
    public string? PurchaseChannel { get; init; }
    public List<string>? PublicImageUrls { get; init; }
    public List<string>? EvidenceImageUrls { get; init; }
    public string? EvidenceNote { get; init; }
    public bool IsVerified { get; init; } = false;
    public string SourceType { get; init; } = "admin_manual";
    public Guid? CreatedByAdminId { get; init; }
}

public class CreateFeedbackCommandHandler : IRequestHandler<CreateFeedbackCommand, AdminFeedbackDto>
{
    private readonly IAppDbContext _db;

    public CreateFeedbackCommandHandler(IAppDbContext db) => _db = db;

    public async Task<AdminFeedbackDto> Handle(CreateFeedbackCommand request, CancellationToken ct)
    {
        var feedback = new Domain.Entities.Feedback
        {
            MarketplaceItemId = request.MarketplaceItemId,
            CustomerAlias = request.CustomerAlias?.Trim(),
            Rating = request.Rating,
            Comment = request.Comment?.Trim(),
            PurchaseChannel = request.PurchaseChannel?.Trim(),
            PublicImageUrlsJson = Serialize(request.PublicImageUrls),
            EvidenceImageUrlsJson = Serialize(request.EvidenceImageUrls),
            EvidenceNote = request.EvidenceNote?.Trim(),
            IsVerified = request.IsVerified,
            VerifiedAt = request.IsVerified ? DateTime.UtcNow : null,
            SourceType = request.SourceType,
            CreatedByAdminId = request.CreatedByAdminId
        };

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync(ct);

        return ToAdminDto(feedback);
    }

    internal static AdminFeedbackDto ToAdminDto(Domain.Entities.Feedback f) => new(
        f.Id, f.MarketplaceItemId, f.CustomerAlias, f.Rating, f.Comment,
        f.PurchaseChannel,
        Deserialize(f.PublicImageUrlsJson),
        Deserialize(f.EvidenceImageUrlsJson),
        f.EvidenceNote, f.IsVerified, f.VerifiedAt,
        f.SourceType, f.CreatedByAdminId,
        f.CreatedAt, f.UpdatedAt);

    internal static FeedbackDto ToPublicDto(Domain.Entities.Feedback f) => new(
        f.Id, f.MarketplaceItemId, f.CustomerAlias, f.Rating, f.Comment,
        f.PurchaseChannel,
        Deserialize(f.PublicImageUrlsJson),
        f.IsVerified, f.VerifiedAt, f.CreatedAt);

    private static string? Serialize(List<string>? list) =>
        list is { Count: > 0 } ? System.Text.Json.JsonSerializer.Serialize(list) : null;

    internal static List<string>? Deserialize(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json); }
        catch { return null; }
    }
}
