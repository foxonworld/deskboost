using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Infrastructure.ExternalServices.Ai;
using DeskBoost.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeskBoost.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IAppDbContext>(p => p.GetRequiredService<AppDbContext>());

            services.AddHttpClient<IPlantIdService, PlantIdService>();
            services.AddHttpClient<IGeminiService, GeminiService>();
            services.AddScoped<IDiagnosisOrchestrator, DiagnosisOrchestrator>();
            services.AddHttpClient<IAiChatService, GeminiChatService>();

            return services;
        }
    }
}
