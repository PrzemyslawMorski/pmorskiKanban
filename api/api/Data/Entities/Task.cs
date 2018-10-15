using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Data.Entities
{
    public class Task
    {
        [Key] public int Id { get; set; }

        [Required] [MaxLength(50)] public string Name { get; set; }

        [Required] [MaxLength(300)] public string Description { get; set; }

        [Required] public Column Column { get; set; }

        public int PreviousTaskId { get; set; }
        public int NextTaskId { get; set; }

        public List<Tag> Tags { get; set; }

        public List<TaskAssignedToUser> Assignees { get; set; }
    }

    public class TaskAssignedToUser
    {
        public int Id { get; set; }
        public Task Task { get; set; }
        public User AssignedUser { get; set; }
    }

    public class Tag
    {
        [Key] public string Value { get; set; }
    }
}