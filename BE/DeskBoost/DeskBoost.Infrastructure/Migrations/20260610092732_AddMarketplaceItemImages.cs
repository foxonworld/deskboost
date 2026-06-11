using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceItemImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MarketplaceItemImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MarketplaceItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketplaceItemImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MarketplaceItemImages_MarketplaceItems_MarketplaceItemId",
                        column: x => x.MarketplaceItemId,
                        principalTable: "MarketplaceItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MarketplaceItemImages_MarketplaceItemId",
                table: "MarketplaceItemImages",
                column: "MarketplaceItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MarketplaceItemImages");
        }
    }
}
