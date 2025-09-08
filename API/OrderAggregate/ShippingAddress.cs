using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // EF Core Owned 타입
public class ShippingAddress
{
    public string Name { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; } // 선택값
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;

    [JsonPropertyName("postal_code")]
    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;
}