using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace DeskBoost.Application.Common.Interfaces;

public interface IAppDbContext
{
    DatabaseFacade Database { get; }
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<DiagnosisResult> DiagnosisResults { get; }
    DbSet<Plant> Plants { get; }
    DbSet<ChatHistory> ChatHistories { get; }
    DbSet<PlantSpecies> PlantSpecies { get; }
    DbSet<Reminder> Reminders { get; }
    DbSet<MarketplaceItem> MarketplaceItems { get; }
    DbSet<PlantClaimCode> PlantClaimCodes { get; }
    DbSet<AiDialog> AiDialogs { get; }
    DbSet<AiMessage> AiMessages { get; }
    DbSet<Feedback> Feedbacks { get; }
    Task<int> SaveChangesAsync(CancellationToken ct);
}
