using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

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
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            Items = basket.Items.Select(i => new BasketItemDto
            {
                ProductId = i.ProductId,
                Name = i.Product.Name,
                Price = i.Product.Price,
                PictureUrl = i.Product.PictureUrl,
                Brand = i.Product.Brand,
                Type = i.Product.Type,
                Quantity = i.Quantity
            }).ToList()
        };
    }
    
    public static async Task<Basket> GetBasketWithItems(this IQueryable<Basket> query, string? basketId)
    {
        return await query
            .Include(x => x.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BasketId == basketId)
                ?? throw new Exception("Problem retrieving basket");
    }
   
}