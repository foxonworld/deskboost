using Microsoft.AspNetCore.Mvc;

namespace DeskBoost.API.Controllers;

[ApiController]
[Route("api")]
public class AiDebugController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AiDebugController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient();
        _configuration = configuration;
    }

    [HttpGet("test-gemini")]
    public async Task<IActionResult> TestGemini(CancellationToken ct)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            return Ok(new { Status = "MissingApiKey" });

        var response = await _httpClient.GetAsync(
            $"https://generativelanguage.googleapis.com/v1beta/models?key={apiKey}", ct);

        return Ok(new
        {
            Status = response.StatusCode
        });
    }

    [HttpGet("test-plantid")]
    public async Task<IActionResult> TestPlantId(CancellationToken ct)
    {
        var apiKey = _configuration["PlantId:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            return Ok(new { Status = "MissingApiKey" });

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            "https://api.plant.id/v3/health_assessment?language=en");

        request.Headers.Add("Api-Key", apiKey);

        var response = await _httpClient.SendAsync(request, ct);

        return Ok(new
        {
            Status = response.StatusCode
        });
    }
}
