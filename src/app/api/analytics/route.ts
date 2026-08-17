import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        campaignName: true,
        createdAt: true,
        _count: {
          select: {
            leads: true,
            aiContents: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCampaigns = campaigns.length;

    const totalLeads = campaigns.reduce(
      (total, campaign) => total + campaign._count.leads,
      0
    );

    const totalAiGenerations = campaigns.reduce(
      (total, campaign) => total + campaign._count.aiContents,
      0
    );

    return NextResponse.json({
      totals: {
        campaigns: totalCampaigns,
        leads: totalLeads,
        aiGenerations: totalAiGenerations,
      },
      campaigns,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}