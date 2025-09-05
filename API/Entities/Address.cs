// API/Entities/Address.cs
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Address
    {
        [JsonIgnore]                // 응답 JSON에는 ID 숨김
        public int Id { get; set; }

        public required string Name { get; set; }
        public required string Line1 { get; set; }
        public string?  Line2 { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }

        // Stripe 포맷과 맞추기: postal_code
        [JsonPropertyName("postal_code")]
        public required string PostalCode { get; set; }

        public required string Country { get; set; }
    }
}