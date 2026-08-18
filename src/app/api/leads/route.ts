import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { leadSchema } from "@/validations/lead.schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    let body: unknown;

    // Parse request body
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate name and email
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ?? "Invalid lead details",
        },
        { status: 400 }
      );
    }

    // Get campaignId from request body
    const campaignId =
      typeof body === "object" &&
      body !== null &&
      "campaignId" in body &&
      typeof body.campaignId === "string"
        ? body.campaignId
        : null;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Check campaign exists
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
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Create Lead + Analytics Event together
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          campaignId: campaign.id,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          campaignId: campaign.id,
          eventType: "LEAD_CAPTURE",
        },
      });

      return newLead;
    });

    return NextResponse.json(
      {
        id: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create lead:", error);

    return NextResponse.json(
      { error: "Unable to submit your details" },
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

    const leads = await prisma.lead.findMany({
      where: {
        campaign: {
          userId: user.id,
        },
      },
      include: {
        campaign: {
          select: {
            id: true,
            campaignName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch leads:", error);

    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}