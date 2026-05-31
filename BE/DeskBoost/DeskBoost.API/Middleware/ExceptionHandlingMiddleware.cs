using DeskBoost.API.Contracts.Responses;
using DeskBoost.Domain.Exceptions;

namespace DeskBoost.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            var errors = ex is ValidationException ve && ve.Errors.Count > 0 ? ve.Errors : null;
            await WriteResponseAsync(context, ex.StatusCode, ex.Message, errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteResponseAsync(context, 500, "Đã xảy ra lỗi nội bộ. Vui lòng thử lại sau.");
        }
    }

    private static Task WriteResponseAsync(
        HttpContext context, int statusCode, string message,
        IReadOnlyList<string>? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        return context.Response.WriteAsJsonAsync(new ErrorResponse(statusCode, message, errors));
    }
}
