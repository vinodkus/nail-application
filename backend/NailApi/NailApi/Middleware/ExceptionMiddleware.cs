using System.Net;

namespace NailApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IWebHostEnvironment env)
        {
            _next= next;
            _logger=logger;
            _env= env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the request.");

                var logPath = Path.Combine(_env.ContentRootPath, "logs");
                if (!Directory.Exists(logPath))
                    Directory.CreateDirectory(logPath);

                // Test file to confirm logging works
                // File.WriteAllText(Path.Combine(logPath, "test.txt"), "Middleware caught an exception.");

                // Append actual error
                string errorFile = Path.Combine(logPath, "error.txt");
                await File.AppendAllTextAsync(errorFile, $"{DateTime.Now}: {ex.Message}{Environment.NewLine}{ex.StackTrace}{Environment.NewLine}");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var response = new
                {
                    StatusCode = 500,
                    Message = ex.Message,
                    Error = _env.IsDevelopment() ? ex.Message : null
                };

                await context.Response.WriteAsJsonAsync(response);
            }
        }

    }
}
