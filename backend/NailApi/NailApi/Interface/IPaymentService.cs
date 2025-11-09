using NailApi.Dtos;

namespace NailApi.Interface
{
    public interface IPaymentService
    {
        // Payment Methods
        Task<PaymentResponse> SubmitPaymentAsync(PaymentRequest request);
        Task<string> UploadScreenshotAsync(IFormFile file, int orderId);
        Task<PaymentStatusDto> GetPaymentStatusAsync(int orderId);

        // Order Payment Methods
        Task<UpdatePaymentResponse> UpdateOrderPaymentAsync(int orderId, UpdateOrderPaymentRequest request);
        Task<bool> ValidatePaymentAmountAsync(int orderId, decimal paidAmount);

        // Utility Methods
        Task<bool> CheckDuplicateTransactionAsync(string transactionId);
        Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status);
    }
    // Request and Response DTOs
    public class PaymentRequest
    {
        public int OrderId { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public decimal PaidAmount { get; set; }
        public string PaymentMethod { get; set; } = "UPI"; // UPI, COD, BANK_TRANSFER
        public string Status { get; set; } = "pending_verification";
        public string? ScreenshotUrl { get; set; }
        public string? CustomerNotes { get; set; }
    }
    public class PaymentResponse
    {
        public int PaymentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
    public class PaymentStatusDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal PaidAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? TransactionId { get; set; }
        public bool IsVerified { get; set; }
    }
    public class UpdatePaymentResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
    }
    public class UpdateOrderPaymentRequest
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = "COD";
        public string Status { get; set; } = "confirmed";
    }
}
