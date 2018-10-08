using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using api.Data;
using api.Data.Dtos.User;
using api.Data.Entities;
using api.Helpers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
public interface IUserService
    {
        User Authenticate(string email, string password);
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

        public UserService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.Email == email);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) return null;

            return user;
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

            var user = _mapper.Map<User>(registerRequestDto);

            CreatePasswordHash(registerRequestDto.Password, out var passwordHash, out var passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            try
            {
                _context.Users.Add(user);
                _context.SaveChanges();
            } catch(DbUpdateException)
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
                throw new ArgumentNullException(nameof(password));
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            }

            if (storedHash.Length != 64)
            {
                throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            }

            if (storedSalt.Length != 128)
            {
                throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");
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