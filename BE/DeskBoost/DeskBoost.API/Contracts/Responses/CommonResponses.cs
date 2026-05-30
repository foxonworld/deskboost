namespace DeskBoost.API.Contracts.Responses;

public record ListResponse<T>(IReadOnlyList<T> Items);

public record PagedResponse<T>(
    IReadOnlyList<T> Items,
    PaginationResponse Pagination);

public record PaginationResponse(int Page, int Limit, int Total, int TotalPages);

public record ErrorResponse(int StatusCode, string Message, IReadOnlyList<string>? Errors = null);
