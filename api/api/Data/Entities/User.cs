using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Data.Entities
{
    public class User
    {
        [Key] public int Id { get; set; }

        [Required] [MaxLength(50)] public string Name { get; set; }

        [Required] [MaxLength(50)] public string Email { get; set; }

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public List<BoardMember> MemberBoards { get; set; }
        public List<BoardOwner> OwnerBoards { get; set; }
        public List<TaskAssignedToUser> AssignedTasks { get; set; }
    }
}