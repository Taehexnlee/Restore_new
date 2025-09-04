using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
    // Basket 엔티티를 BasketDto로 변환
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            Id = basket.Id,               // 필요 없다면 DTO에서 제거해도 됨
            BasketId = basket.BasketId,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                Name      = i.Product.Name,
                Price     = i.Product.Price,
                PictureUrl= i.Product.PictureUrl,
                Brand     = i.Product.Brand,
                Type      = i.Product.Type,
                Quantity  = i.Quantity
            }).ToList()
        };
    }
}