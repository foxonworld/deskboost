using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class AdminAuditLogConfiguration : IEntityTypeConfiguration<AdminAuditLog>
{
    public void Configure(EntityTypeBuilder<AdminAuditLog> builder)
    {
        builder.Property(e => e.Action).HasMaxLength(80).IsRequired();
        builder.Property(e => e.EntityType).HasMaxLength(80).IsRequired();
        builder.Property(e => e.EntityId).HasMaxLength(80).IsRequired();
        builder.Property(e => e.Reason).HasMaxLength(500).IsRequired();
        builder.Property(e => e.IpAddress).HasMaxLength(50);
        builder.Property(e => e.UserAgent).HasMaxLength(500);

        builder.HasIndex(e => new { e.EntityType, e.EntityId, e.CreatedAt });
        builder.HasIndex(e => new { e.ActorAdminId, e.CreatedAt });
        builder.HasIndex(e => new { e.TargetUserId, e.CreatedAt });
        builder.HasIndex(e => new { e.Action, e.CreatedAt });
    }
}
