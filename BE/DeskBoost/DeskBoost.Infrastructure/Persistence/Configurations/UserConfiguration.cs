using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DeskBoost.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.Email).HasMaxLength(256).IsRequired();
        builder.Property(u => u.PasswordHash).IsRequired(false);
        builder.Property(u => u.FullName).HasMaxLength(256).IsRequired();

        builder.Property(u => u.Role)
            .HasMaxLength(50)
            .HasConversion(v => v.ToString(), v => v.ToUserRole());

        builder.Property(u => u.Status)
            .HasMaxLength(50)
            .HasConversion(v => v.ToApiString(), v => v.ToUserStatus());
    }
}
