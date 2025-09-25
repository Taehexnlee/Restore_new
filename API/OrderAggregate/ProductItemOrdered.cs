using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // Stored inline within OrderItem
public class ProductItemOrdered
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;
}
