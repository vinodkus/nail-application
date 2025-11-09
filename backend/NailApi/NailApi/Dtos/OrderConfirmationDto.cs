namespace NailApi.Dtos
{
    public class OrderConfirmationDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public int Status { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string ShippingAddress { get; set; }
        public string PhoneNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemConfirmationDto> Items { get; set; } = new List<OrderItemConfirmationDto>();
    }
}
