using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; } = null!;
        public ShippingAddress ShippingAddress { get; set; } = null!;
        public DateTime OrderDate { get; set; }

        public List<OrderItemDto> OrderItems { get; set; } = new();

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public long Discount { get; set; }
        public long Total { get; set; }      // Subtotal + DeliveryFee - Discount

        public string OrderStatus { get; set; } = null!;  // Serialize enum as string
        public PaymentSummary PaymentSummary { get; set; } = null!;
    }
}
