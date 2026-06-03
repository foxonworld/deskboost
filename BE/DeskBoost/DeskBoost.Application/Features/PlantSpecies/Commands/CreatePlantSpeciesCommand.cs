using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.PlantSpecies.Queries;
using MediatR;

namespace DeskBoost.Application.Features.PlantSpecies.Commands;

public record CreatePlantSpeciesCommand : IRequest<PlantSpeciesDto>
{
    public string Name { get; init; } = string.Empty;
    public string VietnameseName { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? CareInstructions { get; init; }
    public string? CommonDiseases { get; init; }
    public string? ImageUrl { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreatePlantSpeciesCommandHandler : IRequestHandler<CreatePlantSpeciesCommand, PlantSpeciesDto>
{
    private readonly IAppDbContext _db;

    public CreatePlantSpeciesCommandHandler(IAppDbContext db) => _db = db;

    public async Task<PlantSpeciesDto> Handle(CreatePlantSpeciesCommand request, CancellationToken ct)
    {
        var species = new Domain.Entities.PlantSpecies
        {
            Name = request.Name.Trim(),
            VietnameseName = request.VietnameseName.Trim(),
            Description = request.Description?.Trim(),
            CareInstructions = request.CareInstructions?.Trim(),
            CommonDiseases = request.CommonDiseases?.Trim(),
            ImageUrl = request.ImageUrl,
            IsActive = request.IsActive
        };

        _db.PlantSpecies.Add(species);
        await _db.SaveChangesAsync(ct);

        return GetPlantSpeciesQueryHandler.ToDto(species);
    }
}
