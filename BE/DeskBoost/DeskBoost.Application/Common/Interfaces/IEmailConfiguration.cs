namespace DeskBoost.Application.Common.Interfaces;

public interface IEmailConfiguration
{
    bool IsEnabled { get; }
    bool ExposeResetTokenInResponse { get; }
}
