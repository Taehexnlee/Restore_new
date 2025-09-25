namespace API.Entities.OrderAggregate;

public class OrderItem
{
    public int Id { get; set; }

    // Snapshot of the product information (owned type)
    public ProductItemOrdered ItemOrdered { get; set; } = new();

    // Price stored in cents (long recommended)
    public long Price { get; set; }

    public int Quantity { get; set; }
}
