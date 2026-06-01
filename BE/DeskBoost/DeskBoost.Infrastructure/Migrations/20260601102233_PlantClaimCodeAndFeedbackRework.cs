using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PlantClaimCodeAndFeedbackRework : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_PlantSpecies_CatalogPlantId",
                table: "Feedbacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_Users_UserId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_UserId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "CatalogPlantId",
                table: "Feedbacks",
                newName: "MarketplaceItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_CatalogPlantId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_MarketplaceItemId");

            migrationBuilder.AddColumn<string>(
                name: "CareLevel",
                table: "Plants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClaimCodeId",
                table: "Plants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Light",
                table: "Plants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Plants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Water",
                table: "Plants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Feedbacks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerAlias",
                table: "Feedbacks",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EvidenceImageUrlsJson",
                table: "Feedbacks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EvidenceNote",
                table: "Feedbacks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicImageUrlsJson",
                table: "Feedbacks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PurchaseChannel",
                table: "Feedbacks",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PlantClaimCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MarketplaceItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BuyerContact = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    ClaimedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ClaimedPlantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ClaimedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantClaimCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlantClaimCodes_MarketplaceItems_MarketplaceItemId",
                        column: x => x.MarketplaceItemId,
                        principalTable: "MarketplaceItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plants_ClaimCodeId",
                table: "Plants",
                column: "ClaimCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantClaimCodes_Code",
                table: "PlantClaimCodes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlantClaimCodes_MarketplaceItemId",
                table: "PlantClaimCodes",
                column: "MarketplaceItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_MarketplaceItems_MarketplaceItemId",
                table: "Feedbacks",
                column: "MarketplaceItemId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_PlantClaimCodes_ClaimCodeId",
                table: "Plants",
                column: "ClaimCodeId",
                principalTable: "PlantClaimCodes",
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
                name: "FK_Plants_PlantClaimCodes_ClaimCodeId",
                table: "Plants");

            migrationBuilder.DropTable(
                name: "PlantClaimCodes");

            migrationBuilder.DropIndex(
                name: "IX_Plants_ClaimCodeId",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "CareLevel",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "ClaimCodeId",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "Light",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "Water",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "CustomerAlias",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "EvidenceImageUrlsJson",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "EvidenceNote",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "PublicImageUrlsJson",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "PurchaseChannel",
                table: "Feedbacks");

            migrationBuilder.RenameColumn(
                name: "MarketplaceItemId",
                table: "Feedbacks",
                newName: "CatalogPlantId");

            migrationBuilder.RenameIndex(
                name: "IX_Feedbacks_MarketplaceItemId",
                table: "Feedbacks",
                newName: "IX_Feedbacks_CatalogPlantId");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Feedbacks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Feedbacks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
