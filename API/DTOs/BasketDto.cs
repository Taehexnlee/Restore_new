namespace API.DTOs;

public class BasketDto
{
    public int Id { get; set; }                 // 필요 없으면 제거 가능(강의에선 없어도 무방)
    public string BasketId { get; set; } = string.Empty;
    public List<BasketItemDto> Items { get; set; } = new();
}
