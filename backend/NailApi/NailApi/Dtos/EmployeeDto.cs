namespace NailApi.Dtos
{
    public class EmployeeDto
    {
        public string Name { get; set; }=string.Empty;
        public string Role { get; set; }=string.Empty;
        public int StateId { get; set; }
        public int DistrictId { get; set; } 
        public int CityId { get; set; } 
        public IFormFile? Image { get; set; }
    }
}
