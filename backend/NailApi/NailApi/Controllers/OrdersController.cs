using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailApi.Data;
using NailApi.DtoResponse;
using NailApi.Dtos;
using NailApi.Interface;
using NailApi.Models;

namespace NailApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Generate unique order number
                order.OrderNo = await GenerateOrderNumber();

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    orderId = order.OrderId,
                    orderNumber = order.OrderNo // Return order number to frontend
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        private async Task<string> GenerateOrderNumber1()
        {
            string orderNumber;
            bool isUnique = false;

            do
            {
                // Format: ORD + YYMMDD + 4 random digits
                var datePart = DateTime.Now.ToString("yyMMdd");
                var randomPart = new Random().Next(1000, 9999).ToString();
                orderNumber = $"ORD{datePart}{randomPart}";

                // Check if order number already exists
                var existingOrder = await _context.Orders
                    .FirstOrDefaultAsync(o => o.OrderNo == orderNumber);

                isUnique = existingOrder == null;

            } while (!isUnique);

            return orderNumber;
        }
        private async Task<string> GenerateOrderNumber()
        {
            // Get today's order count and increment
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var todayOrderCount = await _context.Orders
                .Where(o => o.OrderDate >= today && o.OrderDate < tomorrow)
                .CountAsync();

            var sequenceNumber = todayOrderCount + 1;

            // Format: ORD-YYMMDD-0001
            var datePart = DateTime.Now.ToString("yyMMdd");
            var sequencePart = sequenceNumber.ToString("D4"); // 4 digits with leading zeros

            return $"ORD-{datePart}-{sequencePart}";
        }
        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await (from ord in _context.Orders
                                    join cust in _context.Customers
                                    on ord.CustomerId equals cust.Id
                                    join pay in _context.Payments
                                    on ord.OrderId equals pay.OrderId
                                    orderby ord.OrderDate descending
                                    select new CustomerOrderDto
                                    {
                                        OrderId = ord.OrderId,
                                        OrderNumber=ord.OrderNo,
                                        FullName = cust.FullName,
                                        Email = cust.Email,
                                        PhoneNumber = ord.PhoneNumber,
                                        TotalAmount = ord.TotalAmount,
                                        OrderDate = ord.OrderDate,
                                        Status = ord.Status.ToString(),
                                        PaymentStatus = pay.Status, //  Include payment status
                                        TransactionId = pay.TransactionId??"",
                                        PaymentDate = pay.PaymentDate
                                    }).ToListAsync();

                if (orders == null || !orders.Any())
                {
                    return NotFound("No orders found..");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Log the error here if needed
                return StatusCode(500, ex.Message); // 👈 sends message to frontend
            }
        }

        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    return NotFound($"Order with ID {orderId} not found.");
                }

                order.Status = dto.Status;
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the error here if needed
                return StatusCode(500, ex.Message); // 👈 sends message to frontend
            }
        }

        [HttpPut("{orderId}/UpdatePayment")]
        public async Task<ActionResult> UpdateOrderPayment(int orderId, [FromBody] UpdateOrderPaymentRequest request)
        {
            try
            {
                var result = await _paymentService.UpdateOrderPaymentAsync(orderId, request);
                return Ok(new { message = "Payment method updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment update failed", error = ex.Message });
            }
        }
    }
}
