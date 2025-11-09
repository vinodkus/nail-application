namespace NailApi.DtoResponse
{
    public class ForgotPasswordResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public string ResetToken { get; set; } = ""; // Optional: if you want to return token immediately
    }
}
