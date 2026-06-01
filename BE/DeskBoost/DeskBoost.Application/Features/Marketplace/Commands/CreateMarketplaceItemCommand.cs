using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record CreateMarketplaceItemCommand : IRequest<MarketplaceItemDto>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string Category { get; init; } = "plant";
    public string? ImageUrl { get; init; }
    public string? PriceText { get; init; }
    public string? ContactUrl { get; init; }
    public string Status { get; init; } = "active";
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public string? AttributesJson { get; init; }
}

public class CreateMarketplaceItemCommandHandler : IRequestHandler<CreateMarketplaceItemCommand, MarketplaceItemDto>
{
    private readonly IAppDbContext _db;

    public CreateMarketplaceItemCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto> Handle(CreateMarketplaceItemCommand request, CancellationToken ct)
    {
        var item = new MarketplaceItem
        {
            Name = request.Name.Trim(),
            Description = request.Description,
            Category = request.Category.ToMarketplaceCategory(),
            ImageUrl = request.ImageUrl,
            PriceText = request.PriceText,
            ContactUrl = request.ContactUrl,
            Status = request.Status.ToMarketplaceStatus(),
            CareLevel = request.CareLevel,
            Light = request.Light,
            Water = request.Water,
            AttributesJson = request.AttributesJson
        };

        _db.MarketplaceItems.Add(item);
        await _db.SaveChangesAsync(ct);

        return new MarketplaceItemDto(
            item.Id, item.Name, item.Description,
            item.Category.ToApiString(),
            item.ImageUrl, item.PriceText, item.ContactUrl,
            item.Status.ToApiString(),
            item.CareLevel, item.Light, item.Water, item.AttributesJson);
    }
}
