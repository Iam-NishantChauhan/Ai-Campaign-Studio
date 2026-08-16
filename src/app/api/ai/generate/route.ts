import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateCampaignContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { campaignId?: unknown };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { campaignId } = body;

    if (typeof campaignId !== "string" || !campaignId.trim()) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 },
      );
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: user.id,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    const aiResult = await generateCampaignContent(
      campaign.campaignName,
      campaign.brandName,
      campaign.productName,
      campaign.campaignGoal,
      campaign.targetAudience,
    );

    const savedContent = await prisma.aiContent.create({
      data: {
        ...aiResult,
        campaignId: campaign.id,
      },
    });

    return NextResponse.json(savedContent);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate AI content",
      },
      {
        status: 500,
      },
    );
  }
}
