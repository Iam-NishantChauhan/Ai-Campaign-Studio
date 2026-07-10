import { z } from "zod";

export const campaignSchema = z.object({
  campaignName: z.string().min(3, "Campaign name is required"),
  brandName: z.string().min(2, "Brand name is required"),
  productName: z.string().min(2, "Product name is required"),
  campaignGoal: z.string().min(3, "Campaign goal is required"),
  targetAudience: z.string().min(3, "Target audience is required"),
  budget: z.number().optional(),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;