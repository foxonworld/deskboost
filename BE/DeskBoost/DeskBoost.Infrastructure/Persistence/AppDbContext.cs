using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<Plant> Plants => Set<Plant>();
        public DbSet<PlantSpecies> PlantSpecies => Set<PlantSpecies>();
        public DbSet<Reminder> Reminders => Set<Reminder>();
        public DbSet<DiagnosisResult> DiagnosisResults => Set<DiagnosisResult>();
        public DbSet<ChatHistory> ChatHistories => Set<ChatHistory>();
        public DbSet<MarketplaceItem> MarketplaceItems => Set<MarketplaceItem>();
        public DbSet<PlantClaimCode> PlantClaimCodes => Set<PlantClaimCode>();
        public DbSet<AiDialog> AiDialogs => Set<AiDialog>();
        public DbSet<AiMessage> AiMessages => Set<AiMessage>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();
        public DbSet<AiUsage> AiUsages => Set<AiUsage>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<NotificationRead> NotificationReads => Set<NotificationRead>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
