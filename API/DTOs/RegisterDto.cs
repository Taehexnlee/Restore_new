// API/DTOs/RegisterDto.cs
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        // 비밀번호 복잡도 검사는 Identity가 처리 (길이/대문자/숫자/특문 등)
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}