using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ClaimFlowV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Plants",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<DateTime>(
                name: "ClaimedAt",
                table: "Plants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MarketplacePlantId",
                table: "Plants",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Plants_MarketplacePlantId",
                table: "Plants",
                column: "MarketplacePlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_OwnershipCode",
                table: "Plants",
                column: "OwnershipCode",
                unique: true,
                filter: "\"OwnershipCode\" IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_MarketplacePlants_MarketplacePlantId",
                table: "Plants",
                column: "MarketplacePlantId",
                principalTable: "MarketplacePlants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plants_MarketplacePlants_MarketplacePlantId",
                table: "Plants");

            migrationBuilder.DropIndex(
                name: "IX_Plants_MarketplacePlantId",
                table: "Plants");

            migrationBuilder.DropIndex(
                name: "IX_Plants_OwnershipCode",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "ClaimedAt",
                table: "Plants");

            migrationBuilder.DropColumn(
                name: "MarketplacePlantId",
                table: "Plants");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Plants",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
