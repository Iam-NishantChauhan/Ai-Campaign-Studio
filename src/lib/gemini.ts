import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export type GeneratedCampaignContent = {
  headline: string;
  instagramCaption: string;
  linkedinPost: string;
  emailSubject: string;
  emailBody: string;
  callToAction: string;
};

export async function generateCampaignContent(
  campaignName: string,
  brandName: string,
  productName: string,
  campaignGoal: string,
  targetAudience: string
): Promise<GeneratedCampaignContent> {
  const prompt = `
You are an expert digital marketing strategist.

Generate marketing content for the following campaign.

Campaign Name: ${campaignName}
Brand: ${brandName}
Product: ${productName}
Goal: ${campaignGoal}
Target Audience: ${targetAudience}

Return ONLY valid JSON in the following format:

{
  "headline":"",
  "instagramCaption":"",
  "linkedinPost":"",
  "emailSubject":"",
  "emailBody":"",
  "callToAction":""
}

Do not include markdown.
Do not include explanation.
Do not wrap the JSON in triple backticks.
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
  });

  const text = response.text?.trim() ?? "";

  return JSON.parse(text);
}