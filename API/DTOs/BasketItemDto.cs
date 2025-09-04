namespace API.DTOs;

public class BasketItemDto
{
    public int ProductId { get; set; }              // 장바구니 아이템의 제품키
    public required string Name { get; set; }
    public long Price { get; set; }                 // 강의와 동일: 정수 가격(센트 등)
    public required string PictureUrl { get; set; } 
    public required string Brand { get; set; }
    public required string Type { get; set; }
    public int Quantity { get; set; }
}