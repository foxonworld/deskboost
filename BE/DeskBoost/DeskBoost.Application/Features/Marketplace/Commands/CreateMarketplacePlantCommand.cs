using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record CreateMarketplacePlantCommand : IRequest<MarketplacePlantDto>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public string? PriceText { get; init; }
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public string? ContactUrl { get; init; }
    public string Status { get; init; } = "active";
}

public class CreateMarketplacePlantCommandHandler : IRequestHandler<CreateMarketplacePlantCommand, MarketplacePlantDto>
{
    private readonly IAppDbContext _db;

    public CreateMarketplacePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplacePlantDto> Handle(CreateMarketplacePlantCommand request, CancellationToken ct)
    {
        var plant = new MarketplacePlant
        {
            Name = request.Name.Trim(),
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            PriceText = request.PriceText,
            CareLevel = request.CareLevel,
            Light = request.Light,
            Water = request.Water,
            ContactUrl = request.ContactUrl,
            Status = request.Status.ToMarketplaceStatus()
        };

        _db.MarketplacePlants.Add(plant);
        await _db.SaveChangesAsync(ct);

        return new MarketplacePlantDto(plant.Id, plant.Name, plant.Description, plant.ImageUrl,
            plant.PriceText, plant.CareLevel, plant.Light, plant.Water, plant.ContactUrl,
            plant.Status.ToApiString());
    }
}
