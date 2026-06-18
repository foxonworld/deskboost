using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class ReminderConfiguration : IEntityTypeConfiguration<Reminder>
{
    public void Configure(EntityTypeBuilder<Reminder> builder)
    {
        builder.Property(r => r.Title).HasMaxLength(512).IsRequired();

        builder.Property(r => r.CareType)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToCareType());

        builder.Property(r => r.RepeatRule)
            .HasMaxLength(50)
            .HasConversion(
                v => v.ToApiString(),
                v => v.ToRepeatRule());

        builder.Property(r => r.Status)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToReminderStatus());

        builder.HasOne(r => r.Plant)
            .WithMany()
            .HasForeignKey(r => r.PlantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => new { r.IsActive, r.Status, r.CareType, r.DueAt });
    }
}
