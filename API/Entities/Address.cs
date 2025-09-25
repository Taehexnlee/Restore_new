// API/Entities/Address.cs
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Address
    {
        [JsonIgnore]                // Hide ID in serialized responses
        public int Id { get; set; }

        public required string Name { get; set; }
        public required string Line1 { get; set; }
        public string?  Line2 { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }

        // Align with Stripe field naming: postal_code
        [JsonPropertyName("postal_code")]
        public required string PostalCode { get; set; }

        public required string Country { get; set; }
    }
}
