namespace API.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = null!;
        public string PictureUrl { get; set; } = null!;
        public long Price { get; set; }      // cents
        public int Quantity { get; set; }
    }
}