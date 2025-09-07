using System;
using System.Linq;
using System.Collections.Generic;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }

    // 브라우저(쿠키/로컬)에 보관할 식별자
    public required string BasketId { get; set; }

    // 1:N 관계 - 장바구니의 아이템들
    public List<BasketItem> Items { get; set; } = new();
    
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
    

    /// <summary>
    /// 장바구니에 상품 추가 (기존 존재 시 수량 증가)
    /// </summary>
    public void AddItem(Product product, int quantity)
    {
        // 방어적 코드
        ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0)
            throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        // 이미 담긴 아이템인지 확인
        var existingItem = FindItem(product.Id);

        if (existingItem is null)
        {
            // 새 아이템 추가
            Items.Add(new BasketItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = quantity
            });
        }
        else
        {
            // 기존 수량 증가 (복합 대입 연산자로 간결하게)
            existingItem.Quantity += quantity;
        }
    }

    /// <summary>
    /// 장바구니에서 상품 수량 감소 / 0이하가 되면 제거
    /// </summary>
    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        var item = FindItem(productId);
        if (item is null) return; // 없으면 아무 것도 안 함

        item.Quantity -= quantity;

        // 수량이 0 이하가 되면 장바구니에서 제거
        if (item.Quantity <= 0)
            Items.Remove(item);
    }

    /// <summary>
    /// 현재 장바구니에서 특정 상품 아이템을 찾기
    /// </summary>
    private BasketItem? FindItem(int productId)
        => Items.FirstOrDefault(i => i.ProductId == productId);
}