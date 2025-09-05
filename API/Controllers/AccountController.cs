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

        // (이미 있으실) 회원가입: /api/account/register
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

        // ✅ (새로) 현재 사용자 정보: 인증 안 돼 있으면 204 No Content
        // GET /api/account/user-info
        [HttpGet("user-info")]
        public async Task<ActionResult<object>> GetUserInfo()
        {
            // 쿠키가 왔고 유효한지 여부만 체크. 미인증이면 204로 조용히 종료
            if (!(User.Identity?.IsAuthenticated ?? false))
                return NoContent();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized(); // 이 경우는 드묾

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                email = user.Email,
                username = user.UserName,
                roles
            });
        }

        // ✅ (새로) 로그아웃: 쿠키 무효화
        // POST /api/account/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync(); // 인증 쿠키 무효화
            return NoContent();
        }

        /// <summary>
        /// 주소 생성/업데이트 (동일 엔드포인트에서 처리)
        /// </summary>
        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Address>> CreateOrUpdateAddress([FromBody] Address address)
        {
            // 현재 사용자 + 기존 주소 포함 조회
            var user = await _userManager.Users
                .Include(u => u.Address)   
                .FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);

            if (user == null) return Unauthorized();

            // 통째로 대체(없으면 새로 연결)
            user.Address = address;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Problem updating user address");

            // 저장된 주소 반환
            return Ok(user.Address);
        }

        /// <summary>
        /// 저장된 주소 조회(없으면 204 No Content)
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