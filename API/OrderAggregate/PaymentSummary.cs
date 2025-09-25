using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // Stored inline within the Order entity
public class PaymentSummary
{
    /// <summary>Last four digits of the card</summary>
    public int Last4 { get; set; }

    /// <summary>Card brand (e.g. VISA, MASTERCARD)</summary>
    public string Brand { get; set; } = string.Empty;
    [JsonPropertyName("exp_month")]
    public int ExpMonth { get; set; }
    [JsonPropertyName("exp_year")]
    public int ExpYear { get; set; }
}
