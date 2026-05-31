namespace DeskBoost.Application.Common.Interfaces;

public interface IAiConfiguration
{
    string Provider { get; }
    bool IsConfigured { get; }
}
