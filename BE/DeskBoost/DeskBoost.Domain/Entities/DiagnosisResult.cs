using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeskBoost.Domain.Entities
{
    public class DiagnosisResult : BaseEntity
    {
        public Guid? UserId { get; set; }
        public Guid? PlantId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Condition { get; set; } = string.Empty;  // "Healthy" | "Warning" | "Critical"
        public string DiseasesJson { get; set; } = "[]";
        public string CausesJson { get; set; } = "[]";
        public string TreatmentsJson { get; set; } = "[]";
        public double Confidence { get; set; }

        public Plant? Plant { get; set; }
    }
}
