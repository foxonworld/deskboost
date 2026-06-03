using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class NotificationReadConfiguration : IEntityTypeConfiguration<NotificationRead>
{
    public void Configure(EntityTypeBuilder<NotificationRead> builder)
    {
        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Mỗi user chỉ đọc 1 lần mỗi notification
        builder.HasIndex(r => new { r.NotificationId, r.UserId }).IsUnique();
        builder.HasIndex(r => r.UserId);
    }
}
