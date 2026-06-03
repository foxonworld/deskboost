using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations
{
    public class DiagnosisResultConfiguration : IEntityTypeConfiguration<DiagnosisResult>
    {
        public void Configure(EntityTypeBuilder<DiagnosisResult> builder)
        {
            builder.HasOne(d => d.Plant)
                   .WithMany()
                   .HasForeignKey(d => d.PlantId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(d => d.UserId);
        }
    }
}
