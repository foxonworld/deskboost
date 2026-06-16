using DeskBoost.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace DeskBoost.Infrastructure.ExternalServices.Email;

public class EmailConfigurationService : IEmailConfiguration
{
    private readonly IConfiguration _configuration;

    public EmailConfigurationService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public bool IsEnabled =>
        bool.TryParse(_configuration["Email:Enabled"], out var enabled) && enabled;

    public bool ExposeResetTokenInResponse =>
        bool.TryParse(_configuration["Email:ExposeResetTokenInResponse"], out var exposeToken) && exposeToken;
}
