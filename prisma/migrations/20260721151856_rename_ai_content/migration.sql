/*
  Warnings:

  - You are about to drop the `AIContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIContent" DROP CONSTRAINT "AIContent_campaignId_fkey";

-- DropTable
DROP TABLE "AIContent";

-- CreateTable
CREATE TABLE "AiContent" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "instagramCaption" TEXT NOT NULL,
    "linkedinPost" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "callToAction" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiContent" ADD CONSTRAINT "AiContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
