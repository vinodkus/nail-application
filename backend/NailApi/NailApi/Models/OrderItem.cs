using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NailApi.Models
{
    public class OrderItem
    {
        [Key]

        public int OrderItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        //[JsonIgnore]
        public Order? Order { get; set; }
        public string NailSize { get; set; } = "";

    }
}
