using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FeedbackRenameAndClaimCodePlantLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "CatalogPlantId",
                table: "Feedbacks",
                newName: "MarketplaceItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_MarketplaceItemId");

            migrationBuilder.AddColumn<Guid>(
                name: "PlantId",
                table: "PlantClaimCodes",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlantClaimCodes_PlantId",
                table: "PlantClaimCodes",
                column: "PlantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_MarketplaceItemId",
                table: "Feedbacks",
                column: "MarketplaceItemId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PlantClaimCodes_Plants_PlantId",
                table: "PlantClaimCodes",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_MarketplaceItemId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_PlantClaimCodes_Plants_PlantId",
                table: "PlantClaimCodes");

            migrationBuilder.DropIndex(
                name: "IX_PlantClaimCodes_PlantId",
                table: "PlantClaimCodes");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "PlantClaimCodes");

            migrationBuilder.RenameColumn(
                name: "MarketplaceItemId",
                table: "Feedbacks",
                newName: "CatalogPlantId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_MarketplaceItemId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_CatalogPlantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_CatalogPlantId",
                table: "Feedbacks",
                column: "CatalogPlantId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
