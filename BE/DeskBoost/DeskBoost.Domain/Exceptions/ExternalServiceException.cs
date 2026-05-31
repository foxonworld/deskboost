namespace DeskBoost.Domain.Exceptions;

public class ExternalServiceException : AppException
{
    public ExternalServiceException(string message) : base(message, 502) { }
}
