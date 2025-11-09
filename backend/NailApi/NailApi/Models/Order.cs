using NailApi.Dtos;
using NailApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Order
{
    [Key]
    public int OrderId { get; set; }

    public int CustomerId { get; set; } // Foreign key to Customer

    [Required]
    public string CustomerName { get; set; }

    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; }

    [Required]
    public string Address { get; set; }

    [Required]
    [Phone]
    public string PhoneNumber { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [Required]
    public DateTime OrderDate { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending; // 0: Pending, 1: Processing, 2: Completed, 3: Cancelled, 4: Shipped, 5: Delivered, 6: Returned, 7: Refunded, 8: On Hold
    public string OrderNo { get; set; } = ""; // Add this property
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); // ✅ always initialize
}
