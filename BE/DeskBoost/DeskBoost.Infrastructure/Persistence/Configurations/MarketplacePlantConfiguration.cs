using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class MarketplacePlantConfiguration : IEntityTypeConfiguration<MarketplacePlant>
{
    public void Configure(EntityTypeBuilder<MarketplacePlant> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(256).IsRequired();
        builder.Property(p => p.CareLevel).HasMaxLength(50);
        builder.Property(p => p.Light).HasMaxLength(50);
        builder.Property(p => p.Water).HasMaxLength(50);

        builder.Property(p => p.Status)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToMarketplaceStatus());
    }
}
