using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini:ApiKey is not configured");
        _model = config["Gemini:Model"] ?? "gemini-1.5-flash";
        var baseUrl = config["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta";
        if (!baseUrl.EndsWith("/")) baseUrl += "/";
        _http.BaseAddress = new Uri(baseUrl);
    }

    public async Task<GeminiAdvice> GetTreatmentAdviceAsync(
        string disease,
        float confidence,
        CancellationToken ct = default)
    {
        var prompt =
            $"Cây bị bệnh '{disease}' ({confidence * 100:F0}% xác suất). " +
            "Trả về JSON với các trường sau: " +
            "{ \"cause\": \"nguyên nhân\", \"severity\": \"low|medium|high\", " +
            "\"treatment\": \"cách điều trị\", \"prevention\": \"cách phòng ngừa\" }. " +
            "Chỉ trả về JSON, không giải thích thêm.";

        var body = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var url = $"models/{_model}:generateContent?key={_apiKey}";
        var response = await _http.PostAsJsonAsync(url, body, ct);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            throw new HttpRequestException($"Gemini API error {(int)response.StatusCode} | URL: {_http.BaseAddress}{url} | Body: {errorBody}");
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        var doc = JsonDocument.Parse(json);
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "{}";

        return ParseAdvice(text);
    }

    private static GeminiAdvice ParseAdvice(string text)
    {
        try
        {
            // Lấy JSON từ trong text (Gemini đôi khi bọc trong ```json ... ```)
            var match = Regex.Match(text, @"\{[\s\S]*\}");
            var jsonStr = match.Success ? match.Value : text;

            var doc = JsonDocument.Parse(jsonStr);
            return new GeminiAdvice
            {
                Cause = doc.RootElement.TryGetProperty("cause", out var c) ? c.GetString() ?? "" : "",
                Severity = doc.RootElement.TryGetProperty("severity", out var s) ? s.GetString() ?? "medium" : "medium",
                Treatment = doc.RootElement.TryGetProperty("treatment", out var t) ? t.GetString() ?? "" : "",
                Prevention = doc.RootElement.TryGetProperty("prevention", out var p) ? p.GetString() ?? "" : ""
            };
        }
        catch
        {
            return new GeminiAdvice { Cause = text, Severity = "medium" };
        }
    }
}
