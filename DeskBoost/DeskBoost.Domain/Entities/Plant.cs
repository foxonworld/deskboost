using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeskBoost.Domain.Entities
{
    public class Plant : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid PlantSpeciesId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Location { get; set; }
        public int WateringCycleDays { get; set; } = 3;
        public string LastCondition { get; set; } = "Healthy";  // "Healthy" | "Warning" | "Critical"
        public string? Notes { get; set; }

        public PlantSpecies Species { get; set; } = null!;
    }
}
