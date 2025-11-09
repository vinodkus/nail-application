namespace NailApi.DtoResponse
{
    public class OrderResponse
    {
        public int OrderItemId { get; set; }
        public string ProductName { get; set; } = "";
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }      
        public string ProductImage { get; set; } = "";

        public decimal TotalAmount { get; set; }
    }
}
