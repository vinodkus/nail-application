using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailApi.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; } = null!;

        [StringLength(100)]
        public string? TransactionId { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PaidAmount { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = "UPI"; // UPI, COD, BANK_TRANSFER

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "pending_verification"; // pending_verification, verified, rejected

        [StringLength(500)]
        public string? ScreenshotUrl { get; set; }

        [StringLength(1000)]
        public string? CustomerNotes { get; set; }

        [StringLength(1000)]
        public string? AdminNotes { get; set; }

        public int? VerifiedBy { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
