using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class UserEmailPreferenceConfiguration : IEntityTypeConfiguration<UserEmailPreference>
{
    public void Configure(EntityTypeBuilder<UserEmailPreference> builder)
    {
        builder.Property(e => e.EmailEnabled).HasDefaultValue(true);
        builder.Property(e => e.ReminderEmailEnabled).HasDefaultValue(true);
        builder.Property(e => e.AdminNotificationEmailEnabled).HasDefaultValue(true);
        builder.Property(e => e.SecurityEmailEnabled).HasDefaultValue(true);
        builder.Property(e => e.SuppressedReason).HasMaxLength(500);

        builder.HasIndex(e => e.UserId).IsUnique();

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
