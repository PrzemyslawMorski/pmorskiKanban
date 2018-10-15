using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Data.Entities
{
    public class Column
    {
        [Key] public int Id { get; set; }

        [Required] [MaxLength(50)] public string Name { get; set; }

        [Required] public Board Board { get; set; }

        public List<Task> Tasks { get; set; }

        public int PreviousColumnId { get; set; }
        public int NextColumnId { get; set; }
    }
}