using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Data.Entities
{
    public class Board
    {
        [Key] public int Id { get; set; }

        [Required] [MaxLength(50)] public string Name { get; set; }

        public List<Column> Columns { get; set; }
        public List<BoardMember> Members { get; set; }
        public List<BoardOwner> Owners { get; set; }
    }

    public class BoardMember
    {
        [Key] public int Id { get; set; }
        [Required] public Board Board { get; set; }
        [Required] public User Member { get; set; }
    }

    public class BoardOwner
    {
        [Key] public int Id { get; set; }
        [Required] public Board Board { get; set; }
        [Required] public User Owner { get; set; }
    }
}