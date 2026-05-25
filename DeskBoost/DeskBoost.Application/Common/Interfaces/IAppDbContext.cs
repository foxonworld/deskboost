using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<DiagnosisResult> DiagnosisResults { get; }
    DbSet<Plant> Plants { get; }
    DbSet<ChatHistory> ChatHistories { get; }
    DbSet<PlantSpecies> PlantSpecies { get; }
    Task<int> SaveChangesAsync(CancellationToken ct);
}
