using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.Admin.Commands;

public record DeleteAdminPlantInventoryCommand(Guid PlantId) : IRequest;

public class DeleteAdminPlantInventoryCommandHandler : IRequestHandler<DeleteAdminPlantInventoryCommand>
{
    private readonly IAppDbContext _db;

    public DeleteAdminPlantInventoryCommandHandler(IAppDbContext db) => _db = db;

    public async Task Handle(DeleteAdminPlantInventoryCommand request, CancellationToken ct)
    {
        var plant = await _db.Plants.FirstOrDefaultAsync(p => p.Id == request.PlantId, ct)
            ?? throw new InvalidOperationException("Không tìm thấy cây.");

        if (plant.IsClaimed)
            throw new InvalidOperationException("Không thể xóa cây đã được claim. Hãy thu hồi quyền sở hữu trước.");

        _db.Plants.Remove(plant);
        await _db.SaveChangesAsync(ct);
    }
}
