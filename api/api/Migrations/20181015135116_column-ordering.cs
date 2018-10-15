using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class columnordering : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NextColumnId",
                table: "Column",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PreviousColumnId",
                table: "Column",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextColumnId",
                table: "Column");

            migrationBuilder.DropColumn(
                name: "PreviousColumnId",
                table: "Column");
        }
    }
}
