using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class PlantClaimCodeConfiguration : IEntityTypeConfiguration<PlantClaimCode>
{
    public void Configure(EntityTypeBuilder<PlantClaimCode> builder)
    {
        builder.Property(p => p.Code).HasMaxLength(50).IsRequired();
        builder.HasIndex(p => p.Code).IsUnique();
        builder.Property(p => p.BuyerContact).HasMaxLength(256);

        builder.Property(p => p.Status)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToPlantClaimCodeStatus());

        builder.HasOne(p => p.MarketplaceItem)
            .WithMany()
            .HasForeignKey(p => p.MarketplaceItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Plant)
            .WithMany()
            .HasForeignKey(p => p.PlantId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
