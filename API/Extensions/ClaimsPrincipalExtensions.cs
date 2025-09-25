using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Return the current user's username (email in this app) or throw if unauthenticated.
    /// </summary>
    public static string GetUsername(this ClaimsPrincipal user) =>
        user.Identity?.Name ?? throw new UnauthorizedAccessException("User is not authenticated.");
}
