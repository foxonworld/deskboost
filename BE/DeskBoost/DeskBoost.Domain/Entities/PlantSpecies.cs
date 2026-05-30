using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeskBoost.Domain.Entities
{
    public class PlantSpecies : BaseEntity
    {
        public string Name { get; set; } = string.Empty;           // "Monstera"
        public string VietnameseName { get; set; } = string.Empty; // "Cây lá lỗ"
        public string? Description { get; set; }
        public string? CareInstructions { get; set; }              // hướng dẫn chăm sóc cơ bản
        public string? CommonDiseases { get; set; }                // bệnh thường gặp (JSON)
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Plant> Plants { get; set; } = new List<Plant>();
    }
}