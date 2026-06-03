namespace DeskBoost.Application.Common.Models;

public record AiQuotaFeatureInfo(
    int Limit,
    int Used,
    int Remaining,
    DateTimeOffset ResetAt
);

public record AiQuotaDto(
    bool HasVerifiedPlant,
    AiQuotaFeatureInfo Chat,
    AiQuotaFeatureInfo Diagnosis
);
