using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public ShippingAddress ShippingAddress { get; set; } = null!;
        public PaymentSummary PaymentSummary { get; set; } = null!;
    }
}