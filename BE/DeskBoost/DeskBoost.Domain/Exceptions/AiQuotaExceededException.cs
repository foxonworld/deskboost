namespace DeskBoost.Domain.Exceptions;

public class AiQuotaExceededException : Exception
{
    public string Feature { get; }
    public int Limit { get; }
    public int Used { get; }
    public bool HasVerifiedPlant { get; }

    public AiQuotaExceededException(string feature, int limit, int used, bool hasVerifiedPlant)
        : base($"Bạn đã dùng hết {used}/{limit} lượt AI {feature} hôm nay.")
    {
        Feature = feature;
        Limit = limit;
        Used = used;
        HasVerifiedPlant = hasVerifiedPlant;
    }
}
