import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            leads: true,
            aiContents: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    const events = await prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: {
        campaignId: campaign.id,
      },
      _count: {
        _all: true,
      },
    });

    const pageViews =
      events.find((event) => event.eventType === "PAGE_VIEW")?._count._all ?? 0;

    const ctaClicks =
      events.find((event) => event.eventType === "CTA_CLICK")?._count._all ?? 0;

    const leadCaptures = campaign._count.leads;

    return NextResponse.json({
      id: campaign.id,
      campaignName: campaign.campaignName,
      createdAt: campaign.createdAt,
      _count: campaign._count,
      events: {
        pageViews,
        ctaClicks,
        leadCaptures,
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaign analytics:", error);

    return NextResponse.json(
      { error: "Failed to fetch campaign analytics" },
      { status: 500 },
    );
  }
}
