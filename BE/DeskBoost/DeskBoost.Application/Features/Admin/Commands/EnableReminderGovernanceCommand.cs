using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.Admin.Commands;

public record EnableReminderGovernanceCommand(Guid ReminderId, Guid ActorAdminId, string Reason, string? IpAddress, string? UserAgent) : IRequest;

public class EnableReminderGovernanceCommandHandler : IRequestHandler<EnableReminderGovernanceCommand>
{
    private readonly IAppDbContext _db;

    public EnableReminderGovernanceCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(EnableReminderGovernanceCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Reason) || request.Reason.Length < 10 || request.Reason.Length > 500)
            throw new ValidationException("Lý do kích hoạt phải từ 10 đến 500 ký tự.");

        var reminder = await _db.Reminders
            .FirstOrDefaultAsync(r => r.Id == request.ReminderId, ct)
            ?? throw new NotFoundException($"Không tìm thấy Reminder với ID {request.ReminderId}");

        if (reminder.IsActive)
            return; // Idempotent

        var beforeJson = JsonSerializer.Serialize(new { reminder.Id, reminder.UserId, reminder.PlantId, reminder.IsActive, reminder.Status, reminder.DueAt, reminder.CareType });

        reminder.IsActive = true;
        reminder.UpdatedAt = DateTime.UtcNow;

        var afterJson = JsonSerializer.Serialize(new { reminder.Id, reminder.UserId, reminder.PlantId, reminder.IsActive, reminder.Status, reminder.DueAt, reminder.CareType });

        var auditLog = new AdminAuditLog
        {
            ActorAdminId = request.ActorAdminId,
            Action = "reminder.enable",
            EntityType = "Reminder",
            EntityId = reminder.Id.ToString(),
            TargetUserId = reminder.UserId,
            Reason = request.Reason.Trim(),
            BeforeJson = beforeJson,
            AfterJson = afterJson,
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent
        };

        _db.AdminAuditLogs.Add(auditLog);

        await _db.SaveChangesAsync(ct);
    }
}
