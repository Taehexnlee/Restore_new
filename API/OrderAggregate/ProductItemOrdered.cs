using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // OrderItem 내부에 인라인으로 저장
public class ProductItemOrdered
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;
}