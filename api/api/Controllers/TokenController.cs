using data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using services.Authentication;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IConfiguration _config;

        public TokenController(IConfiguration config)
        {
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateToken([FromBody]Login login)
        {
            IActionResult response = Unauthorized();
            var user = AuthenticateUser.Authenticate(login);

            if (user != null)
            {
                var tokenString = BuildJWT.BuildToken(user, _config);
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        [AllowAnonymous]
        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok("Healthy");
        }
    }
}