using data.Models;

namespace services.Authentication
{
    public class AuthenticateUser
    {
        public static User Authenticate(Login login)
        {
            User user = null;

            if (login.Email == "morski.przemek@gmail.com" && login.Password == "secret")
            {
                user = new User { Name = "Przemek Morski", Email = "morski.przemek@gmail.com" };
            }

            return user;
        }
    }
}