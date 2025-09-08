using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// 현재 로그인한 사용자의 UserName(본 강의에선 이메일)을 반환.
    /// 인증되지 않았으면 Unauthorized 예외.
    /// </summary>
    public static string GetUsername(this ClaimsPrincipal user) =>
        user.Identity?.Name ?? throw new UnauthorizedAccessException("User is not authenticated.");
}