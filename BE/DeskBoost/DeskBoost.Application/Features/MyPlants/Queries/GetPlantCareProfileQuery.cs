using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using DeskBoost.Application.Features.MyPlants.Commands;
using DeskBoost.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DeskBoost.Application.Features.MyPlants.Queries;

public record GetPlantCareProfileQuery(Guid PlantId, Guid UserId) : IRequest<PlantCareProfileDto?>;

public class GetPlantCareProfileQueryHandler : IRequestHandler<GetPlantCareProfileQuery, PlantCareProfileDto?>
{
    private readonly IAppDbContext _db;

    public GetPlantCareProfileQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PlantCareProfileDto?> Handle(GetPlantCareProfileQuery request, CancellationToken ct)
    {
        // 1. Load plant
        var plant = await _db.Plants
            .Where(p => p.Id == request.PlantId && p.UserId == request.UserId)
            .FirstOrDefaultAsync(ct);

        if (plant is null) return null;

        string? speciesName = plant.SpeciesName;
        if (speciesName is null && plant.PlantSpeciesId.HasValue)
        {
            var species = await _db.PlantSpecies.FindAsync(new object[] { plant.PlantSpeciesId.Value }, ct);
            speciesName = species?.Name;
        }

        var plantDto = CreateMyPlantCommandHandler.ToDto(plant, speciesName);

        // 2. Load reminders
        var allReminders = await _db.Reminders
            .Include(r => r.Plant)
            .Where(r => r.PlantId == request.PlantId && r.UserId == request.UserId && r.IsActive)
            .OrderBy(r => r.DueAt)
            .ToListAsync(ct);

        var pendingReminders = allReminders
            .Where(r => r.Status == ReminderStatus.Pending)
            .Take(5)
            .Select(r => ToReminderDto(r))
            .ToList();

        var completedReminders = allReminders
            .Where(r => r.Status == ReminderStatus.Done && r.LastDoneAt.HasValue)
            .OrderByDescending(r => r.LastDoneAt)
            .Take(5)
            .Select(r => ToReminderDto(r))
            .ToList();

        // 3. Load AI dialogs
        var recentDialogs = await _db.AiDialogs
            .Include(d => d.Plant)
            .Where(d => d.PlantId == request.PlantId && d.UserId == request.UserId)
            .OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt)
            .Take(5)
            .Select(d => new AiDialogListItemDto(d.Id, d.UserId, null, null, d.PlantId, d.Plant != null ? d.Plant.Name : null, d.Title, d.LastMessage, d.CreatedAt))
            .ToListAsync(ct);

        // 4. Load latest diagnosis
        var latestDiagnosisEntity = await _db.DiagnosisResults
            .Where(d => d.PlantId == request.PlantId)
            .OrderByDescending(d => d.CreatedAt)
            .FirstOrDefaultAsync(ct);

        DiagnosisListItemDto? latestDiagnosis = null;
        if (latestDiagnosisEntity is not null)
        {
            string? disease = null;
            string? treatment = null;
            try
            {
                var diseases = JsonSerializer.Deserialize<string[]>(latestDiagnosisEntity.DiseasesJson);
                disease = diseases?.FirstOrDefault();
                var treatments = JsonSerializer.Deserialize<string[]>(latestDiagnosisEntity.TreatmentsJson);
                treatment = treatments?.FirstOrDefault();
            }
            catch { }
            latestDiagnosis = new DiagnosisListItemDto(
                latestDiagnosisEntity.Id, latestDiagnosisEntity.PlantId,
                latestDiagnosisEntity.Condition, latestDiagnosisEntity.Confidence,
                latestDiagnosisEntity.CreatedAt, disease, treatment);
        }

        // 5. Build care summary
        var nextWateringReminder = pendingReminders
            .FirstOrDefault(r => r.CareType == "watering");
        var lastWateredReminder = completedReminders
            .FirstOrDefault(r => r.CareType == "watering");

        var totalPendingCount = await _db.Reminders
            .CountAsync(r => r.PlantId == request.PlantId && r.UserId == request.UserId
                             && r.IsActive && r.Status == ReminderStatus.Pending, ct);

        var totalDialogsCount = await _db.AiDialogs
            .CountAsync(d => d.PlantId == request.PlantId && d.UserId == request.UserId, ct);

        var careSummary = new CareSummaryDto(
            NextWateringAt: nextWateringReminder?.DueAt,
            LastWateredAt: lastWateredReminder?.LastDoneAt,
            WateringCycleDays: plant.WateringCycleDays,
            LastCondition: plant.LastCondition.ToString(),
            TotalPendingReminders: totalPendingCount,
            TotalAiDialogs: totalDialogsCount
        );

        return new PlantCareProfileDto(
            Plant: plantDto,
            NextReminders: pendingReminders,
            RecentCompletedReminders: completedReminders,
            RecentAiDialogs: recentDialogs,
            LatestDiagnosis: latestDiagnosis,
            CareSummary: careSummary
        );
    }

    private static ReminderDto ToReminderDto(Domain.Entities.Reminder r) =>
        new(r.Id, r.PlantId, r.Plant?.Name, r.Title,
            r.CareType.ToApiString(), r.DueAt,
            r.RepeatRule.ToApiString(), r.Status.ToApiString(),
            r.LastDoneAt, r.Notes, r.CreatedAt, r.UpdatedAt);
}
