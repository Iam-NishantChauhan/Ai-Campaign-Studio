"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalCampaigns: number;
  totalLeads: number;
  totalAiGenerations: number;
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

  if (!analytics) {
    return (
      <div className="p-8">
        <p>Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-2 text-gray-500">
          Track your campaign performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Total Campaigns
          </p>

          <p className="mt-3 text-4xl font-bold">
            {analytics.totalCampaigns}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Total Leads
          </p>

          <p className="mt-3 text-4xl font-bold">
            {analytics.totalLeads}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            AI Generations
          </p>

          <p className="mt-3 text-4xl font-bold">
            {analytics.totalAiGenerations}
          </p>
        </div>
      </div>
    </div>
  );
}