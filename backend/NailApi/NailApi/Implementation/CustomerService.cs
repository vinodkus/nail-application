using Microsoft.EntityFrameworkCore;
using NailApi.Data;
using NailApi.Interface;
using NailApi.Models;

namespace NailApi.Implementation
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Customer> GetCustomerByEmailAsync(string email)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email.ToLower());
        }

        public async Task SavePasswordResetTokenAsync(int customerId, string resetToken, DateTime expiry)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer != null)
            {
                customer.ResetPasswordToken = resetToken;
                customer.ResetPasswordExpiry = expiry;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ValidateResetTokenAsync(string email, string token)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email.ToLower() &&
                                     c.ResetPasswordToken == token &&
                                     c.ResetPasswordExpiry > DateTime.UtcNow);

            return customer != null;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email.ToLower() &&
                                     c.ResetPasswordToken == token &&
                                     c.ResetPasswordExpiry > DateTime.UtcNow);

            if (customer != null)
            {
                customer.PasswordHash = HashPassword(newPassword);
                customer.ResetPasswordToken = null;
                customer.ResetPasswordExpiry = null;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        private string HashPassword(string password)
        {
            // Use the same hashing method you use during registration
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
