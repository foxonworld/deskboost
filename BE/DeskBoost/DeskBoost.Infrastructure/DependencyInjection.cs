using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Infrastructure.ExternalServices.Ai;
using DeskBoost.Infrastructure.ExternalServices.Storage;
using DeskBoost.Infrastructure.Identity;
using DeskBoost.Infrastructure.Persistence;
using DeskBoost.Infrastructure.Services;
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
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IAppDbContext>(p => p.GetRequiredService<AppDbContext>());

            services.AddHttpClient<IPlantIdService, PlantIdService>();
            services.AddHttpClient<IGeminiService, GeminiService>();
            services.AddScoped<IDiagnosisOrchestrator, DiagnosisOrchestrator>();
            services.AddHttpClient<IAiChatService, GeminiChatService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddSingleton<IAiConfiguration, AiConfigurationService>();
            services.AddScoped<IStorageService, CloudinaryStorageService>();
            services.AddScoped<IAiQuotaService, AiQuotaService>();

            return services;
        }
    }
}
