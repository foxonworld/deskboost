using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class AiDialogConfiguration : IEntityTypeConfiguration<AiDialog>
{
    public void Configure(EntityTypeBuilder<AiDialog> builder)
    {
        builder.HasMany(d => d.Messages)
            .WithOne(m => m.Dialog)
            .HasForeignKey(m => m.DialogId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Plant)
            .WithMany()
            .HasForeignKey(d => d.PlantId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(d => d.Title).HasMaxLength(512);
        builder.HasIndex(d => d.UserId);
    }
}
