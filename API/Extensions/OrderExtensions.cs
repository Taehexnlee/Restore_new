using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        /// <summary>
        /// Project orders to DTOs at query time, selecting only the required fields
        /// and applying AsNoTracking to avoid owned-entity tracking warnings.
        /// </summary>
        public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query)
        {
            return query
                .AsNoTracking()
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    BuyerEmail = o.BuyerEmail,
                    ShippingAddress = o.ShippingAddress,
                    OrderDate = o.OrderDate,

                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ItemOrdered.ProductId,
                        Name = oi.ItemOrdered.Name,
                        PictureUrl = oi.ItemOrdered.PictureUrl,
                        Price = oi.Price,
                        Quantity = oi.Quantity
                    }).ToList(),

                    Subtotal = o.Subtotal,
                    DeliveryFee = o.DeliveryFee,
                    Discount = o.Discount,
                    Total = o.Subtotal + o.DeliveryFee - o.Discount,

                    OrderStatus = o.OrderStatus.ToString(),
                    PaymentSummary = o.PaymentSummary
                });
        }

        /// <summary>
        /// Convert a loaded Order entity into its DTO representation.
        /// </summary>
        public static OrderDto ToDto(this Order o)
        {
            return new OrderDto
            {
                Id = o.Id,
                BuyerEmail = o.BuyerEmail,
                ShippingAddress = o.ShippingAddress,
                OrderDate = o.OrderDate,

                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ItemOrdered.ProductId,
                    Name = oi.ItemOrdered.Name,
                    PictureUrl = oi.ItemOrdered.PictureUrl,
                    Price = oi.Price,
                    Quantity = oi.Quantity
                }).ToList(),

                Subtotal = o.Subtotal,
                DeliveryFee = o.DeliveryFee,
                Discount = o.Discount,
                Total = o.GetTotal(),

                OrderStatus = o.OrderStatus.ToString(),
                PaymentSummary = o.PaymentSummary
            };
        }
    }
}
