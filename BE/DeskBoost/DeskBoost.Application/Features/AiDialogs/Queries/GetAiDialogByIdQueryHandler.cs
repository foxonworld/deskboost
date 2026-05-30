using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.AiDialogs.Queries;

public class GetAiDialogByIdQueryHandler : IRequestHandler<GetAiDialogByIdQuery, AiDialogDetailDto?>
{
    private readonly IAppDbContext _db;

    public GetAiDialogByIdQueryHandler(IAppDbContext db) => _db = db;

    public async Task<AiDialogDetailDto?> Handle(GetAiDialogByIdQuery request, CancellationToken ct)
    {
        var dialog = await _db.AiDialogs
            .Include(d => d.Plant)
            .Include(d => d.Messages)
            .FirstOrDefaultAsync(d => d.Id == request.DialogId && d.UserId == request.UserId, ct);

        if (dialog is null) return null;

        var messages = dialog.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new AiMessageDto(m.Id, m.Role.ToApiString(), m.Content, m.CreatedAt))
            .ToList();

        return new AiDialogDetailDto(dialog.Id, dialog.PlantId, dialog.Plant?.Name, dialog.Title, messages, dialog.CreatedAt);
    }
}
