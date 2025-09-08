using System;
using System.Collections.Generic;

namespace API.Entities.OrderAggregate;

public class Order
{
    public int Id { get; set; }

    /// <summary>구매자 식별(이메일 등)</summary>
    public string BuyerEmail { get; set; } = string.Empty;

    /// <summary>배송지 (Owned, Orders 테이블에 인라인 컬럼)</summary>
    public ShippingAddress ShippingAddress { get; set; } = new();

    /// <summary>주문 생성 시간(UTC)</summary>
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    /// <summary>주문 상품들</summary>
    public List<OrderItem> OrderItems { get; set; } = new();

    /// <summary>소계(센트 단위)</summary>
    public long Subtotal { get; set; }

    /// <summary>배송비(센트 단위)</summary>
    public long DeliveryFee { get; set; }

    /// <summary>할인(센트 단위) — 추후 쿠폰 등 확장 대비</summary>
    public long Discount { get; set; }

    /// <summary>Stripe PaymentIntent Id — 방어적으로 optional</summary>
    public string? PaymentIntentId { get; set; }

    /// <summary>주문 상태</summary>
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

    /// <summary>결제 요약(브랜드/만료/마지막4자리) — Owned</summary>
    public PaymentSummary PaymentSummary { get; set; } = new();

    /// <summary>총액(센트): 소계 + 배송비 - 할인</summary>
    public long GetTotal() => Subtotal + DeliveryFee - Discount;
}