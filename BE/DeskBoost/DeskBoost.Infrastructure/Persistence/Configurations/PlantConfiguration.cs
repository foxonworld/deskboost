using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class PlantConfiguration : IEntityTypeConfiguration<Plant>
{
    public void Configure(EntityTypeBuilder<Plant> builder)
    {
        builder.Property(p => p.Status)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToPlantStatus());

        builder.Property(p => p.LastCondition)
            .HasMaxLength(50)
            .HasConversion(v => v.ToString(), v => ParseCondition(v));

        builder.HasOne(p => p.Species)
            .WithMany(s => s.Plants)
            .HasForeignKey(p => p.PlantSpeciesId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static PlantCondition ParseCondition(string v) =>
        Enum.TryParse(v, ignoreCase: true, out PlantCondition r) ? r : PlantCondition.Healthy;
}
