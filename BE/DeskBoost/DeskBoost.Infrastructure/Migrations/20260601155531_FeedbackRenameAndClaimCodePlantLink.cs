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
            // Drop old FK only if it still exists
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_Feedbacks_MarketplaceItems_CatalogPlantId'
                    ) THEN
                        ALTER TABLE ""Feedbacks"" DROP CONSTRAINT ""FK_Feedbacks_MarketplaceItems_CatalogPlantId"";
                    END IF;
                END
                $$;
            ");

            // Rename column only if it still has the old name
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name   = 'Feedbacks'
                          AND column_name  = 'CatalogPlantId'
                    ) THEN
                        ALTER TABLE ""Feedbacks"" RENAME COLUMN ""CatalogPlantId"" TO ""MarketplaceItemId"";
                    END IF;
                END
                $$;
            ");

            // Rename index only if it still has the old name
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM pg_indexes
                        WHERE schemaname = 'public'
                          AND indexname  = 'IX_Feedbacks_CatalogPlantId'
                    ) THEN
                        ALTER INDEX ""IX_Feedbacks_CatalogPlantId"" RENAME TO ""IX_Feedbacks_MarketplaceItemId"";
                    END IF;
                END
                $$;
            ");

            // Add PlantId to PlantClaimCodes only if it doesn't exist yet
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name   = 'PlantClaimCodes'
                          AND column_name  = 'PlantId'
                    ) THEN
                        ALTER TABLE ""PlantClaimCodes"" ADD COLUMN ""PlantId"" uuid NULL;
                    END IF;
                END
                $$;
            ");

            // Create index on PlantId only if it doesn't exist yet
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_indexes
                        WHERE schemaname = 'public'
                          AND tablename  = 'PlantClaimCodes'
                          AND indexname  = 'IX_PlantClaimCodes_PlantId'
                    ) THEN
                        CREATE INDEX ""IX_PlantClaimCodes_PlantId"" ON ""PlantClaimCodes"" (""PlantId"");
                    END IF;
                END
                $$;
            ");

            // Add new FK for Feedbacks only if it doesn't exist yet
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_Feedbacks_MarketplaceItems_MarketplaceItemId'
                    ) THEN
                        ALTER TABLE ""Feedbacks""
                            ADD CONSTRAINT ""FK_Feedbacks_MarketplaceItems_MarketplaceItemId""
                            FOREIGN KEY (""MarketplaceItemId"")
                            REFERENCES ""MarketplaceItems""(""Id"")
                            ON DELETE SET NULL;
                    END IF;
                END
                $$;
            ");

            // Add FK for PlantClaimCodes.PlantId only if it doesn't exist yet
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint
                        WHERE conname = 'FK_PlantClaimCodes_Plants_PlantId'
                    ) THEN
                        ALTER TABLE ""PlantClaimCodes""
                            ADD CONSTRAINT ""FK_PlantClaimCodes_Plants_PlantId""
                            FOREIGN KEY (""PlantId"")
                            REFERENCES ""Plants""(""Id"")
                            ON DELETE SET NULL;
                    END IF;
                END
                $$;
            ");
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
