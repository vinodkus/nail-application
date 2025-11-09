using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailApi.Models
{
    public class DistrictMaster
    {
        [Key]
        public int DistrictId { get; set; }

        [Required]
        [MaxLength(50)]
        public string DistrictName { get; set; }=string.Empty;

        [ForeignKey("StateMaster")]
        public int StateId { get; set; }

        // Navigation property
        public StateMaster State { get; set; } = null!; 

        public ICollection<CityMaster> Cities { get; set; } = new List<CityMaster>();
    }
}
