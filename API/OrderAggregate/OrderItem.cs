namespace API.Entities.OrderAggregate;

public class OrderItem
{
    public int Id { get; set; }

    // 스냅샷 형태의 상품 정보 (Owned)
    public ProductItemOrdered ItemOrdered { get; set; } = new();

    // 가격(센트 단위: long 권장)
    public long Price { get; set; }

    public int Quantity { get; set; }
}