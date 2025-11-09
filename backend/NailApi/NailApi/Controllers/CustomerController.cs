using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using NailApi.DtoResponse;
using NailApi.Dtos;
using NailApi.Interface;
using NailApi.Models;
using NailApi.Services;
using System.Security.Cryptography;
using ForgotPasswordRequest = NailApi.Dtos.ForgotPasswordRequest;
using ResetPasswordRequest = NailApi.Dtos.ResetPasswordRequest;

namespace NailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly AuthService _authService;
        private readonly ICustomerService _customerService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public CustomerController(ICustomerRepository customerRepository, AuthService authService, ICustomerService customerService, IEmailService emailService, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _authService = authService;
            _customerService = customerService;
            _emailService = emailService;
            _configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(CustomerRegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            if (await _customerRepository.EmailExistsAsync(dto.Email))
            {
                return BadRequest("Email already registered");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var customer = new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = hashedPassword
            };

            await _customerRepository.RegisterCustomerAsync(customer);

            //return Ok("Registration successful");
            return Ok(new { result = true, message = "Registration successful" });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(CustomerLoginDto dto)
        {
            var customer = await _customerRepository.GetCustomerByEmailAsync(dto.Email);
            if (customer == null)
                return BadRequest(new {message = "Invalid email or password" });

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, customer.PasswordHash);
            if (!isPasswordValid)
                return BadRequest(new { message = "Invalid email or password"});

            var token = await _authService.AuthenticateCustomer(dto.Email, dto.Password);

            return Ok(new { token,id=customer.Id.ToString(), name=customer.FullName, email=customer.Email});
        }

        [HttpGet("GetCustomerAllOrders/{customerId}")]
        public async Task<IActionResult> GetCustomerAllOrders(int customerId)
        {
            try
            {
                var orders = await _customerRepository.GetCustomerAllOrdersAsync(customerId);
                if (orders == null || !orders.Any())
                {
                    return NotFound("No orders found for this customer.");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Log the error here if needed
                return StatusCode(500, ex.Message); // 👈 sends message to frontend
            }
        }
        //[HttpGet("order-details/{orderId}")]
        //public async Task<IActionResult> GetOrderDetails(int orderId)
        //{
        //    try
        //    {
        //        var orderItems = await _customerRepository.GetOrderDetails(orderId);
        //        if (orderItems == null || !orderItems.Any())
        //        {
        //            return NotFound("No order items found for this order.");
        //        }

        //        return Ok(orderItems);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the error here if needed
        //        return StatusCode(500, ex.Message); // 👈 sends message to frontend
        //    }
        //}

        [HttpGet("GetOrderConfirmation/{orderId}")]
        public async Task<ActionResult<OrderConfirmationDto>> GetOrderConfirmation(int orderId)
        {
            try
            {
                var orderConfirmation = await _customerRepository.GetOrderConfirmationAsync(orderId);// GetOrderConfirmationAsync(orderId);

                if (orderConfirmation == null)
                {
                    return NotFound($"Order with ID {orderId} not found.");
                }

                return Ok(orderConfirmation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ForgotPasswordResponse
                    {
                        Success = false,
                        Message = "Invalid email format"
                    });
                }

                // Find customer by email
                var customer = await _customerService.GetCustomerByEmailAsync(request.Email);
                if (customer == null)
                {
                    // For security reasons, don't reveal if email exists or not
                    return Ok(new ForgotPasswordResponse
                    {
                        Success = true,
                        Message = "If your email is registered, you will receive a password reset link shortly."
                    });
                }

                // Generate password reset token
                var resetToken = GenerateResetToken();

                // Set token expiration (e.g., 1 hour)
                var tokenExpiry = DateTime.UtcNow.AddHours(1);

                // Save token to database
                await _customerService.SavePasswordResetTokenAsync(customer.Id, resetToken, tokenExpiry);

                // Generate reset link
                var resetLink = $"{_configuration["FrontendUrl"]}/reset-password?token={resetToken}&email={request.Email}";

                // Send email
                await SendPasswordResetEmail(customer.Email, customer.FullName, resetLink);

                return Ok(new ForgotPasswordResponse
                {
                    Success = true,
                    Message = "If your email is registered, you will receive a password reset link shortly.",
                    ResetToken = resetToken // Only for development, remove in production
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Forgot password error: {ex.Message}");

                return StatusCode(500, new ForgotPasswordResponse
                {
                    Success = false,
                    //Message = "An error occurred while processing your request. Please try again."
                    Message = "Error:- "+ex.Message.ToString()

                });
            }
        }

        private string GenerateResetToken()
        {
            // Generate a secure random token
            var tokenBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            return Convert.ToBase64String(tokenBytes)
                          .Replace('+', '-')
                          .Replace('/', '_')
                          .Replace("=", "");
        }

        private async Task SendPasswordResetEmail(string email, string name, string resetLink)
        {
            var subject = "Password Reset Request";
            var body = $@"
            <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Hello {name},</p>
                <p>You have requested to reset your password. Click the link below to reset your password:</p>
                <p><a href='{resetLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
                <br/>
                <p>Best regards,<br/>Your Application Team</p>
            </body>
            </html>";

            await _emailService.SendEmailAsync(email, subject, body);
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Success = false, Message = "Invalid request" });
                }

                // Validate token and reset password
                var result = 
                    await _customerService.ResetPasswordAsync(
                    request.Email,
                    request.Token,
                    request.NewPassword
                );

                if (result)
                {
                    return Ok(new { Success = true, Message = "Password has been reset successfully" });
                }
                else
                {
                    return BadRequest(new { Success = false, Message = "Invalid or expired reset token" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred while resetting password" });
            }
        }
    }
}
