using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Enums;
using DeskBoost.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Infrastructure.Services;

public class AiQuotaService : IAiQuotaService
{
    private readonly IAppDbContext _db;
    private static readonly TimeSpan VnOffset = TimeSpan.FromHours(7);

    public AiQuotaService(IAppDbContext db) => _db = db;

    public async Task<AiQuotaDto> GetQuotaAsync(Guid userId, CancellationToken ct)
    {
        var hasVerifiedPlant = await HasVerifiedPlantAsync(userId, ct);
        var (chatLimit, diagLimit) = GetLimits(hasVerifiedPlant);
        var (startUtc, endUtc) = GetVnDayRangeUtc();
        var resetAt = GetNextMidnightVn();

        var chatUsed = await _db.AiUsages.CountAsync(
            u => u.UserId == userId && u.Feature == AiFeature.Chat
                 && u.UsedAt >= startUtc && u.UsedAt < endUtc, ct);

        var diagUsed = await _db.AiUsages.CountAsync(
            u => u.UserId == userId && u.Feature == AiFeature.Diagnosis
                 && u.UsedAt >= startUtc && u.UsedAt < endUtc, ct);

        return new AiQuotaDto(
            hasVerifiedPlant,
            new AiQuotaFeatureInfo(chatLimit, chatUsed, Math.Max(0, chatLimit - chatUsed), resetAt),
            new AiQuotaFeatureInfo(diagLimit, diagUsed, Math.Max(0, diagLimit - diagUsed), resetAt)
        );
    }

    public async Task EnforceQuotaAsync(Guid userId, string feature, CancellationToken ct)
    {
        var hasVerifiedPlant = await HasVerifiedPlantAsync(userId, ct);
        var (chatLimit, diagLimit) = GetLimits(hasVerifiedPlant);
        var limit = feature == AiFeature.Chat ? chatLimit : diagLimit;
        var (startUtc, endUtc) = GetVnDayRangeUtc();

        var used = await _db.AiUsages.CountAsync(
            u => u.UserId == userId && u.Feature == feature
                 && u.UsedAt >= startUtc && u.UsedAt < endUtc, ct);

        if (used >= limit)
            throw new AiQuotaExceededException(feature, limit, used, hasVerifiedPlant);
    }

    public async Task RecordUsageAsync(Guid userId, string feature, Guid? plantId, Guid? diagnosisResultId, CancellationToken ct)
    {
        _db.AiUsages.Add(new AiUsage
        {
            UserId = userId,
            Feature = feature,
            PlantId = plantId,
            DiagnosisResultId = diagnosisResultId,
            UsedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync(ct);
    }

    // hasVerifiedPlant = có ít nhất 1 cây được claim qua DeskBoost (có ClaimCodeId), không tính cây thêm thủ công
    private async Task<bool> HasVerifiedPlantAsync(Guid userId, CancellationToken ct) =>
        await _db.Plants.AnyAsync(p => p.UserId == userId && p.ClaimCodeId.HasValue, ct);

    private static (DateTime StartUtc, DateTime EndUtc) GetVnDayRangeUtc()
    {
        var nowVn = DateTime.UtcNow.Add(VnOffset);
        var startOfDayVn = nowVn.Date;
        var startUtc = startOfDayVn - VnOffset;
        return (startUtc, startUtc.AddDays(1));
    }

    private static DateTimeOffset GetNextMidnightVn()
    {
        var nowVn = DateTime.UtcNow.Add(VnOffset);
        var tomorrowMidnightVn = nowVn.Date.AddDays(1);
        return new DateTimeOffset(tomorrowMidnightVn, VnOffset);
    }

    private static (int Chat, int Diagnosis) GetLimits(bool hasVerifiedPlant) =>
        hasVerifiedPlant ? (30, 5) : (5, 2);
}
