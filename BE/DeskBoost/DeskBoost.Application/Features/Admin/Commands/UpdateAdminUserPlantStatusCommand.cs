using DeskBoost.Domain.Enums;
using DeskBoost.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record UpdateAdminUserPlantStatusCommand(Guid PlantId, string Status) : IRequest;

public class UpdateAdminUserPlantStatusCommandHandler : IRequestHandler<UpdateAdminUserPlantStatusCommand>
{
    private readonly IAppDbContext _db;

    public UpdateAdminUserPlantStatusCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(UpdateAdminUserPlantStatusCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants.FirstOrDefaultAsync(p => p.Id == request.PlantId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        plant.Status = request.Status.ToPlantStatus();
        plant.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }
}
