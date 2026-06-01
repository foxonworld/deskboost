using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class FeedbackConfiguration : IEntityTypeConfiguration<Feedback>
{
    public void Configure(EntityTypeBuilder<Feedback> builder)
    {
        builder.Property(f => f.CustomerAlias).HasMaxLength(256);
        builder.Property(f => f.PurchaseChannel).HasMaxLength(100);
        builder.Property(f => f.SourceType).HasMaxLength(50).HasDefaultValue("user");

        builder.HasOne(f => f.MarketplaceItem)
            .WithMany()
            .HasForeignKey(f => f.MarketplaceItemId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
