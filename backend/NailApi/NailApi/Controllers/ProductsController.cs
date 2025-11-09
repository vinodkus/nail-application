using NailApi.Data;
using NailApi.Dtos;
using NailApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.EntityFrameworkCore;
using NailApi.DtoResponse;


namespace NailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        IConfiguration _configuration;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(ApplicationDbContext context, IWebHostEnvironment environment, IConfiguration configuration, ILogger<ProductsController> logger)
        {
            _context = context;
            _environment = environment;
            _configuration = configuration;
            _logger = logger;
        }
        
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> PostProduct([FromForm] ProductDto dto)
        {
            try
            {
                string? fileName = null;
                if (dto.Image != null)
                {
                    string folderPath;
                    if (_environment.IsDevelopment())
                    {
                        folderPath = Path.Combine(_environment.WebRootPath, "products");
                    }
                    else
                    {
                        var configuredPath = _configuration["FileStorage:ProductsPath"];
                        if (string.IsNullOrEmpty(configuredPath))
                        {
                            return BadRequest("File storage path is not configured.");
                        }
                        folderPath = configuredPath;
                    }

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                    var filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.Image.CopyToAsync(stream);
                    }
                }

                var product = new Product
                {
                    ProductSku = dto.ProductSku,
                    ProductName = dto.ProductName,
                    ProductPrice = dto.ProductPrice,
                    ProductShortName = dto.ProductShortName,
                    ProductDescription = dto.ProductDescription,
                    DeliveryTimeSpan = dto.DeliveryTimeSpan,
                    CategoryId = dto.CategoryId,
                    CreatedDate = DateTime.Now,
                    ProductImageUrl = fileName ?? ""
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, Message = "Product added successfully!" });
            }
            catch (Exception ex)
            {
                // ✅ Log the error
                _logger.LogError(ex, "Error while adding product: {Message}", ex.Message);

                // Optional: also write to a fallback text file if logging doesn't work
                try
                {
                    var logPath = Path.Combine(_environment.ContentRootPath, "logs");
                    if (!Directory.Exists(logPath))
                        Directory.CreateDirectory(logPath);

                    await System.IO.File.AppendAllTextAsync(
                        Path.Combine(logPath, "error.txt"),
                        $"{DateTime.Now}: {ex.Message}{Environment.NewLine}{ex.StackTrace}{Environment.NewLine}"
                    );
                }
                catch { /* swallow file logging errors */ }

                return StatusCode(500, new { success = false, message = "An error occurred while adding the product." });
            }
        }

        [HttpPost("AddProductImage")]
        public async Task<IActionResult> AddProductImage([FromForm] CreateProductImageDto dto)
        {
            try
            {
                // Check if product exists
                var product = await _context.Products.FindAsync(dto.ProductId);
                if (product == null)
                    return NotFound(new { success = false, message = "Product not found." });

                if (dto.Image == null || dto.Image.Length == 0)
                    return BadRequest(new { success = false, message = "No image file provided." });

                string fileName = await SaveImageFile(dto.Image);
                if (string.IsNullOrEmpty(fileName))
                    return BadRequest(new { success = false, message = "Failed to save image." });

                var productImage = new ProductImage
                {
                    ProductId = dto.ProductId,
                    ImageUrl = fileName,
                    SortOrder = dto.SortOrder,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.ProductImages.Add(productImage);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Product image added successfully!", imageId = productImage.ProductImageId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding product image: {Message}", ex.Message);
                return StatusCode(500, new { success = false, message = "An error occurred while adding the product image." });
            }
        }
        private async Task<string> SaveImageFile(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return string.Empty;

            string folderPath = GetProductsFolderPath();

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return fileName;
        }
        private string GetProductsFolderPath()
        {
            if (_environment.IsDevelopment())
            {
                return Path.Combine(_environment.WebRootPath, "products");
            }
            else
            {
                var configuredPath = _configuration["FileStorage:ProductsPath"];
                if (string.IsNullOrEmpty(configuredPath))
                {
                    throw new InvalidOperationException("File storage path is not configured.");
                }
                return configuredPath;
            }
        }
        [HttpDelete("DeleteProductImage/{imageId}")]
        public async Task<IActionResult> DeleteProductImage(int imageId)
        {
            try
            {
                var productImage = await _context.ProductImages.FindAsync(imageId);
                if (productImage == null)
                    return NotFound(new { success = false, message = "Product image not found." });

                // Delete physical file
                if (!string.IsNullOrEmpty(productImage.ImageUrl))
                {
                    string folderPath = GetProductsFolderPath();
                    var filePath = Path.Combine(folderPath, productImage.ImageUrl);
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.ProductImages.Remove(productImage);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Product image deleted successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product image: {Message}", ex.Message);
                return StatusCode(500, new { success = false, message = "An error occurred while deleting the product image." });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var product = await _context.Products.Where(p => p.ProductId == id).Select(p => new ProductResponseDto
                {
                    ProductId = p.ProductId,
                    ProductSku = p.ProductSku,
                    ProductName = p.ProductName,
                    ProductPrice = p.ProductPrice,
                    ProductShortName = p.ProductShortName,
                    ProductDescription = p.ProductDescription,
                    DeliveryTimeSpan = p.DeliveryTimeSpan,
                    CategoryId = p.CategoryId,
                    ProductImageUrl = p.ProductImageUrl,
                    IsActive = p.IsActive
                }).FirstOrDefaultAsync();

                if (product == null)
                    return NotFound($"Product with ID {id} not found.");
                // Get additional images
                var additionalImages = await _context.ProductImages
                    .Where(pi => pi.ProductId == id && pi.IsActive)
                    .OrderBy(pi => pi.SortOrder)
                    .Select(pi => new ProductImageDto
                    {
                        ProductImageId = pi.ProductImageId,
                        ProductId = pi.ProductId,
                        ImageUrl = pi.ImageUrl,
                        SortOrder = pi.SortOrder,
                        IsActive = pi.IsActive
                    })
                    .ToListAsync();

                product.AdditionalImages = additionalImages;
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromForm] ProductDto dto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound($"Product with Id = {id} not found.");
            }

            // Handle Image Update
            string? fileName = existingProduct.ProductImageUrl;
            if (dto.Image != null)
            {
                string folderPath;

                if (_environment.IsDevelopment())
                {
                    folderPath = Path.Combine(_environment.WebRootPath, "products");
                }
                else
                {
                    var configuredPath = _configuration["FileStorage:ProductsPath"];
                    if (string.IsNullOrEmpty(configuredPath))
                    {
                        return BadRequest("File storage path is not configured.");
                    }
                    folderPath = configuredPath;
                }

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                // New image uploaded
                fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                // Optionally delete old image
                if (!string.IsNullOrEmpty(existingProduct.ProductImageUrl))
                {
                    var oldFilePath = Path.Combine(folderPath, existingProduct.ProductImageUrl);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }
            }

            // Update fields
            existingProduct.ProductSku = dto.ProductSku ?? existingProduct.ProductSku;
            existingProduct.ProductName = dto.ProductName ?? existingProduct.ProductName;
            existingProduct.ProductPrice = dto.ProductPrice != 0 ? dto.ProductPrice : existingProduct.ProductPrice;
            existingProduct.ProductShortName = dto.ProductShortName ?? existingProduct.ProductShortName;
            existingProduct.ProductDescription = dto.ProductDescription ?? existingProduct.ProductDescription;
            existingProduct.DeliveryTimeSpan = dto.DeliveryTimeSpan ?? existingProduct.DeliveryTimeSpan;
            existingProduct.CategoryId = dto.CategoryId != 0 ? dto.CategoryId : existingProduct.CategoryId;

            existingProduct.ProductImageUrl = fileName ?? existingProduct.ProductImageUrl;
            existingProduct.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, Message = "Product updated successfully!" });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound($"Product with Id = {id} not found.");
            }

            // Delete the associated image
            if (!string.IsNullOrEmpty(existingProduct.ProductImageUrl))
            {
                string folderPath;

                if (_environment.IsDevelopment())
                {
                    folderPath = Path.Combine(_environment.WebRootPath, "products");
                }
                else
                {
                    var configuredPath = _configuration["FileStorage:ProductsPath"];
                    if (!string.IsNullOrEmpty(configuredPath))
                    {
                        folderPath = configuredPath;
                    }
                    else
                    {
                        return BadRequest("File storage path is not configured.");
                    }
                }

                var oldFilePath = Path.Combine(folderPath, existingProduct.ProductImageUrl);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            _context.Products.Remove(existingProduct);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, Message = "Product deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }
        }
        [HttpPut("test")]
        public IActionResult TestPut()
        {
            return Ok("PUT works!");
        }
        private async Task<List<ProductResponseDto>> GetProductsFromDb(bool onlyActive)
        {
            var query = _context.Products.AsQueryable();

            if (onlyActive)
            {
                query = query.Where(p => p.IsActive);
            }

            var products = await query
                .Join(_context.Categories,
                    p => p.CategoryId,
                    c => c.CategoryId,
                    (p, c) => new
                    {
                        p.ProductId,
                        p.ProductSku,
                        p.ProductName,
                        p.ProductPrice,
                        p.ProductShortName,
                        p.ProductDescription,
                        p.DeliveryTimeSpan,
                        p.CategoryId,
                        CategoryName = c.CategoryName,
                        p.ProductImageUrl,
                        p.IsActive
                    })
                .ToListAsync();

            // Map results
            return products.Select(p => new ProductResponseDto
            {
                ProductId = p.ProductId,
                ProductSku = p.ProductSku,
                ProductName = p.ProductName,
                ProductPrice = p.ProductPrice,
                ProductShortName = p.ProductShortName,
                ProductDescription = p.ProductDescription,
                DeliveryTimeSpan = p.DeliveryTimeSpan,
                CategoryId = p.CategoryId,
                CategoryName = p.CategoryName,
                ProductImageUrl = p.ProductImageUrl,
                IsActive = p.IsActive

            }).ToList();
        }
        [HttpGet]
        [HttpGet("GetAll")]
        public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetProducts()
        {
            try
            {
                var products = await GetProductsFromDb(false);

                if (!products.Any())
                {
                    return NotFound(new ApiResponse<List<ProductResponseDto>>
                    {
                        Result = false,
                        Message = "No products found",
                        Data = null
                    });
                }

                return Ok(new ApiResponse<List<ProductResponseDto>>
                {
                    Result = true,
                    Message = "Products fetched successfully",
                    Data = products
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }
        }



        [HttpGet("GetCustomerActiveProducts")]
        public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetAllActiveProducts()
        {
            var products = await GetProductsFromDb(true);

            if (!products.Any())
            {
                return NotFound(new ApiResponse<List<ProductResponseDto>>
                {
                    Result = false,
                    Message = "No active products found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<List<ProductResponseDto>>
            {
                Result = true,
                Message = "Products fetched successfully",
                Data = products
            });
        }



        [HttpGet("GetCategories")]
        public async Task<ActionResult<ApiResponse<List<CategoryResponseDto>>>> GetCategories()
        {
            var categories = await _context.Categories
                                           .Select(c => new CategoryResponseDto
                                           {
                                               CategoryId = c.CategoryId,
                                               CategoryName = c.CategoryName
                                           }).ToListAsync();

            if (categories == null || !categories.Any())
                return Ok(new ApiResponse<List<CategoryResponseDto>>()
                {
                    Data = new List<CategoryResponseDto> { 
                        new CategoryResponseDto
                        {
                            CategoryId = -1,
                            CategoryName = "All"
                        }
                    },
                    Message = "Only default category available",
                    Result = false
                });
            categories.Add(new CategoryResponseDto() {CategoryId=-1,CategoryName="All" });
            var categoryResponse = new ApiResponse<List<CategoryResponseDto>>
            {
                Result = true,
                Message = "Categories fetched successfully",
                Data = categories
            };
            return Ok(categoryResponse);
        }
        [HttpGet("GetProductsByCatId")]
        public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetProductsByCatId(int catId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryId == catId || catId == -1)
                .Select(p => new ProductResponseDto
                {
                    ProductId = p.ProductId,
                    ProductSku = p.ProductSku,
                    ProductName = p.ProductName,
                    ProductPrice = p.ProductPrice,
                    ProductShortName = p.ProductShortName,
                    ProductDescription = p.ProductDescription,
                    DeliveryTimeSpan = p.DeliveryTimeSpan,
                    CategoryId = p.CategoryId,
                    ProductImageUrl = p.ProductImageUrl
                }).ToListAsync();

            if (products == null || !products.Any())
                return NotFound(new ApiResponse<List<ProductResponseDto>>()
                {
                    Data = null,
                    Message = "No products found for this category",
                    Result = false
                });

            var productResponse = new ApiResponse<List<ProductResponseDto>>
            {
                Result = true,
                Message = "Products fetched successfully",
                Data = products
            };
            return Ok(productResponse);
        }

        [HttpGet("GetCustomerProductsByCatId")]
        public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetCustomerProductsByCatId(int catId)
        {
            var products = await _context.Products
                .Where(p => p.IsActive && (p.CategoryId == catId || catId == -1))
                .Select(p => new ProductResponseDto
                {
                    ProductId = p.ProductId,
                    ProductSku = p.ProductSku,
                    ProductName = p.ProductName,
                    ProductPrice = p.ProductPrice,
                    ProductShortName = p.ProductShortName,
                    ProductDescription = p.ProductDescription,
                    DeliveryTimeSpan = p.DeliveryTimeSpan,
                    CategoryId = p.CategoryId,
                    ProductImageUrl = p.ProductImageUrl
                }).ToListAsync();

            if (products == null || !products.Any())
                return NotFound(new ApiResponse<List<ProductResponseDto>>()
                {
                    Data = null,
                    Message = "No products found for this category",
                    Result = false
                });

            var productResponse = new ApiResponse<List<ProductResponseDto>>
            {
                Result = true,
                Message = "Products fetched successfully",
                Data = products
            };
            return Ok(productResponse);
        }




    }
}
