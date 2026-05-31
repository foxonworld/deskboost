using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Marketplace.Commands;

public record UpdateMarketplacePlantCommand : IRequest<MarketplacePlantDto>
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public string? PriceText { get; init; }
    public string? CareLevel { get; init; }
    public string? Light { get; init; }
    public string? Water { get; init; }
    public string? ContactUrl { get; init; }
    public string? Status { get; init; }
}

public class UpdateMarketplacePlantCommandHandler : IRequestHandler<UpdateMarketplacePlantCommand, MarketplacePlantDto>
{
    private readonly IAppDbContext _db;

    public UpdateMarketplacePlantCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplacePlantDto> Handle(UpdateMarketplacePlantCommand request, CancellationToken ct)
    {
        var plant = await _db.MarketplacePlants.FirstOrDefaultAsync(p => p.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        if (!string.IsNullOrWhiteSpace(request.Name)) plant.Name = request.Name.Trim();
        if (request.Description is not null) plant.Description = request.Description;
        if (request.ImageUrl is not null) plant.ImageUrl = request.ImageUrl;
        if (request.PriceText is not null) plant.PriceText = request.PriceText;
        if (request.CareLevel is not null) plant.CareLevel = request.CareLevel;
        if (request.Light is not null) plant.Light = request.Light;
        if (request.Water is not null) plant.Water = request.Water;
        if (request.ContactUrl is not null) plant.ContactUrl = request.ContactUrl;
        if (!string.IsNullOrWhiteSpace(request.Status)) plant.Status = request.Status.ToMarketplaceStatus();
        plant.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new MarketplacePlantDto(plant.Id, plant.Name, plant.Description, plant.ImageUrl,
            plant.PriceText, plant.CareLevel, plant.Light, plant.Water, plant.ContactUrl,
            plant.Status.ToApiString());
    }
}
