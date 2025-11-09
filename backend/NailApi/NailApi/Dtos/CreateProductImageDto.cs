namespace NailApi.Dtos
{
    public class CreateProductImageDto
    {
        public int ProductId { get; set; }
        public IFormFile? Image { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
