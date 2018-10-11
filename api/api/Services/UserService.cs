using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using api.Data;
using api.Data.Dtos.User;
using api.Data.Entities;
using api.Helpers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public interface IUserService
    {
        User Authenticate(LoginDto loginRequestDto,
            out string emailError,
            out string passwordError,
            out string credentialsError);

        string BuildJWT(User user);
        IEnumerable<User> GetAll();
        User GetById(int id);

        void Create(RegisterDto registerRequestDto,
            out string emailError,
            out string nameError,
            out string passwordError,
            out string serverError);

        void Update(User user, string password = null);
        void Delete(int id);
    }

    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UserService(DataContext context, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        public User Authenticate(LoginDto loginRequestDto, out string emailError, out string passwordError,
            out string credentialsError)
        {
            emailError = null;
            passwordError = null;
            credentialsError = null;

            if (string.IsNullOrWhiteSpace(loginRequestDto.Email))
            {
                emailError = "Email is required.";
            }

            if (string.IsNullOrWhiteSpace(loginRequestDto.Email))
            {
                passwordError = "Password is required.";
            }

            var user = _context.Users.SingleOrDefault(x => x.Email == loginRequestDto.Email);

            if (user == null)
            {
                credentialsError = "Email or password is incorrect";
                return null;
            }

            if (!VerifyPasswordHash(loginRequestDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                credentialsError = "Email or password is incorrect";
                return null;
            }

            if (emailError != null || passwordError != null) return null;

            return user;
        }

        public string BuildJWT(User user)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_appSettings.JwtSecretKey);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Email, user.Email)
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return tokenString;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users;
        }

        public User GetById(int id)
        {
            return _context.Users.Find(id);
        }

        public void Create(RegisterDto registerRequestDto,
            out string emailError,
            out string nameError,
            out string passwordError,
            out string serverError)
        {
            emailError = null;
            nameError = null;
            passwordError = null;
            serverError = null;

            if (string.IsNullOrWhiteSpace(registerRequestDto.Email))
            {
                emailError = "Email is required.";
            }
            else if (!IsEmailValid(registerRequestDto.Email))
            {
                emailError = "Email is not valid.";
            }
            else if (_context.Users.Any(x => x.Email == registerRequestDto.Email))
            {
                emailError = "Email " + registerRequestDto.Email + " is already taken.";
            }

            if (string.IsNullOrWhiteSpace(registerRequestDto.Name))
            {
                nameError = "Name is required.";
            }

            if (string.IsNullOrWhiteSpace(registerRequestDto.Password))
            {
                passwordError = "Password is required.";
            }

            if (emailError == null ||
                nameError == null ||
                passwordError == null ||
                serverError == null)
            {
                return;
            }

            var user = _mapper.Map<User>(registerRequestDto);

            CreatePasswordHash(registerRequestDto.Password, out var passwordHash, out var passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            try
            {
                _context.Users.Add(user);
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                serverError = "There's something wrong with our database. Please try again later.";
            }
        }

        public void Update(User userParam, string password = null)
        {
            var user = _context.Users.Find(userParam.Id);

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Email != user.Email)
            {
                // email has changed so check if the new email is already taken
                if (_context.Users.Any(x => x.Email == userParam.Email))
                    throw new AppException("Email " + userParam.Email + " is already taken");
            }

            user.Name = userParam.Name;
            user.Email = userParam.Email;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                CreatePasswordHash(password, out var passwordHash, out var passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return;

            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null)
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                return false;
            }

            if (storedHash.Length != 64)
            {
                return false;
            }

            if (storedSalt.Length != 128)
            {
                return false;
            }

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (var i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        private static bool IsEmailValid(string email)
        {
            try
            {
                var m = new MailAddress(email);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}