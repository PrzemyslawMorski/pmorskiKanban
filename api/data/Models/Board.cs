using System.ComponentModel.DataAnnotations;

namespace data.Models
{
    public class Board
    {
        [Key]
        public int BoardId { get; set; }

        public string Name { get; set; }

        public int NumMembers { get; set; }
    }
}