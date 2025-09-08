using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate;

[Owned] // Order 내부에 인라인으로 저장
public class PaymentSummary
{
    /// <summary>카드 마지막 4자리</summary>
    public int Last4 { get; set; }

    /// <summary>브랜드 (e.g. VISA, MASTERCARD)</summary>
    public string Brand { get; set; } = string.Empty;
    [JsonPropertyName("exp_month")]
    public int ExpMonth { get; set; }
    [JsonPropertyName("exp_year")]
    public int ExpYear { get; set; }
}