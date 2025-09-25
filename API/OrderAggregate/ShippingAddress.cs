using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // EF Core owned type
public class ShippingAddress
{
    public string Name { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; } // Optional
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;

    [JsonPropertyName("postal_code")]
    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;
}
