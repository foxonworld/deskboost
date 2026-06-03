namespace DeskBoost.API.Contracts.Requests;

/// <summary>Request body cho POST /api/ai/chat</summary>
public class AiChatRequest
{
    public Guid? PlantId { get; set; }
    public Guid? DiagnosisResultId { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<ChatHistoryItemRequest> History { get; set; } = [];
    public PlantContextRequest? PlantContext { get; set; }
}

public class ChatHistoryItemRequest
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class PlantContextRequest
{
    public string? Id { get; set; }
    public string? Nickname { get; set; }
    public string? Name { get; set; }
    public string? Species { get; set; }
    public string? Status { get; set; }
    public string? Light { get; set; }
    public string? Water { get; set; }
    public string? Notes { get; set; }
}

/// <summary>Form data cho POST /api/ai/diagnose</summary>
public class DiagnoseFormRequest
{
    public Guid? PlantId { get; set; }
    public IFormFile? Image { get; set; }
    public string? Question { get; set; }
}

/// <summary>Legacy form data cho POST /api/ai-chat/send</summary>
public class SendMessageRequest
{
    public string? PlantId { get; set; }
    public string? Message { get; set; }
}

/// <summary>Legacy form data cho POST /api/diagnosis</summary>
public class DiagnoseRequest
{
    public IFormFile Image { get; set; } = null!;
    public Guid? PlantId { get; set; }
}
