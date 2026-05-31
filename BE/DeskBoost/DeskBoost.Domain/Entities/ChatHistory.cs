using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeskBoost.Domain.Entities
{
    public class ChatHistory : BaseEntity
    {
        public Guid PlantId { get; set; }
        public Guid UserId { get; set; }
        public string Role { get; set; } = string.Empty;    // "user" | "assistant"
        public string Content { get; set; } = string.Empty;

        public Plant Plant { get; set; } = null!;
    }
}
