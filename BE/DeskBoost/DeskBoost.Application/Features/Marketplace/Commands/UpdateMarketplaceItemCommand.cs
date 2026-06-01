using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record UpdateMarketplaceItemCommand : IRequest<MarketplaceItemDto>
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public string? Description { get; init; }
    public string? Category { get; init; }
    public string? ImageUrl { get; init; }
    public string? PriceText { get; init; }
    public string? ContactUrl { get; init; }
    public string? Status { get; init; }
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public string? AttributesJson { get; init; }
}

public class UpdateMarketplaceItemCommandHandler : IRequestHandler<UpdateMarketplaceItemCommand, MarketplaceItemDto>
{
    private readonly IAppDbContext _db;

    public UpdateMarketplaceItemCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto> Handle(UpdateMarketplaceItemCommand request, CancellationToken ct)
    {
        var item = await _db.MarketplaceItems.FirstOrDefaultAsync(p => p.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy item.");

        if (!string.IsNullOrWhiteSpace(request.Name)) item.Name = request.Name.Trim();
        if (request.Description is not null) item.Description = request.Description;
        if (!string.IsNullOrWhiteSpace(request.Category)) item.Category = request.Category.ToMarketplaceCategory();
        if (request.ImageUrl is not null) item.ImageUrl = request.ImageUrl;
        if (request.PriceText is not null) item.PriceText = request.PriceText;
        if (request.ContactUrl is not null) item.ContactUrl = request.ContactUrl;
        if (!string.IsNullOrWhiteSpace(request.Status)) item.Status = request.Status.ToMarketplaceStatus();
        if (request.CareLevel is not null) item.CareLevel = request.CareLevel;
        if (request.Light is not null) item.Light = request.Light;
        if (request.Water is not null) item.Water = request.Water;
        if (request.AttributesJson is not null) item.AttributesJson = request.AttributesJson;
        item.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new MarketplaceItemDto(
            item.Id, item.Name, item.Description,
            item.Category.ToApiString(),
            item.ImageUrl, item.PriceText, item.ContactUrl,
            item.Status.ToApiString(),
            item.CareLevel, item.Light, item.Water, item.AttributesJson);
    }
}
