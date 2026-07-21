"use client";

import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import { Campaign } from "@/types/campaign";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch("/api/campaigns");

        // User is not logged in
        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        const data: Campaign[] = await response.json();

        setCampaigns(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (loading) {
    return <p className="mt-8 text-center">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          id={campaign.id}
          campaignName={campaign.campaignName}
          brandName={campaign.brandName}
          productName={campaign.productName}
          campaignGoal={campaign.campaignGoal}
          targetAudience={campaign.targetAudience}
          budget={campaign.budget}
        />
      ))}
    </div>
  );
}
