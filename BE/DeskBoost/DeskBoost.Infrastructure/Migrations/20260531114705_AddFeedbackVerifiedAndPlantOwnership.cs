using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedbackVerifiedAndPlantOwnership : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsClaimed",
                table: "Plants",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OwnershipCode",
                table: "Plants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnershipStatus",
                table: "Plants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "CatalogPlantId",
                table: "Feedbacks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Feedbacks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerifiedAt",
                table: "Feedbacks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks",
                column: "CatalogPlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_UserId",
                table: "Feedbacks",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_PlantSpecies_CatalogPlantId",
                table: "Feedbacks",
                column: "CatalogPlantId",
                principalTable: "PlantSpecies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_Users_UserId",
                table: "Feedbacks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_PlantSpecies_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Users_UserId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_UserId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "IsClaimed",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "OwnershipCode",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "OwnershipStatus",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "VerifiedAt",
                table: "Feedbacks");
        }
    }
}
