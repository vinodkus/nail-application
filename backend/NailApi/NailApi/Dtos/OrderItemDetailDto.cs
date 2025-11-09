namespace NailApi.Dtos
{
    public class OrderItemDetailDto
    {
        public int OrderItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string ProductImageUrl { get; set; } = "";
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public string ProductDescription { get; set; } = "";
        public string NailSize { get; set; } = "";
    }
}
