// API/Entities/BasketItem.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

// ✅ 테이블명 복수형으로 강제
[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    // Product(1) : BasketItem(1) 관계
    public int ProductId { get; set; }
    public required Product Product { get; set; }

    // Basket(1) : BasketItem(N) 관계 → FK not null + cascade 원함
    public int BasketId { get; set; }

    // ⚠️ 여기서는 required 대신 null 허용 + null 무시 연산자 사용(마이그레이션 생성 시 요구사항 때문)
    public Basket Basket { get; set; } = null!;
}