using System;
using System.Collections.Generic;

namespace API.Entities.OrderAggregate;

public class Order
{
    public int Id { get; set; }

    /// <summary>Identifier for the buyer (email)</summary>
    public string BuyerEmail { get; set; } = string.Empty;

    /// <summary>Shipping address stored inline on the Orders table</summary>
    public ShippingAddress ShippingAddress { get; set; } = new();

    /// <summary>UTC timestamp when the order was created</summary>
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    /// <summary>Collection of items included in the order</summary>
    public List<OrderItem> OrderItems { get; set; } = new();

    /// <summary>Subtotal stored in cents</summary>
    public long Subtotal { get; set; }

    /// <summary>Delivery fee stored in cents</summary>
    public long DeliveryFee { get; set; }

    /// <summary>Discount amount in cents (extensible for coupons)</summary>
    public long Discount { get; set; }

    /// <summary>Associated Stripe PaymentIntent identifier (optional)</summary>
    public string? PaymentIntentId { get; set; }

    /// <summary>Status of the order</summary>
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

    /// <summary>Snapshot of payment details (brand/expiry/last four)</summary>
    public PaymentSummary PaymentSummary { get; set; } = new();

    /// <summary>Total amount in cents (subtotal + delivery - discount)</summary>
    public long GetTotal() => Subtotal + DeliveryFee - Discount;
}
