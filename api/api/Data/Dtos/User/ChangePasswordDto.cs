namespace api.Data.Dtos.User
{
    public class ChangePasswordDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}