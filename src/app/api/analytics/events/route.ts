import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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