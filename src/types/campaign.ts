export interface AiContent {
  id: string;
  headline: string;
  instagramCaption: string;
  linkedinPost: string;
  emailSubject: string;
  emailBody: string;
  callToAction: string;
  campaignId: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
  aiContents: AiContent[];
}
