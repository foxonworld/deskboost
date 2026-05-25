using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeskBoost.Domain.Entities
{
    public class Reminder : BaseEntity
    {
        public Guid PlantId { get; set; }
        public Guid UserId { get; set; }
        public string Type { get; set; } = "watering";      // watering | fertilizing | repotting
        public DateTime ScheduledAt { get; set; }
        public bool IsSent { get; set; } = false;
        public bool IsActive { get; set; } = true;

        public Plant Plant { get; set; } = null!;
    }
}
