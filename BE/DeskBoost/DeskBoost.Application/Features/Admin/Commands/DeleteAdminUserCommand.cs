using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record DeleteAdminUserCommand(Guid UserId) : IRequest;

public class DeleteAdminUserCommandHandler : IRequestHandler<DeleteAdminUserCommand>
{
    private readonly IAppDbContext _db;

    public DeleteAdminUserCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteAdminUserCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy người dùng.");

        // Soft delete — set status Inactive và IsActive = false
        user.Status = UserStatus.Inactive;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
    }
}
