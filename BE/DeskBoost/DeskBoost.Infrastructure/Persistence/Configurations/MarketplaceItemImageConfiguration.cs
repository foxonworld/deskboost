using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class MarketplaceItemImageConfiguration : IEntityTypeConfiguration<MarketplaceItemImage>
{
    public void Configure(EntityTypeBuilder<MarketplaceItemImage> builder)
    {
        builder.ToTable("MarketplaceItemImages");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ImageUrl).IsRequired();

        builder.HasOne(x => x.MarketplaceItem)
            .WithMany(x => x.Images)
            .HasForeignKey(x => x.MarketplaceItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
