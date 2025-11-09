using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailApi.Models
{
    public class CityMaster
    {
        [Key]
        public int CityId { get; set; }

        [Required]
        [MaxLength(50)]
        public string CityName { get; set; } = string.Empty;

        [ForeignKey("DistrictMaster")]
        public int DistrictId { get; set; }
        public DistrictMaster District { get; set; } = null!;
    }
}
