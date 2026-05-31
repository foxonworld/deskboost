namespace DeskBoost.API.Contracts.Requests;

public class UpdateProfileRequest
{
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Phone { get; set; }
}
