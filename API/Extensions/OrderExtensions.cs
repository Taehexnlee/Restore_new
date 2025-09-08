using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        /// <summary>
        /// 쿼리 단계에서 바로 DTO로 투영(Projection).
        /// Include 없이 DB에서 필요한 필드만 선택해 가져옵니다.
        /// Owned 엔티티 추적 경고 방지를 위해 AsNoTracking() 적용.
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
        /// 이미 로드된 Order 엔티티 1개를 DTO로 변환(생성 직후 반환용).
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