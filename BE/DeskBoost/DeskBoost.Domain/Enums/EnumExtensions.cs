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
        value switch
        {
            RepeatRule.Every2Days => "every-2-days",
            RepeatRule.Every3Days => "every-3-days",
            RepeatRule.Biweekly => "biweekly",
            _ => value.ToString().ToLowerInvariant()
        };

    public static string? ToApiString(this RepeatRule? value) =>
        value.HasValue ? value.Value.ToApiString() : null;

    public static string ToApiString(this MarketplaceStatus value) =>
        value.ToString().ToLowerInvariant();

    public static string ToApiString(this MarketplaceCategory value) =>
        PascalSplitter.Replace(value.ToString(), "-").ToLowerInvariant();

    public static string ToApiString(this PlantClaimCodeStatus value) =>
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
            "daily"        => RepeatRule.Daily,
            "every-2-days" => RepeatRule.Every2Days,
            "every2days"   => RepeatRule.Every2Days,
            "2-days"       => RepeatRule.Every2Days,
            "every-3-days" => RepeatRule.Every3Days,
            "every3days"   => RepeatRule.Every3Days,
            "3-days"       => RepeatRule.Every3Days,
            "weekly"       => RepeatRule.Weekly,
            "biweekly"     => RepeatRule.Biweekly,
            "every-14-days" => RepeatRule.Biweekly,
            "monthly"      => RepeatRule.Monthly,
            _              => null
        };

    public static MarketplaceStatus ToMarketplaceStatus(this string? value) =>
        value?.ToLowerInvariant() == "inactive" ? MarketplaceStatus.Inactive : MarketplaceStatus.Active;

    public static MarketplaceCategory ToMarketplaceCategory(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "fertilizer" => MarketplaceCategory.Fertilizer,
            "pot"        => MarketplaceCategory.Pot,
            "soil"       => MarketplaceCategory.Soil,
            "accessory"  => MarketplaceCategory.Accessory,
            "other"      => MarketplaceCategory.Other,
            _            => MarketplaceCategory.Plant
        };

    public static PlantClaimCodeStatus ToPlantClaimCodeStatus(this string? value) =>
        value?.ToLowerInvariant() switch
        {
            "claimed"   => PlantClaimCodeStatus.Claimed,
            "cancelled" => PlantClaimCodeStatus.Cancelled,
            "expired"   => PlantClaimCodeStatus.Expired,
            _           => PlantClaimCodeStatus.Unclaimed
        };

    public static UserRole ToUserRole(this string? value) =>
        value?.ToUpperInvariant() == "ADMIN" ? UserRole.ADMIN : UserRole.USER;
}
