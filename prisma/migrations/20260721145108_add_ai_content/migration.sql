-- CreateTable
CREATE TABLE "AIContent" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "instagramCaption" TEXT NOT NULL,
    "linkedinPost" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "callToAction" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIContent" ADD CONSTRAINT "AIContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
