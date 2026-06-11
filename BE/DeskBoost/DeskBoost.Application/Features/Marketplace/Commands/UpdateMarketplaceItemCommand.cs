using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
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
    /// <summary>
    /// Khi null: giữ nguyên danh sách ảnh cũ.
    /// Khi empty list: xóa hết ảnh.
    /// Khi có phần tử: thay thế toàn bộ danh sách ảnh.
    /// </summary>
    public List<MarketplaceImageInputDto>? Images { get; init; }
}

public class UpdateMarketplaceItemCommandHandler : IRequestHandler<UpdateMarketplaceItemCommand, MarketplaceItemDto>
{
    private readonly IAppDbContext _db;

    public UpdateMarketplaceItemCommandHandler(IAppDbContext db) => _db = db;

    public async Task<MarketplaceItemDto> Handle(UpdateMarketplaceItemCommand request, CancellationToken ct)
    {
        // Load WITHOUT Include to avoid EF Core navigation-tracking conflicts
        // when replacing the image list.
        var item = await _db.MarketplaceItems
            .FirstOrDefaultAsync(p => p.Id == request.Id, ct)
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

        if (request.Images is not null)
        {
            // Delete old images via DbSet (bypass navigation collection entirely)
            var oldImages = await _db.MarketplaceItemImages
                .Where(i => i.MarketplaceItemId == item.Id)
                .ToListAsync(ct);

            if (oldImages.Count > 0)
                _db.MarketplaceItemImages.RemoveRange(oldImages);

            // Insert new images via DbSet with FK set explicitly
            if (request.Images.Count > 0)
            {
                _db.MarketplaceItemImages.AddRange(request.Images.Select(img => new MarketplaceItemImage
                {
                    MarketplaceItemId = item.Id,
                    ImageUrl = img.ImageUrl,
                    SortOrder = img.SortOrder,
                    IsPrimary = img.IsPrimary
                }));

                var primary = request.Images.FirstOrDefault(i => i.IsPrimary)
                              ?? request.Images.OrderBy(i => i.SortOrder).FirstOrDefault();
                item.ImageUrl = primary?.ImageUrl ?? item.ImageUrl;
            }
            else
            {
                item.ImageUrl = null;
            }
        }

        item.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        // Reload images from DB so MapToDto returns accurate list
        item.Images = await _db.MarketplaceItemImages
            .Where(i => i.MarketplaceItemId == item.Id)
            .OrderBy(i => i.SortOrder)
            .ToListAsync(ct);

        return CreateMarketplaceItemCommandHandler.MapToDto(item);
    }
}
