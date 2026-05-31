using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Users.Commands;

public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, UserProfileDto>
{
    private readonly IAppDbContext _db;

    public UpdateUserProfileCommandHandler(IAppDbContext db) => _db = db;

    public async Task<UserProfileDto> Handle(UpdateUserProfileCommand request, CancellationToken ct)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId && u.IsActive, ct)
            ?? throw new NotFoundException("Không tìm thấy người dùng.");

        if (!string.IsNullOrWhiteSpace(request.Name))
            user.FullName = request.Name.Trim();

        if (request.AvatarUrl is not null)
            user.AvatarUrl = request.AvatarUrl;

        if (request.Phone is not null)
            user.Phone = request.Phone;

        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return new UserProfileDto(user.Id, user.FullName, user.Email, user.Role.ToApiString(), user.AvatarUrl, user.Phone, user.CreatedAt);
    }
}
