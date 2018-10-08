namespace api.Data.Dtos.User
{
    public class DeleteAccountDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
    }
}