// API/Entities/BasketItem.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

// Use explicit plural table naming
[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    // Relationship: Product(1) to BasketItem(1)
    public int ProductId { get; set; }
    public required Product Product { get; set; }

    // Relationship: Basket(1) to BasketItem(N) with cascade delete
    public int BasketId { get; set; }

    // Allow null-forgiving navigation to satisfy EF Core during migrations
    public Basket Basket { get; set; } = null!;
}
