import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_EVENTS = [
  "PAGE_VIEW",
  "CTA_CLICK",
  "LEAD_CAPTURE",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { campaignId, eventType } = body;

    if (!campaignId || !eventType) {
      return NextResponse.json(
        {
          error: "campaignId and eventType are required",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_EVENTS.includes(eventType)) {
      return NextResponse.json(
        {
          error: "Invalid event type",
        },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
      select: {
        id: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        {
          error: "Campaign not found",
        },
        { status: 404 }
      );
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        campaignId,
        eventType,
      },
    });

    return NextResponse.json(
      {
        message: "Event tracked successfully",
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analytics event error:", error);

    return NextResponse.json(
      {
        error: "Failed to track event",
      },
      { status: 500 }
    );
  }
}

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
      include: {
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

    const analytics = await Promise.all(
      campaigns.map(async (campaign) => {
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
          events.find(
            (event) => event.eventType === "PAGE_VIEW"
          )?._count._all ?? 0;

        const ctaClicks =
          events.find(
            (event) => event.eventType === "CTA_CLICK"
          )?._count._all ?? 0;

        const leadCaptures =
          events.find(
            (event) => event.eventType === "LEAD_CAPTURE"
          )?._count._all ?? 0;

        return {
          id: campaign.id,
          campaignName: campaign.campaignName,
          createdAt: campaign.createdAt,
          _count: campaign._count,
          events: {
            pageViews,
            ctaClicks,
            leadCaptures,
          },
        };
      })
    );

    const totals = {
      campaigns: campaigns.length,
      leads: campaigns.reduce(
        (total, campaign) => total + campaign._count.leads,
        0
      ),
      aiGenerations: campaigns.reduce(
        (total, campaign) => total + campaign._count.aiContents,
        0
      ),
      pageViews: analytics.reduce(
        (total, campaign) => total + campaign.events.pageViews,
        0
      ),
      ctaClicks: analytics.reduce(
        (total, campaign) => total + campaign.events.ctaClicks,
        0
      ),
      leadCaptures: analytics.reduce(
        (total, campaign) => total + campaign.events.leadCaptures,
        0
      ),
    };

    return NextResponse.json({
      totals,
      campaigns: analytics,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}