using DeskBoost.Domain.Enums;

namespace DeskBoost.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? GoogleId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.USER;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public bool IsActive { get; set; } = true;
    public string? AvatarUrl { get; set; }
    public string? Phone { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiresAt { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
