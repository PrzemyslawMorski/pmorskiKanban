using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class taskordering : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Task_NextTaskId",
                table: "Task");

            migrationBuilder.DropIndex(
                name: "IX_Task_NextTaskId",
                table: "Task");

            migrationBuilder.AddColumn<int>(
                name: "TaskId",
                table: "Users",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "NextTaskId",
                table: "Task",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreviousTaskId",
                table: "Task",
                nullable: false,
                defaultValue: 0);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "PreviousTaskId",
                table: "Task");

            migrationBuilder.AlterColumn<int>(
                name: "NextTaskId",
                table: "Task",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "IX_Task_NextTaskId",
                table: "Task",
                column: "NextTaskId",
                unique: true,
                filter: "[NextTaskId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Task_NextTaskId",
                table: "Task",
                column: "NextTaskId",
                principalTable: "Task",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
