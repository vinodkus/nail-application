namespace NailApi.Dtos
{
    public class OrderDetailDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = "";
        public DateTime OrderDate { get; set; }
        //public string Status { get; set; } = "";
        public int Status { get; set; } 

        public decimal TotalAmount { get; set; }
        public int TotalItems { get; set; }
        public List<OrderItemDetailDto> Items { get; set; } = new List<OrderItemDetailDto>();
    }
}
    