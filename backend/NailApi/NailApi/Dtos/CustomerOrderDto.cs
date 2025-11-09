namespace NailApi.Dtos
{
    public class CustomerOrderDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = "";
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = "";
        public string PaymentStatus { get; set; } = "";
        public string TransactionId { get; set; } = "";
        public DateTime PaymentDate { get; set; } 
    }

    public enum OrderStatus
    {
        Pending = 0,
        Processing = 1,
        Completed = 2,
        Cancelled = 3,
        Shipped = 4,
        Delivered = 5,
        Returned = 6,
        Refunded = 7,
        OnHold = 8,
        PaymentPendingVerification = 9,
        PaymentVerified=10,
        PaymentFailed=11
    }
}
