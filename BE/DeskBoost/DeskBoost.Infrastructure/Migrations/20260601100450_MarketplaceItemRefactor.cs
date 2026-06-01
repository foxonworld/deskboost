using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MarketplaceItemRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plants_MarketplacePlants_MarketplacePlantId",
                table: "Plants");

            migrationBuilder.DropTable(
                name: "MarketplacePlants");

            migrationBuilder.RenameColumn(
                name: "MarketplacePlantId",
                table: "Plants",
                newName: "MarketplaceItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Plants_MarketplacePlantId",
                table: "Plants",
                newName: "IX_Plants_MarketplaceItemId");

            migrationBuilder.CreateTable(
                name: "MarketplaceItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    PriceText = table.Column<string>(type: "text", nullable: true),
                    ContactUrl = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CareLevel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Light = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Water = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    AttributesJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketplaceItems", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_MarketplaceItems_MarketplaceItemId",
                table: "Plants",
                column: "MarketplaceItemId",
                principalTable: "MarketplaceItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plants_MarketplaceItems_MarketplaceItemId",
                table: "Plants");

            migrationBuilder.DropTable(
                name: "MarketplaceItems");

            migrationBuilder.RenameColumn(
                name: "MarketplaceItemId",
                table: "Plants",
                newName: "MarketplacePlantId");

            migrationBuilder.RenameIndex(
                name: "IX_Plants_MarketplaceItemId",
                table: "Plants",
                newName: "IX_Plants_MarketplacePlantId");

            migrationBuilder.CreateTable(
                name: "MarketplacePlants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CareLevel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ContactUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    Light = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    PriceText = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Water = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketplacePlants", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_MarketplacePlants_MarketplacePlantId",
                table: "Plants",
                column: "MarketplacePlantId",
                principalTable: "MarketplacePlants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
