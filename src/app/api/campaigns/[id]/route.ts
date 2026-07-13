import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.campaign.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    const updatedCampaign = await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        campaignName: body.campaignName,
        brandName: body.brandName,
        productName: body.productName,
        campaignGoal: body.campaignGoal,
        targetAudience: body.targetAudience,
        budget: body.budget,
      },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}