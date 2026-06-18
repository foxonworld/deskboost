using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    [Migration("20260618143000_AddUserEmailPreferences")]
    public partial class AddUserEmailPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserEmailPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmailEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    ReminderEmailEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    AdminNotificationEmailEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SecurityEmailEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SuppressedReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SuppressedByAdminId = table.Column<Guid>(type: "uuid", nullable: true),
                    SuppressedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEmailPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEmailPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserEmailPreferences_UserId",
                table: "UserEmailPreferences",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserEmailPreferences");
        }
    }
}
