"use client";

import { useEffect, useState } from "react";

type CampaignAnalytics = {
  id: string;
  campaignName: string;
  createdAt: string;
  _count: {
    leads: number;
    aiContents: number;
  };
  events: {
    pageViews: number;
    ctaClicks: number;
    leadCaptures: number;
  };
};

export default function CampaignAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [campaign, setCampaign] = useState<CampaignAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/analytics/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();

        setCampaign(data);
      } catch (error) {
        console.error("Campaign analytics error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p>Loading campaign analytics...</p>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
      </main>
    );
  }

  const { pageViews, ctaClicks, leadCaptures } = campaign.events;

  const ctaRate =
    pageViews > 0 ? ((ctaClicks / pageViews) * 100).toFixed(1) : "0.0";

  const leadConversion =
    pageViews > 0 ? ((leadCaptures / pageViews) * 100).toFixed(1) : "0.0";

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{campaign.campaignName}</h1>

          <p className="text-gray-600 mt-2">Campaign performance analytics</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Page Views</p>

            <p className="text-3xl font-bold mt-2">{pageViews}</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">CTA Clicks</p>

            <p className="text-3xl font-bold mt-2">{ctaClicks}</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Leads</p>

            <p className="text-3xl font-bold mt-2">{leadCaptures}</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">AI Generations</p>

            <p className="text-3xl font-bold mt-2">
              {campaign._count.aiContents}
            </p>
          </div>
        </div>

        {/* Conversion */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">CTA Rate</p>

            <p className="text-3xl font-bold mt-2">{ctaRate}%</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-500">Lead Conversion</p>

            <p className="text-3xl font-bold mt-2">{leadConversion}%</p>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Conversion Funnel</h2>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex justify-between">
              <span>Page Views</span>
              <span className="font-bold">{pageViews}</span>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="border rounded-lg p-4 flex justify-between">
              <span>CTA Clicks</span>
              <span className="font-bold">{ctaClicks}</span>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="border rounded-lg p-4 flex justify-between">
              <span>Lead Captures</span>
              <span className="font-bold">{leadCaptures}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
