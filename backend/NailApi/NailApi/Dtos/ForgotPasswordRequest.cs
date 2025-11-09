using System.ComponentModel.DataAnnotations;

namespace NailApi.Dtos
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";
    }
}
