using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FeedbackSourceTypeAndCatalogPlantRename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_MarketplaceItemId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_MarketplaceItemId",
                table: "Feedbacks");

            // Rename MarketplaceItemId → CatalogPlantId (preserves existing FK data)
            migrationBuilder.RenameColumn(
                name: "MarketplaceItemId",
                table: "Feedbacks",
                newName: "CatalogPlantId");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByAdminId",
                table: "Feedbacks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceType",
                table: "Feedbacks",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "user");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks",
                column: "CatalogPlantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_CatalogPlantId",
                table: "Feedbacks",
                column: "CatalogPlantId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "CreatedByAdminId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "SourceType",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "CatalogPlantId",
                table: "Feedbacks",
                newName: "MarketplaceItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_MarketplaceItemId",
                table: "Feedbacks",
                column: "MarketplaceItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_MarketplaceItemId",
                table: "Feedbacks",
                column: "MarketplaceItemId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
