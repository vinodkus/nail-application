using System.ComponentModel.DataAnnotations;

namespace NailApi.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductSku { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public string ProductShortName { get; set; } = string.Empty;
        public string ProductDescription { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public string DeliveryTimeSpan { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string ProductImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;


    }

}
