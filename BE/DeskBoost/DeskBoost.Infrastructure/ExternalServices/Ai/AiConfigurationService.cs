using DeskBoost.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class AiConfigurationService : IAiConfiguration
{
    public string Provider { get; }
    public bool IsConfigured { get; }

    public AiConfigurationService(IConfiguration config)
    {
        Provider = config["AI_PROVIDER"] ?? "gemini";
        IsConfigured = !string.IsNullOrEmpty(config["Gemini:ApiKey"]);
    }
}
