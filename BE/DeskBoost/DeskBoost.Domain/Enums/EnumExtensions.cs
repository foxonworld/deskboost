using System.Text.RegularExpressions;

namespace DeskBoost.Domain.Enums;

/// <summary>
/// Chuyển đổi enum ↔ chuỗi API (kebab-case lowercase).
/// VD: PlantStatus.NeedsWater → "needs-water"
/// </summary>
public static class EnumExtensions
{
    private static readonly Regex PascalSplitter = new(@"(?<=[a-z])(?=[A-Z])", RegexOptions.Compiled);

    // ── To string ──────────────────────────────────────────────────────────

    public static string ToApiString(this PlantStatus value) =>
        value switch
        {
            PlantStatus.NeedsWater => "needs-water",
            _ => value.ToString().ToLowerInvariant()
        };

    public static string ToApiString(this UserStatus value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this ReminderStatus value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this CareType value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this RepeatRule value) =>
        value.ToString().ToLowerInvariant();

    public static string? ToApiString(this RepeatRule? value) =>
        value?.ToString().ToLowerInvariant();

    public static string ToApiString(this MarketplaceStatus value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this MessageRole value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this UserRole value) =>
        value.ToString(); // giữ nguyên "USER" / "ADMIN" (chữ hoa)

    // ── From string ────────────────────────────────────────────────────────

    public static PlantStatus ToPlantStatus(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "healthy"    => PlantStatus.Healthy,
            "needs-water" => PlantStatus.NeedsWater,
            "issue"      => PlantStatus.Issue,
            "active"     => PlantStatus.Active,
            "inactive"   => PlantStatus.Inactive,
            "archived"   => PlantStatus.Archived,
            _            => PlantStatus.Healthy
        };

    public static UserStatus ToUserStatus(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "inactive" => UserStatus.Inactive,
            "banned"   => UserStatus.Banned,
            _          => UserStatus.Active
        };

    public static ReminderStatus ToReminderStatus(this string? value) =>
        value?.ToLowerInvariant() == "done" ? ReminderStatus.Done : ReminderStatus.Pending;

    public static CareType ToCareType(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "fertilizing" => CareType.Fertilizing,
            "repotting"   => CareType.Repotting,
            "other"       => CareType.Other,
            _             => CareType.Watering
        };

    public static RepeatRule? ToRepeatRule(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "daily"   => RepeatRule.Daily,
            "weekly"  => RepeatRule.Weekly,
            "monthly" => RepeatRule.Monthly,
            _         => null
        };

    public static MarketplaceStatus ToMarketplaceStatus(this string? value) =>
        value?.ToLowerInvariant() == "inactive" ? MarketplaceStatus.Inactive : MarketplaceStatus.Active;

    public static UserRole ToUserRole(this string? value) =>
        value?.ToUpperInvariant() == "ADMIN" ? UserRole.ADMIN : UserRole.USER;
}
