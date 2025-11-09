using Microsoft.EntityFrameworkCore;
using NailApi.Data;
using NailApi.Dtos;
using NailApi.Interface;
using NailApi.Models;

namespace NailApi.Implementation
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentService> _logger;
        private readonly IWebHostEnvironment _environment;
        public PaymentService(ApplicationDbContext context, ILogger<PaymentService> logger, IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }
        public async Task<PaymentResponse> SubmitPaymentAsync(PaymentRequest request)
        {
            try
            {
                // Validate order exists
                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.OrderId == request.OrderId);

                if (order == null)
                {
                    return new PaymentResponse
                    {
                        Status = "error",
                        Message = "Order not found"
                    };
                }

                // Check for duplicate transaction ID
                if (!string.IsNullOrEmpty(request.TransactionId) &&
                    await CheckDuplicateTransactionAsync(request.TransactionId))
                {
                    return new PaymentResponse
                    {
                        Status = "error",
                        Message = "Transaction ID already exists"
                    };
                }

                // Validate payment amount (for non-COD payments)
                if (request.PaymentMethod != "COD" &&
                    !await ValidatePaymentAmountAsync(request.OrderId, request.PaidAmount))
                {
                    return new PaymentResponse
                    {
                        Status = "error",
                        Message = "Payment amount does not match order total"
                    };
                }

                // Create payment record
                var payment = new Payment
                {
                    OrderId = request.OrderId,
                    TransactionId = request.TransactionId,
                    PaymentDate = request.PaymentDate,
                    PaidAmount = request.PaidAmount,
                    PaymentMethod = request.PaymentMethod,
                    Status = request.Status,
                    ScreenshotUrl = request.ScreenshotUrl,
                    CustomerNotes = request.CustomerNotes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                // Update order status based on payment method
                if (request.PaymentMethod == "COD")
                {
                    await UpdateOrderStatusAsync(request.OrderId, OrderStatus.PaymentVerified);
                }
                else
                {
                    await UpdateOrderStatusAsync(request.OrderId, OrderStatus.PaymentPendingVerification);
                }

                _logger.LogInformation($"Payment submitted for Order {request.OrderId}, Payment ID: {payment.PaymentId}");

                return new PaymentResponse
                {
                    PaymentId = payment.PaymentId,
                    Status = "success",
                    Message = "Payment details submitted successfully",
                    OrderNumber = "ORD-" + request.OrderId,
                    CreatedAt = payment.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting payment for Order {request.OrderId}");
                return new PaymentResponse
                {
                    Status = "error",
                    Message = "Error submitting payment details"
                };
            }
        }

        public async Task<bool> CheckDuplicateTransactionAsync(string transactionId)
        {
            try
            {
                if (string.IsNullOrEmpty(transactionId))
                    return false;

                return await _context.Payments
                    .AnyAsync(p => p.TransactionId == transactionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking duplicate transaction: {transactionId}");
                return true; // Return true to prevent potential duplicates
            }
        }
        public async Task<UpdatePaymentResponse> UpdateOrderPaymentAsync(int orderId, UpdateOrderPaymentRequest request)
        {
            try
            {
                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    return new UpdatePaymentResponse
                    {
                        Success = false,
                        Message = "Order not found"
                    };
                }

                // For COD, directly confirm the order
                if (request.PaymentMethod == "COD")
                {
                    order.Status = OrderStatus.PaymentVerified;

                    // Create a payment record for COD
                    var codPayment = new Payment
                    {
                        OrderId = orderId,
                        PaymentMethod = "COD",
                        PaidAmount = order.TotalAmount,
                        Status = "confirmed",
                        PaymentDate = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Payments.Add(codPayment);
                }

                await _context.SaveChangesAsync();

                return new UpdatePaymentResponse
                {
                    Success = true,
                    Message = "Payment method updated successfully",
                    OrderStatus = order.Status.ToString()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating payment method for Order {orderId}");
                return new UpdatePaymentResponse
                {
                    Success = false,
                    Message = "Error updating payment method"
                };
            }
        }
        public async Task<bool> ValidatePaymentAmountAsync(int orderId, decimal paidAmount)
        {
            try
            {
                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null) return false;

                // Allow small difference for rounding (₹1)
                return Math.Abs(order.TotalAmount - paidAmount) <= 1;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error validating payment amount for Order {orderId}");
                return false;
            }
        }
        public async Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            try
            {
                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null) return false;

                order.Status = status;
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating order status for Order {orderId}");
                return false;
            }
        }
        public async Task<string> UploadScreenshotAsync(IFormFile file, int orderId)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("No file uploaded");

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                    throw new ArgumentException("Invalid file type. Only JPG, JPEG, PNG, GIF are allowed.");

                // Validate file size (5MB max)
                if (file.Length > 5 * 1024 * 1024)
                    throw new ArgumentException("File size should be less than 5MB");

                // Create uploads directory if not exists
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "payments");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Generate unique filename
                var fileName = $"payment_{orderId}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return relative URL
                return $"/uploads/payments/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading screenshot for Order {orderId}");
                throw;
            }
        }
        public async Task<PaymentStatusDto> GetPaymentStatusAsync(int orderId)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Order)
                    .Where(p => p.OrderId == orderId)
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefaultAsync();

                if (payment == null)
                {
                    // Return default status if no payment record
                    return new PaymentStatusDto
                    {
                        OrderId = orderId,
                        OrderNumber = "ORD-" + orderId,
                        PaymentStatus = "not_submitted",
                        PaymentMethod = "",
                        PaidAmount = 0,
                        IsVerified = false
                    };
                }

                return new PaymentStatusDto
                {
                    OrderId = orderId,
                    OrderNumber = "ORD-" + orderId,
                    PaymentStatus = payment.Status,
                    PaymentMethod = payment.PaymentMethod,
                    PaidAmount = payment.PaidAmount,
                    PaymentDate = payment.PaymentDate,
                    TransactionId = payment.TransactionId,
                    IsVerified = payment.Status == "verified"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting payment status for Order {orderId}");
                throw;
            }
        }
    }
}
