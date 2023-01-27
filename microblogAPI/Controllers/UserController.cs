using microblog.Models;
using microblog.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace microblog.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserRepository _userRepository;
        private readonly int _tokenExpiredTime = 15;

        public UserController(IConfiguration config)
        {
            _config = config;
            _userRepository = new UserRepository(config.GetConnectionString("Default"));
        }

        [HttpPost]
        [Route("api/login")]
        public IActionResult Login([FromBody] UserModel userLogin)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");

            try
            {
                var user = Authenticate(userLogin);

                if (user == null)
                {
                    return Unauthorized();
                }

                var token = GenerateToken(user);

                return Ok(new { username = user.Username, userId = user.UserId, token, expiredTime = _tokenExpiredTime });
            }
            catch (Exception) { return BadRequest(); }

        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/register")]
        public IActionResult Register([FromBody] UserModel userRegister)
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");

            try
            {
                if (ModelState.IsValid)
                {
                    var user = Authenticate(userRegister);

                    if (user == null)
                    {
                        userRegister.Password = BCrypt.Net.BCrypt.HashPassword(userRegister.Password);
                        _userRepository.AddUser(userRegister);
                        return Ok();
                    }

                    return BadRequest();
                }

                return BadRequest();
            }
            catch (Exception) { return BadRequest(); }
        }

        private object GenerateToken(UserModel user)
        {
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["SecretKey"]));
            var credential = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Sid, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(_config["Issuer"], _config["Audience"], claims, expires: DateTime.Now.AddMinutes(_tokenExpiredTime), signingCredentials: credential);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserModel Authenticate(UserModel userLogin)
        {
            var user = _userRepository.GetUser(userLogin.Email);

            if (user == null)
            {
                return null;
            }

            if (BCrypt.Net.BCrypt.Verify(userLogin.Password, user.Password))
            {
                return user;
            }

            return null;
        }
    }
}
