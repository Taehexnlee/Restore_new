using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class BasketExtensions
{
    // Convert a Basket entity into a BasketDto
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            Id = basket.Id,               // Retain for parity; remove if unused
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
