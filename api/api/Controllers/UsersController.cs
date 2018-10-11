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
            var user = _userService.Authenticate(userDto, out var emailError, out var passwordError, out var credentialsError);

            if (user == null)
            {
                return BadRequest(new {emailError, passwordError, credentialsError});
            }

            var token = _userService.BuildJWT(user);

            if (token == null)
            {
                return StatusCode(500, "Something went wrong when logging you in. Please try again later");
            }

            return Ok(new
            {
                userId = user.Id,
                userEmail = user.Email,
                userName = user.Name,
                token
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