using NailApi.Dtos;

namespace NailApi.DtoResponse
{
    public class ProductResponseDto
    {
        public int ProductId { get; set; }
        public string ProductSku { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public string ProductShortName { get; set; } = string.Empty;
        public string ProductDescription { get; set; } = string.Empty;
        public string DeliveryTimeSpan { get; set; } = string.Empty;    
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string ProductImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public List<ProductImageDto> AdditionalImages { get; set; } = new List<ProductImageDto>(); // Initialize here

    }
}
