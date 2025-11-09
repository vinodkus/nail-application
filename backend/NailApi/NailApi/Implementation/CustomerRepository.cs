using NailApi.Data;
using NailApi.Interface;
using NailApi.Models;
using Microsoft.EntityFrameworkCore;
using NailApi.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using NailApi.DtoResponse;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;

namespace NailApi.Implementation
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;
        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Customers.AnyAsync(c => c.Email == email);
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            return await _context.Customers.FirstOrDefaultAsync(c=>c.Email == email);
        }

        public async Task RegisterCustomerAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
        }
        

        public async Task<List<OrderResponse>> GetOrderDetails(int orderId)
        //public async Task<ActionResult<List<OrderResponse>>> GetOrderDetails(int orderId)
        {
            var result = await _context.Orders
                        .Where(ord => ord.OrderId == orderId)
                        .Join(_context.OrderItems, ord => ord.OrderId, itm => itm.OrderId, (ord, itm) => new { ord, itm })
                        .Join(_context.Products, tmp => tmp.itm.ProductId, prd => prd.ProductId, (temp, prd) => new OrderResponse
                        {
                            OrderItemId = temp.itm.OrderItemId,
                            ProductName = prd.ProductName,
                            ProductPrice = prd.ProductPrice,
                            Quantity = temp.itm.Quantity,
                            ProductImage = prd.ProductImageUrl ?? "", // Assuming ProductImage is a string in Product
                            TotalAmount = temp.ord.TotalAmount
                        }).ToListAsync();


            
            return result;
        }
        public async Task<List<OrderDetailDto>> GetCustomerAllOrdersAsync(int customerId)
        {
            var orderDetails = await (from ord in _context.Orders
                                      where ord.CustomerId == customerId
                                      orderby ord.OrderId descending
                                      select new OrderDetailDto
                                      {
                                          OrderId = ord.OrderId,
                                          OrderNumber = ord.OrderNo ?? $"ORD-BKP-{ord.OrderId}",
                                          OrderDate = ord.OrderDate,
                                          //Status = ord.Status.ToString(),
                                          Status=(int)ord.Status,
                                          TotalAmount = ord.TotalAmount,
                                          TotalItems = ord.OrderItems.Sum(oi => oi.Quantity),
                                          Items = (from ordItem in ord.OrderItems
                                                   join prd in _context.Products on ordItem.ProductId equals prd.ProductId
                                                   select new OrderItemDetailDto
                                                   {
                                                       OrderItemId = ordItem.OrderItemId,
                                                       NailSize= ordItem.NailSize,
                                                       ProductId = prd.ProductId,
                                                       ProductName = prd.ProductName,
                                                       ProductImageUrl = string.IsNullOrEmpty(prd.ProductImageUrl)
                                                                       ? "https://via.placeholder.com/80"
                                                                       : prd.ProductImageUrl,
                                                       ProductPrice = prd.ProductPrice,
                                                       Quantity = ordItem.Quantity,
                                                       ProductDescription = string.IsNullOrEmpty(prd.ProductShortName)
                                                                          ? prd.ProductDescription
                                                                          : prd.ProductShortName
                                                   }).ToList()
                                      }).ToListAsync();
            return orderDetails;
        }

        public async Task<OrderConfirmationDto> GetOrderConfirmationAsync(int orderId)
        {
            var orderConfirmation = await (from ord in _context.Orders
                                           where ord.OrderId == orderId
                                           select new OrderConfirmationDto
                                           {
                                               OrderId = ord.OrderId,
                                               OrderNumber = "ORD-" + ord.OrderId,
                                               OrderDate = ord.OrderDate,
                                               Status =(int)ord.Status,
                                               CustomerName = ord.CustomerName,
                                               CustomerEmail = ord.CustomerEmail,
                                               ShippingAddress = ord.Address,
                                               PhoneNumber = ord.PhoneNumber,
                                               TotalAmount = ord.TotalAmount,
                                               Items = (from ordItem in ord.OrderItems
                                                        join prd in _context.Products on ordItem.ProductId equals prd.ProductId
                                                        select new OrderItemConfirmationDto
                                                        {
                                                            OrderItemId = ordItem.OrderItemId,
                                                            ProductId = prd.ProductId,
                                                            ProductName = prd.ProductName,
                                                            ProductImageUrl = prd.ProductImageUrl,
                                                            ProductPrice = prd.ProductPrice,
                                                            Quantity = ordItem.Quantity,
                                                            ProductDescription = prd.ProductShortName,
                                                            ProductSku = prd.ProductSku,
                                                            DeliveryTimeSpan = prd.DeliveryTimeSpan
                                                        }).ToList()
                                           }).FirstOrDefaultAsync();

            return orderConfirmation;
        }

        
    }
}
