namespace API.DTOs;

public class BasketItemDto
{
    public int ProductId { get; set; }              // Product identifier for this basket item
    public required string Name { get; set; }
    public long Price { get; set; }                 // Price stored in integral minor units (e.g. cents)
    public required string PictureUrl { get; set; } 
    public required string Brand { get; set; }
    public required string Type { get; set; }
    public int Quantity { get; set; }
}
