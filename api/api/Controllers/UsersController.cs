using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Data.Dtos.User;
using api.Helpers;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto userDto)
        {
            var user = _userService.Authenticate(userDto.Email, userDto.Password);

            if (user == null)
            {
                return BadRequest(new {message = "Email or password is incorrect"});
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_appSettings.JwtSecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Name,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerRequestDto)
        {
            _userService.Create(registerRequestDto,
                out var emailError,
                out var nameError,
                out var passwordError,
                out var serverError);

            if (emailError != null || nameError != null || passwordError != null)
            {
                return BadRequest(new
                {
                    emailError, nameError, passwordError
                });
            }

            if (serverError != null)
            {
                return StatusCode(500, serverError);
            }

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public IActionResult ChangeNameEmail([FromBody] ChangeNameEmailDto changeNameEmailDto)
        {
            //            // map dto to entity and set id
            //            var user = _mapper.Map<User>(userDto);
            //            user.Id = id;
            //
            //            try
            //            {
            //                // save 
            //                _userService.Update(user, userDto.Password);
            //                return Ok();
            //            }
            //            catch (AppException ex)
            //            {
            //                // return error message if there was an exception
            //                return BadRequest(new { message = ex.Message });
            //            }
            return Ok();
        }

        [HttpPut("password")]
        [Authorize]
        public IActionResult ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            //            // map dto to entity and set id
            //            var user = _mapper.Map<User>(userDto);
            //            user.Id = id;
            //
            //            try
            //            {
            //                // save 
            //                _userService.Update(user, userDto.Password);
            //                return Ok();
            //            }
            //            catch (AppException ex)
            //            {
            //                // return error message if there was an exception
            //                return BadRequest(new { message = ex.Message });
            //            }
            return Ok();
        }

        [HttpGet("forgot")]
        public IActionResult ForgotPassword([FromQuery] string email)
        {
            return Ok(email);
        }

        [HttpDelete]
        public IActionResult Delete([FromBody] DeleteAccountDto deleteAccountDto)
        {
            //            _userService.Delete(id);
            return Ok();
        }
    }
}