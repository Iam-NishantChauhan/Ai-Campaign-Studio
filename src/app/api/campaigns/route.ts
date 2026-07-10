import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const campaign = await prisma.campaign.create({
        data: {
            campaignName: body.campaignName,
            brandName: body.brandName,
            productName: body.productName,
            campaignGoal: body.campaignGoal,
            targetAudience: body.targetAudience,
            budget: body.budget,
        },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}