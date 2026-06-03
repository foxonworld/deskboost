using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.PlantSpecies.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Features.PlantSpecies.Commands;

public record UpdatePlantSpeciesCommand : IRequest<PlantSpeciesDto>
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public string? VietnameseName { get; init; }
    public string? Description { get; init; }
    public string? CareInstructions { get; init; }
    public string? CommonDiseases { get; init; }
    public string? ImageUrl { get; init; }
    public bool? IsActive { get; init; }
}

public class UpdatePlantSpeciesCommandHandler : IRequestHandler<UpdatePlantSpeciesCommand, PlantSpeciesDto>
{
    private readonly IAppDbContext _db;

    public UpdatePlantSpeciesCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantSpeciesDto> Handle(UpdatePlantSpeciesCommand request, CancellationToken ct)
    {
        var species = await _db.PlantSpecies.FirstOrDefaultAsync(s => s.Id == request.Id, ct)
            ?? throw new InvalidOperationException("Không tìm thấy loài cây.");

        if (request.Name is not null) species.Name = request.Name.Trim();
        if (request.VietnameseName is not null) species.VietnameseName = request.VietnameseName.Trim();
        if (request.Description is not null) species.Description = request.Description.Trim();
        if (request.CareInstructions is not null) species.CareInstructions = request.CareInstructions.Trim();
        if (request.CommonDiseases is not null) species.CommonDiseases = request.CommonDiseases.Trim();
        if (request.ImageUrl is not null) species.ImageUrl = request.ImageUrl;
        if (request.IsActive.HasValue) species.IsActive = request.IsActive.Value;

        species.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return GetPlantSpeciesQueryHandler.ToDto(species);
    }
}
