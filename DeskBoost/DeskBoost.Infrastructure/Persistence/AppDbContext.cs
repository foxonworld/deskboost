using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeskBoost.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Plant> Plants => Set<Plant>();
        public DbSet<PlantSpecies> PlantSpecies => Set<PlantSpecies>();
        public DbSet<Reminder> Reminders => Set<Reminder>();
        public DbSet<DiagnosisResult> DiagnosisResults => Set<DiagnosisResult>();
        public DbSet<ChatHistory> ChatHistories => Set<ChatHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
