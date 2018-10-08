namespace api.Data.Dtos.User
{
    public class ChangeNameEmailDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string NewEmail { get; set; }
        public string NewName { get; set; }
    }
}