"use client";

import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { Button } from "./ui/button";
import { Campaign } from "@/types/campaign";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/campaigns")
      .then(async (response) => {
        if (response.status === 401) {
          return [];
        }

        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }

        return (await response.json()) as Campaign[];
      })
      .then((data) => {
        if (!cancelled) {
          setCampaigns(data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch campaigns:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading campaigns...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Your Campaigns
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create, manage and generate AI content for your campaigns.
          </p>
        </div>

        <CreateCampaignDialog
          trigger={
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              + Create Campaign
            </Button>
          }
        />
      </div>

      {/* Empty state */}
      {campaigns.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto max-w-md">
            <h4 className="text-lg font-semibold text-slate-900">
              No campaigns yet
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Create your first campaign and generate AI-powered
              marketing content.
            </p>

            <div className="mt-6">
              <CreateCampaignDialog
                trigger={
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                    Create your first campaign
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Campaign cards */}
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
          initialAiContents={campaign.aiContents}
        />
      ))}
    </div>
  );
}