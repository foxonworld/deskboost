namespace DeskBoost.API.Contracts.Requests;

public class CreateMyPlantRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Species { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
    public string? Notes { get; set; }
}

public class UpdateMyPlantRequest
{
    public string? Name { get; set; }
    public string? Species { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
}
