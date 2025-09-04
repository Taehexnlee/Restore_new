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

    // GET /api/basket  — 쿠키의 basketId로 장바구니 조회
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();
        if (basket == null) return NoContent(); // 장바구니 없어도 에러 아님
        return basket.ToDto();
    }

    // POST /api/basket?productId=123&quantity=2 — 아이템 추가
    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        // 1) 현재 장바구니 조회(없으면 생성)
        var basket = await RetrieveBasket() ?? CreateBasket();

        // 2) 상품 조회 (PK로 조회할 땐 FindAsync 사용)
        var product = await context.Products.FindAsync(productId);
        if (product == null)
            return BadRequest("Problem adding item to basket");

        // 3) 엔티티 메서드로 장바구니에 추가
        basket.AddItem(product, quantity);

        // 4) 저장
        var result = await context.SaveChangesAsync() > 0;
        if (result) return CreatedAtAction(nameof(GetBasket), null, basket.ToDto());

        // 5) 201 Created + Location 헤더 (GET /api/basket)
        return BadRequest("Problem adding item to basket");
    }

    // DELETE /api/basket?productId=123&quantity=1 — (다음 강의에서 로직 채움)
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

    // ====== 내부 헬퍼 ======

    // 쿠키의 basketId로 장바구니 로드 (Items → Product 까지 eager loading)
    private async Task<Basket?> RetrieveBasket()
    {
        var basketId = Request.Cookies[BasketCookieName];

        return await context.Baskets
            .Include(x => x.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BasketId == basketId);
    }

    // 장바구니 새로 만들고 쿠키 발급
    private Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true,                 // 필수 쿠키
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append(BasketCookieName, basketId, cookieOptions);

        var basket = new Basket { BasketId = basketId };

        // EF가 메모리에서 추적 시작 — 실제 DB 저장은 SaveChanges 때
        context.Baskets.Add(basket);

        return basket;
    }
}