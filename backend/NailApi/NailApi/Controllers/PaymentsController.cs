using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailApi.Interface;

namespace NailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }
        [HttpPost("SubmitPayment")]
        public async Task<ActionResult<PaymentResponse>> SubmitPayment([FromBody] PaymentRequest request)
        {
            try
            {
                var result = await _paymentService.SubmitPaymentAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment submission failed", error = ex.Message });
            }
        }
        [HttpPost("UploadScreenshot")]
        public async Task<ActionResult> UploadPaymentScreenshot(IFormFile file, int orderId)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var result = await _paymentService.UploadScreenshotAsync(file, orderId);
                return Ok(new { message = "Screenshot uploaded successfully", fileUrl = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "File upload failed", error = ex.Message });
            }
        }

        [HttpGet("Order/{orderId}/Status")]
        public async Task<ActionResult<PaymentStatusDto>> GetPaymentStatus(int orderId)
        {
            try
            {
                var status = await _paymentService.GetPaymentStatusAsync(orderId);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching payment status", error = ex.Message });
            }
        }
    }
}
