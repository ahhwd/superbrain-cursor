-- AlterTable
ALTER TABLE "NotionIntegration" ADD COLUMN     "botId" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "notionDatabaseName" TEXT;
