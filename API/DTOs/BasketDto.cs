namespace API.DTOs;

public class BasketDto
{
    public int Id { get; set; }                 // Present for parity with the entity even if unused
    public string BasketId { get; set; } = string.Empty;
    public List<BasketItemDto> Items { get; set; } = new();

    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
}
