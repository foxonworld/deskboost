using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAiUsageAndQuota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "DiagnosisResults",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AiUsages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Feature = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PlantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DiagnosisResultId = table.Column<Guid>(type: "uuid", nullable: true),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AiUsages_DiagnosisResults_DiagnosisResultId",
                        column: x => x.DiagnosisResultId,
                        principalTable: "DiagnosisResults",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AiUsages_Plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AiUsages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiagnosisResults_UserId",
                table: "DiagnosisResults",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AiUsages_DiagnosisResultId",
                table: "AiUsages",
                column: "DiagnosisResultId");

            migrationBuilder.CreateIndex(
                name: "IX_AiUsages_PlantId",
                table: "AiUsages",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_AiUsages_UserId_Feature_UsedAt",
                table: "AiUsages",
                columns: new[] { "UserId", "Feature", "UsedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AiUsages");

            migrationBuilder.DropIndex(
                name: "IX_DiagnosisResults_UserId",
                table: "DiagnosisResults");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DiagnosisResults");
        }
    }
}
