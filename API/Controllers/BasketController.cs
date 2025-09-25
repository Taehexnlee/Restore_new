// Controllers/BasketController.cs
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseApiController
{
    private const string BasketCookieName = "basketId";

    // GET /api/basket — look up basket using the basketId cookie
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();
        if (basket == null) return NoContent(); // No basket is not considered an error
        return basket.ToDto();
    }

    // POST /api/basket?productId=123&quantity=2 — add an item to the basket
    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        // 1) Retrieve current basket or create a new one
        var basket = await RetrieveBasket() ?? CreateBasket();

        // 2) Fetch the product (FindAsync for primary key lookups)
        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return BadRequest("Problem adding item to basket");

        // 3) Add the item through the entity helper
        basket.AddItem(product, quantity);

        // 4) Persist changes
        var result = await context.SaveChangesAsync() > 0;
        if (result) return CreatedAtAction(nameof(GetBasket), null, basket.ToDto());

        // 5) If persistence fails, surface an error
        return BadRequest("Problem adding item to basket");
    }

    // DELETE /api/basket?productId=123&quantity=1 — remove item quantity
    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasket();
        if (basket == null) return NotFound();
        basket.RemoveItem(productId, quantity);
        var result = await context.SaveChangesAsync() > 0;
        if (result) return Ok();
        return BadRequest("Problem removing item from the basket");
        
    }

    // ===== Helpers =====

    // Load basket using the cookie value, eager-loading items and products
    private async Task<Basket?> RetrieveBasket()
    {
        var basketId = Request.Cookies[BasketCookieName];

        return await context.Baskets
            .Include(x => x.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BasketId == basketId);
    }

    // Create a new basket and issue a cookie
    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true,                 // Required for the app to function
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append(BasketCookieName, basketId, cookieOptions);

        var basket = new Basket { BasketId = basketId };

        // Begin tracking with EF Core; save happens later
        context.Baskets.Add(basket);

        return basket;
    }
}
