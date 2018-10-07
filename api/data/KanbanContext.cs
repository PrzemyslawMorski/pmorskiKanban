using data.Models;
using Microsoft.EntityFrameworkCore;

namespace data
{
    public class KanbanContext : DbContext
    {
        public KanbanContext(DbContextOptions<KanbanContext> options) : base(options)
        {
        }

        public DbSet<Board> Boards { get; set; }
    }
}