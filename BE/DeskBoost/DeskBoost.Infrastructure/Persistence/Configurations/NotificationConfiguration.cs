using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.Property(n => n.Title).HasMaxLength(256).IsRequired();
        builder.Property(n => n.Body).IsRequired();
        builder.Property(n => n.Type).HasMaxLength(50).IsRequired();
        builder.Property(n => n.TargetType).HasMaxLength(20).IsRequired();

        builder.HasMany(n => n.Reads)
            .WithOne(r => r.Notification)
            .HasForeignKey(r => r.NotificationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => n.IsActive);
        builder.HasIndex(n => n.CreatedAt);
    }
}
