using System;

namespace DeskBoost.Domain.Entities
{
    public class AdminAuditLog : BaseEntity
    {
        public Guid ActorAdminId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public Guid? TargetUserId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? BeforeJson { get; set; }
        public string? AfterJson { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
    }
}
