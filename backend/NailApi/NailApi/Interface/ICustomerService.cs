using NailApi.Models;

namespace NailApi.Interface
{
    public interface ICustomerService
    {
        Task<Customer> GetCustomerByEmailAsync(string email);
        Task SavePasswordResetTokenAsync(int customerId, string resetToken, DateTime expiry);
        Task<bool> ValidateResetTokenAsync(string email, string token);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
