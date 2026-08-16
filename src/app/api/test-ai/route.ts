import { NextResponse } from "next/server";
import { generateCampaignContent } from "@/lib/gemini";

export async function GET() {
  try {
    const data = await generateCampaignContent(
      "Summer Sale",
      "Nike",
      "Running Shoes",
      "Increase online sales",
      "Fitness enthusiasts aged 18-35"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate AI content",
      },
      {
        status: 500,
      }
    );
  }
}