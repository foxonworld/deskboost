using DeskBoost.API.Middleware;
using DeskBoost.Application;
using DeskBoost.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;

namespace DeskBoost.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddApplication();
            builder.Services.AddInfrastructure(builder.Configuration);
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            var allowedOrigins = ResolveAllowedOrigins(builder.Configuration);

            if (!builder.Environment.IsDevelopment() && allowedOrigins.Length == 0)
            {
                throw new InvalidOperationException(
                    "Cors:AllowedOrigins must be configured in non-development environments.");
            }

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };
                });

            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Nhập access token (không cần 'Bearer ')",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    if (allowedOrigins.Length > 0)
                    {
                        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
                    }
                    else
                    {
                        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    }
                });
            });

            builder.Services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
                options.OnRejected = async (context, ct) =>
                {
                    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    {
                        context.HttpContext.Response.Headers.RetryAfter = Math.Ceiling(retryAfter.TotalSeconds)
                            .ToString(CultureInfo.InvariantCulture);
                    }

                    if (context.HttpContext.Response.HasStarted)
                    {
                        return;
                    }

                    context.HttpContext.Response.ContentType = "application/json";
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        statusCode = StatusCodes.Status429TooManyRequests,
                        code = "RATE_LIMITED",
                        message = "Too many requests. Please try again later."
                    }, ct);
                };

                options.AddPolicy("AuthLogin", context => CreateFixedWindowLimiter(
                    GetClientIpPartitionKey(context),
                    permitLimit: 10,
                    window: TimeSpan.FromMinutes(1)));

                options.AddPolicy("AuthStrict", context => CreateFixedWindowLimiter(
                    GetClientIpPartitionKey(context),
                    permitLimit: 5,
                    window: TimeSpan.FromMinutes(5)));

                options.AddPolicy("AuthRefresh", context => CreateFixedWindowLimiter(
                    GetClientIpPartitionKey(context),
                    permitLimit: 30,
                    window: TimeSpan.FromMinutes(1)));

                options.AddPolicy("PasswordRecovery", context => CreateFixedWindowLimiter(
                    GetClientIpPartitionKey(context),
                    permitLimit: 3,
                    window: TimeSpan.FromMinutes(15)));

                options.AddPolicy("AiChatUser", context => CreateFixedWindowLimiter(
                    GetUserOrIpPartitionKey(context),
                    permitLimit: 10,
                    window: TimeSpan.FromMinutes(1)));

                options.AddPolicy("AiDiagnoseUser", context => CreateFixedWindowLimiter(
                    GetUserOrIpPartitionKey(context),
                    permitLimit: 3,
                    window: TimeSpan.FromMinutes(1)));

                options.AddPolicy("UploadUser", context => CreateFixedWindowLimiter(
                    GetUserOrIpPartitionKey(context),
                    permitLimit: 10,
                    window: TimeSpan.FromMinutes(1)));
            });
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ExceptionHandlingMiddleware>();
            if (app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }
            app.UseCors();
            app.UseAuthentication();
            app.UseRateLimiter();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }

        private static string[] ResolveAllowedOrigins(IConfiguration configuration)
        {
            var configuredOrigins = configuration
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>();

            var scalarOrigins = configuration["Cors:AllowedOrigins"]
                ?.Split(
                    ',',
                    StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            var rawOrigins = configuredOrigins is { Length: > 0 }
                ? configuredOrigins
                : scalarOrigins ?? Array.Empty<string>();

            return rawOrigins
                .Select(NormalizeOrigin)
                .Where(origin => !string.IsNullOrWhiteSpace(origin))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }

        private static string NormalizeOrigin(string origin)
        {
            origin = origin.Trim();

            if (string.IsNullOrWhiteSpace(origin))
            {
                return string.Empty;
            }

            if (origin.Contains('*'))
            {
                throw new InvalidOperationException("Cors:AllowedOrigins must contain explicit origins only.");
            }

            if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri) || string.IsNullOrWhiteSpace(uri.Host))
            {
                throw new InvalidOperationException("Cors:AllowedOrigins contains an invalid origin.");
            }

            if (uri.AbsolutePath != "/" || !string.IsNullOrEmpty(uri.Query) || !string.IsNullOrEmpty(uri.Fragment))
            {
                throw new InvalidOperationException("Cors:AllowedOrigins must not include paths, queries, or fragments.");
            }

            return uri.GetLeftPart(UriPartial.Authority);
        }

        private static RateLimitPartition<string> CreateFixedWindowLimiter(string partitionKey, int permitLimit, TimeSpan window)
        {
            return RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = window,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                AutoReplenishment = true
            });
        }

        private static string GetClientIpPartitionKey(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString();
            return string.IsNullOrWhiteSpace(ip) ? "ip:unknown" : $"ip:{ip}";
        }

        private static string GetUserOrIpPartitionKey(HttpContext context)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? context.User.FindFirstValue("sub")
                ?? context.User.FindFirstValue("userId")
                ?? context.User.FindFirstValue("UserId");

            return string.IsNullOrWhiteSpace(userId) ? GetClientIpPartitionKey(context) : $"user:{userId}";
        }
    }
}
