using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBoost.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase1_Diagnosis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagnosisResults_PlantSpecies_PlantSpeciesId",
                table: "DiagnosisResults");

            migrationBuilder.DropForeignKey(
                name: "FK_DiagnosisResults_Plants_PlantId",
                table: "DiagnosisResults");

            migrationBuilder.DropIndex(
                name: "IX_DiagnosisResults_PlantSpeciesId",
                table: "DiagnosisResults");

            migrationBuilder.DropColumn(
                name: "PlantSpeciesId",
                table: "DiagnosisResults");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlantId",
                table: "DiagnosisResults",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagnosisResults_Plants_PlantId",
                table: "DiagnosisResults",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiagnosisResults_Plants_PlantId",
                table: "DiagnosisResults");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlantId",
                table: "DiagnosisResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PlantSpeciesId",
                table: "DiagnosisResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_DiagnosisResults_PlantSpeciesId",
                table: "DiagnosisResults",
                column: "PlantSpeciesId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagnosisResults_PlantSpecies_PlantSpeciesId",
                table: "DiagnosisResults",
                column: "PlantSpeciesId",
                principalTable: "PlantSpecies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DiagnosisResults_Plants_PlantId",
                table: "DiagnosisResults",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
