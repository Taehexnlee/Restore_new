// API/Controllers/AccountController.cs
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // POST /api/account/register — create a new user account
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var user = new User { UserName = dto.Email, Email = dto.Email };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                foreach (var err in result.Errors)
                    ModelState.AddModelError(err.Code, err.Description);

                return ValidationProblem(ModelState);
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return Ok();
        }

        // GET /api/account/user-info — return current user info or 204 if unauthenticated
        [HttpGet("user-info")]
        public async Task<ActionResult<object>> GetUserInfo()
        {
            // If not authenticated, quietly return 204 No Content
            if (!(User.Identity?.IsAuthenticated ?? false))
                return NoContent();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized(); // Rare but defensive

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                email = user.Email,
                username = user.UserName,
                roles
            });
        }

        // POST /api/account/logout — sign the user out
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync(); // Clear the authentication cookie
            return NoContent();
        }

        /// <summary>
        /// Create or update the user's address via a single endpoint
        /// </summary>
        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Address>> CreateOrUpdateAddress([FromBody] Address address)
        {
            // Load the current user, including any existing address
            var user = await _userManager.Users
                .Include(u => u.Address)   
                .FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);

            if (user == null) return Unauthorized();

            // Replace the address (or attach if new)
            user.Address = address;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Problem updating user address");

            // Return the persisted address
            return Ok(user.Address);
        }

        /// <summary>
        /// Retrieve the stored address, returning 204 if none exists
        /// </summary>
        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<Address>> GetSavedAddress()
        {
            var address = await _userManager.Users
                .Where(u => u.UserName == User.Identity!.Name)
                .Select(u => u.Address!)
                .FirstOrDefaultAsync();

            if (address == null) return NoContent();
            return Ok(address);
        }
    }
}
