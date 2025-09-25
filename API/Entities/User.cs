// API/Entities/User.cs
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        // Address is optional, so both fields remain nullable
        public int? AddressId { get; set; }
        public Address? Address { get; set; }
    }
}
