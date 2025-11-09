using System.ComponentModel.DataAnnotations.Schema;

namespace NailApi.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; }    =string.Empty;
        [ForeignKey("State")]
        public int StateId { get; set; }
        [ForeignKey("District")]
        public int DistrictId { get; set; }
        [ForeignKey("City")]
        public int CityId { get; set; }

        public string? ImagePath { get; set; }

        //public StateMaster State { get; set; } = null!;
        //public DistrictMaster District { get; set; } = null!;
        //public CityMaster City { get; set; } = null!;   

    }
}
