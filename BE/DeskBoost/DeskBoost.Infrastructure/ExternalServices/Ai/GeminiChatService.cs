using DeskBoost.Application.Common.Interfaces;
using DeskBoost.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace DeskBoost.Infrastructure.ExternalServices.Ai;

public class GeminiChatService : IAiChatService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiChatService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini:ApiKey is not configured");
        _model = config["Gemini:Model"] ?? "gemini-2.5-flash";
        var baseUrl = config["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta";
        if (!baseUrl.EndsWith("/")) baseUrl += "/";
        _http.BaseAddress = new Uri(baseUrl);
    }

    public async Task<string> SendMessageAsync(
        string userMessage,
        string systemPrompt,
        IReadOnlyList<ChatHistory> history,
        CancellationToken ct = default)
    {
        // Gemini dùng "model" thay vì "assistant"
        var contents = history
            .Select(h => new
            {
                role = h.Role == "assistant" ? "model" : "user",
                parts = new[] { new { text = h.Content } }
            })
            .ToList<object>();

        contents.Add(new
        {
            role = "user",
            parts = new[] { new { text = userMessage } }
        });

        var body = new
        {
            system_instruction = new
            {
                parts = new[] { new { text = systemPrompt } }
            },
            contents
        };

        var url = $"models/{_model}:generateContent?key={_apiKey}";
        var response = await _http.PostAsJsonAsync(url, body, ct);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            throw new HttpRequestException($"Gemini API error {(int)response.StatusCode}: {errorBody}");
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        try
        {
            var doc = JsonDocument.Parse(json);
            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "";
        }
        catch
        {
            return json;
        }
    }
}
