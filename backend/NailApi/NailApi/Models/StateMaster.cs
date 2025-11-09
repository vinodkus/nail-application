using System.ComponentModel.DataAnnotations;

namespace NailApi.Models
{
    public class StateMaster
    {
        [Key]
        public int StateId { get; set; }

        [Required]
        [MaxLength(50)]
        public string StateName { get; set; } = string.Empty;
        
        // Navigation property: One State has many Districts
        public ICollection<DistrictMaster> Districts { get; set; } = new List<DistrictMaster>();
    }
}
