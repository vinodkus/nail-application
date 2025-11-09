namespace NailApi.Dtos
{
    public class OrderItemConfirmationDto
    {
        public int OrderItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public string ProductDescription { get; set; }
        public string ProductSku { get; set; }
        public string DeliveryTimeSpan { get; set; }
    }
}
