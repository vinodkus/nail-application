namespace NailApi.Dtos
{
    public class CustomerRegisterDto
    {
        public string FullName { get; set; }=string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
