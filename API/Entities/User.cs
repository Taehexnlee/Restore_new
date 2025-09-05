// API/Entities/User.cs
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {
        // 선택 저장이므로 둘 다 nullable
        public int? AddressId { get; set; }
        public Address? Address { get; set; }
    }
}