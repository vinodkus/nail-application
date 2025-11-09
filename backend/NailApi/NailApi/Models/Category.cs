using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NailApi.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        //[JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
