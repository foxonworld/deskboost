namespace DeskBoost.Domain.Exceptions;

public class ValidationException : AppException
{
    public IReadOnlyList<string> Errors { get; }

    public ValidationException(string message, IEnumerable<string>? errors = null)
        : base(message, 400)
    {
        Errors = errors?.ToList() ?? [];
    }
}
