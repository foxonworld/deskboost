using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class AiMessageConfiguration : IEntityTypeConfiguration<AiMessage>
{
    public void Configure(EntityTypeBuilder<AiMessage> builder)
    {
        builder.Property(m => m.Role)
            .HasMaxLength(20)
            .HasConversion(v => v.ToApiString(), v => v == "assistant" ? MessageRole.Assistant : MessageRole.User);
    }
}
