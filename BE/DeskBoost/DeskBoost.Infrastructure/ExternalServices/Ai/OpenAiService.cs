using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Application.Common.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class OpenAiService : IGeminiService
{
    private readonly HttpClient _http;
    private readonly string _model;

    public OpenAiService(HttpClient http, IConfiguration config)
    {
        _http = http;
        var apiKey = config["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured");
        _model = config["OpenAI:Model"] ?? "gpt-4o-mini";
        _http.BaseAddress = new Uri("https://api.openai.com/v1/");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
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
            model = _model,
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            max_tokens = 500
        };

        var response = await _http.PostAsJsonAsync("chat/completions", body, ct);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            throw new HttpRequestException($"OpenAI API error {(int)response.StatusCode}: {errorBody}");
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        var doc = JsonDocument.Parse(json);
        var text = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        return ParseAdvice(text);
    }

    private static GeminiAdvice ParseAdvice(string text)
    {
        try
        {
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
