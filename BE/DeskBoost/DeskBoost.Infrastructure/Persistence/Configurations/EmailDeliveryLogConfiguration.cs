using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class EmailDeliveryLogConfiguration : IEntityTypeConfiguration<EmailDeliveryLog>
{
    public void Configure(EntityTypeBuilder<EmailDeliveryLog> builder)
    {
        builder.Property(e => e.Category).HasMaxLength(80).IsRequired();
        builder.Property(e => e.RecipientEmail).HasMaxLength(320).IsRequired();
        builder.Property(e => e.Subject).HasMaxLength(256).IsRequired();
        builder.Property(e => e.Provider).HasMaxLength(80).IsRequired();
        builder.Property(e => e.Status).HasMaxLength(40).IsRequired();
        builder.Property(e => e.IdempotencyKey).HasMaxLength(300).IsRequired();
        builder.Property(e => e.RelatedEntityType).HasMaxLength(80);
        builder.Property(e => e.ErrorCode).HasMaxLength(120);
        builder.Property(e => e.ErrorMessage).HasMaxLength(1000);

        builder.HasIndex(e => e.IdempotencyKey).IsUnique();
        builder.HasIndex(e => new { e.Category, e.Status, e.CreatedAt });
        builder.HasIndex(e => new { e.RelatedEntityType, e.RelatedEntityId });
    }
}