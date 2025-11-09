using Microsoft.AspNetCore.Mvc;
using NailApi.DtoResponse;
using NailApi.Dtos;
using NailApi.Models;

namespace NailApi.Interface
{
    public interface ICustomerRepository
    {
        Task<bool> EmailExistsAsync(string email);
        Task RegisterCustomerAsync(Customer customer);
        Task<Customer?> GetCustomerByEmailAsync(string email);
        Task<List<OrderDetailDto>> GetCustomerAllOrdersAsync(int customerId);
        Task<OrderConfirmationDto> GetOrderConfirmationAsync(int orderId);
        Task<List<OrderResponse>> GetOrderDetails(int orderId);

    }
}
