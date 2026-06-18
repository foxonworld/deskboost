using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailDeliveryLogsForReminderEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailDeliveryLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    RecipientUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    RecipientEmail = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    Subject = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Provider = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    Status = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    IdempotencyKey = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    RelatedEntityType = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    RelatedEntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ErrorCode = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    ErrorMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailDeliveryLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reminders_IsActive_Status_CareType_DueAt",
                table: "Reminders",
                columns: new[] { "IsActive", "Status", "CareType", "DueAt" });

            migrationBuilder.CreateIndex(
                name: "IX_EmailDeliveryLogs_Category_Status_CreatedAt",
                table: "EmailDeliveryLogs",
                columns: new[] { "Category", "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_EmailDeliveryLogs_IdempotencyKey",
                table: "EmailDeliveryLogs",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmailDeliveryLogs_RelatedEntityType_RelatedEntityId",
                table: "EmailDeliveryLogs",
                columns: new[] { "RelatedEntityType", "RelatedEntityId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailDeliveryLogs");

            migrationBuilder.DropIndex(
                name: "IX_Reminders_IsActive_Status_CareType_DueAt",
                table: "Reminders");
        }
    }
}
