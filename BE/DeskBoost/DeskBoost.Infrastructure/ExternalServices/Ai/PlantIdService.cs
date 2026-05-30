using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class PlantIdService : IPlantIdService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public PlantIdService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["PlantId:ApiKey"] ?? throw new InvalidOperationException("PlantId:ApiKey is not configured");
        var baseUrl = config["PlantId:BaseUrl"] ?? "https://api.plant.id/v3";
        if (!baseUrl.EndsWith("/")) baseUrl += "/";
        _http.BaseAddress = new Uri(baseUrl);
        _http.DefaultRequestHeaders.Add("Api-Key", _apiKey);
    }

    public async Task<PlantIdResult> AnalyzeAsync(string base64Image, CancellationToken ct = default)
    {
        var body = new
        {
            images = new[] { $"data:image/jpeg;base64,{base64Image}" },
            similar_images = true,
            health = "all"
        };

        var response = await _http.PostAsJsonAsync("health_assessment", body, ct);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            throw new HttpRequestException($"Plant.id API error {(int)response.StatusCode}: {errorBody}");
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        var doc = JsonDocument.Parse(json);
        var result = doc.RootElement.GetProperty("result");

        var isHealthy = result.GetProperty("is_healthy").GetProperty("binary").GetBoolean();
        var suggestions = result.GetProperty("disease").GetProperty("suggestions");

        var list = new List<PlantIdSuggestion>();
        foreach (var s in suggestions.EnumerateArray())
        {
            list.Add(new PlantIdSuggestion
            {
                Name = s.GetProperty("name").GetString() ?? string.Empty,
                Probability = s.GetProperty("probability").GetSingle()
            });
        }

        var top = list.FirstOrDefault();
        return new PlantIdResult
        {
            TopDisease = top?.Name ?? "Unknown",
            Confidence = top?.Probability ?? 0f,
            IsHealthy = isHealthy,
            Suggestions = list
        };
    }
}
