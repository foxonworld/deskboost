using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Queries;

public record GetAdminAiDialogsQuery : IRequest<List<AiDialogListItemDto>>;

public class GetAdminAiDialogsQueryHandler : IRequestHandler<GetAdminAiDialogsQuery, List<AiDialogListItemDto>>
{
    private readonly IAppDbContext _db;

    public GetAdminAiDialogsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<List<AiDialogListItemDto>> Handle(GetAdminAiDialogsQuery request, CancellationToken ct)
    {
        return await _db.AiDialogs
            .Include(d => d.Plant)
            .OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt)
            .Select(d => new AiDialogListItemDto(
                d.Id,
                d.UserId,
                _db.Users.Where(u => u.Id == d.UserId).Select(u => u.Email).FirstOrDefault(),
                _db.Users.Where(u => u.Id == d.UserId).Select(u => u.FullName).FirstOrDefault(),
                d.PlantId,
                d.Plant != null ? d.Plant.Name : null,
                d.Title, d.LastMessage, d.CreatedAt))
            .ToListAsync(ct);
    }
}

public record GetAdminAiDialogByIdQuery(Guid DialogId) : IRequest<AiDialogDetailDto?>;

public class GetAdminAiDialogByIdQueryHandler : IRequestHandler<GetAdminAiDialogByIdQuery, AiDialogDetailDto?>
{
    private readonly IAppDbContext _db;

    public GetAdminAiDialogByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AiDialogDetailDto?> Handle(GetAdminAiDialogByIdQuery request, CancellationToken ct)
    {
        var dialog = await _db.AiDialogs
            .Include(d => d.Plant)
            .Include(d => d.Messages)
            .FirstOrDefaultAsync(d => d.Id == request.DialogId, ct);

        if (dialog is null) return null;

        var user = await _db.Users.FindAsync(new object[] { dialog.UserId }, ct);

        var messages = dialog.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new AiMessageDto(m.Id, m.Role.ToApiString(), m.Content, m.CreatedAt))
            .ToList();

        return new AiDialogDetailDto(
            dialog.Id,
            dialog.UserId,
            user?.Email,
            user?.FullName,
            dialog.PlantId,
            dialog.Plant?.Name,
            dialog.Title,
            messages,
            dialog.CreatedAt);
    }
}

public record GetAdminAiConfigStatusQuery : IRequest<AdminAiConfigStatusDto>;

public class GetAdminAiConfigStatusQueryHandler : IRequestHandler<GetAdminAiConfigStatusQuery, AdminAiConfigStatusDto>
{
    private readonly IAiConfiguration _aiConfig;

    public GetAdminAiConfigStatusQueryHandler(IAiConfiguration aiConfig) => _aiConfig = aiConfig;

    public Task<AdminAiConfigStatusDto> Handle(GetAdminAiConfigStatusQuery request, CancellationToken ct)
        => Task.FromResult(new AdminAiConfigStatusDto(_aiConfig.Provider, _aiConfig.IsConfigured, DateTime.UtcNow));
}
