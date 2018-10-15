using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class userassignedtotask : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Task_TaskId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_TaskId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "TaskAssignedToUser",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TaskId = table.Column<int>(nullable: true),
                    AssignedUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskAssignedToUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskAssignedToUser_Users_AssignedUserId",
                        column: x => x.AssignedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskAssignedToUser_Task_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Task",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskAssignedToUser_AssignedUserId",
                table: "TaskAssignedToUser",
                column: "AssignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskAssignedToUser_TaskId",
                table: "TaskAssignedToUser",
                column: "TaskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskAssignedToUser");

            migrationBuilder.AddColumn<int>(
                name: "TaskId",
                table: "Users",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_TaskId",
                table: "Users",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Task_TaskId",
                table: "Users",
                column: "TaskId",
                principalTable: "Task",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
