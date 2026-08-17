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

    const totalCampaigns = await prisma.campaign.count({
      where: {
        userId: user.id,
      },
    });

    const totalLeads = await prisma.lead.count({
      where: {
        campaign: {
          userId: user.id,
        },
      },
    });

    const totalAiGenerations = await prisma.aiContent.count({
      where: {
        campaign: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      totalCampaigns,
      totalLeads,
      totalAiGenerations,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}