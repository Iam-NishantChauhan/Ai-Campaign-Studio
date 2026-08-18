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

type Analytics = {
  totals: {
    campaigns: number;
    leads: number;
    aiGenerations: number;
    pageViews: number;
    ctaClicks: number;
    leadCaptures: number;
  };
  campaigns: CampaignAnalytics[];
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();

        setAnalytics(data);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Campaign Analytics
          </h1>

          <p className="mt-2 text-gray-600">
            Track campaign performance, engagement, and leads.
          </p>
        </div>

        {/* Overall Totals */}
        {analytics && (
          <div className="grid gap-6 md:grid-cols-4 mb-8">

            {/* Campaigns */}
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-500">
                Total Campaigns
              </p>

              <p className="text-3xl font-bold mt-2">
                {analytics.totals.campaigns}
              </p>
            </div>

            {/* Page Views */}
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-500">
                Page Views
              </p>

              <p className="text-3xl font-bold mt-2">
                {analytics.totals.pageViews}
              </p>
            </div>

            {/* CTA Clicks */}
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-500">
                CTA Clicks
              </p>

              <p className="text-3xl font-bold mt-2">
                {analytics.totals.ctaClicks}
              </p>
            </div>

            {/* Leads */}
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-500">
                Total Leads
              </p>

              <p className="text-3xl font-bold mt-2">
                {analytics.totals.leads}
              </p>
            </div>

          </div>
        )}

        {/* Campaign Performance */}
        <h2 className="text-2xl font-bold mb-4">
          Campaign Performance
        </h2>

        {!analytics || analytics.campaigns.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No campaigns found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">

            {analytics.campaigns.map((campaign) => {

              const ctaRate =
                campaign.events.pageViews > 0
                  ? (
                      (campaign.events.ctaClicks /
                        campaign.events.pageViews) *
                      100
                    ).toFixed(1)
                  : "0.0";

              const leadConversion =
                campaign.events.pageViews > 0
                  ? (
                      (campaign.events.leadCaptures /
                        campaign.events.pageViews) *
                      100
                    ).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={campaign.id}
                  className="bg-white border rounded-xl p-6"
                >
                  {/* Campaign Name */}
                  <h2 className="text-xl font-semibold">
                    {campaign.campaignName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Created{" "}
                    {new Date(
                      campaign.createdAt
                    ).toLocaleDateString()}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-6">

                    {/* Page Views */}
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Page Views
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {campaign.events.pageViews}
                      </p>
                    </div>

                    {/* CTA Clicks */}
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        CTA Clicks
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {campaign.events.ctaClicks}
                      </p>
                    </div>

                    {/* Leads */}
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Leads
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {campaign.events.leadCaptures}
                      </p>
                    </div>

                    {/* AI Generations */}
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        AI Generations
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {campaign._count.aiContents}
                      </p>
                    </div>

                  </div>

                  {/* Conversion Rates */}
                  <div className="mt-4 grid grid-cols-2 gap-4">

                    {/* CTA Rate */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        CTA Rate
                      </p>

                      <p className="text-xl font-bold mt-1">
                        {ctaRate}%
                      </p>
                    </div>

                    {/* Lead Conversion */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Lead Conversion
                      </p>

                      <p className="text-xl font-bold mt-1">
                        {leadConversion}%
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </main>
  );
}