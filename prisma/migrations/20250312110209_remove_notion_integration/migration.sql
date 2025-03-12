/*
  Warnings:

  - You are about to drop the column `notionPageId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `NotionIntegration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotionIntegration" DROP CONSTRAINT "NotionIntegration_userId_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "notionPageId";

-- DropTable
DROP TABLE "NotionIntegration";
