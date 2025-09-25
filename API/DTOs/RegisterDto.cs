// API/DTOs/RegisterDto.cs
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        // Identity handles password complexity (length, casing, digits, symbols, etc.)
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
