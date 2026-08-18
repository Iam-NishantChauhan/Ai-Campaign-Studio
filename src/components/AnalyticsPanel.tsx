"use client";

import { useEffect, useMemo, useState } from "react";

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

type AnalyticsData = {
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

export default function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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

  const averageCtr = useMemo(() => {
    if (!analytics || analytics.totals.pageViews === 0) {
      return 0;
    }

    return (
      (analytics.totals.ctaClicks / analytics.totals.pageViews) *
      100
    );
  }, [analytics]);

  const conversionRate = useMemo(() => {
    if (!analytics || analytics.totals.pageViews === 0) {
      return 0;
    }

    return (
      (analytics.totals.leadCaptures /
        analytics.totals.pageViews) *
      100
    );
  }, [analytics]);

  if (loading) {
    return (
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track campaign performance and conversions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading analytics...
          </p>
        </div>
      </section>
    );
  }

  if (!analytics) {
    return (
      <section className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <h2 className="font-semibold text-red-800">
          Unable to load analytics
        </h2>

        <p className="mt-1 text-sm text-red-600">
          Please refresh the page and try again.
        </p>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Performance Overview
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Campaign Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Understand how your campaigns are performing.
        </p>
      </div>

      {/* Main KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Page Views"
          value={analytics.totals.pageViews}
          description="Landing page visits"
          icon="👁️"
        />

        <MetricCard
          title="CTA Clicks"
          value={analytics.totals.ctaClicks}
          description="Call-to-action clicks"
          icon="🖱️"
        />

        <MetricCard
          title="Leads"
          value={analytics.totals.leadCaptures}
          description="Captured leads"
          icon="👥"
        />

        <MetricCard
          title="Campaigns"
          value={analytics.totals.campaigns}
          description="Active campaigns"
          icon="📣"
        />
      </div>

      {/* Performance rates */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Click-through Rate
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {averageCtr.toFixed(1)}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
              📈
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Percentage of visitors who clicked your CTA.
          </p>

          <ProgressBar value={averageCtr} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Lead Conversion Rate
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {conversionRate.toFixed(1)}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
              🎯
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Percentage of visitors who became leads.
          </p>

          <ProgressBar value={conversionRate} />
        </div>
      </div>

      {/* Campaign performance */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">
            Campaign Performance
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Compare performance across your campaigns.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {analytics.campaigns.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                📊
              </div>

              <h4 className="mt-4 font-semibold text-slate-900">
                No campaign data yet
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Create a campaign and start generating traffic to see
                analytics here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Campaign
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Views
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      CTA Clicks
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Leads
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      CTR
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Conversion
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {analytics.campaigns.map((campaign) => {
                    const ctr =
                      campaign.events.pageViews > 0
                        ? (campaign.events.ctaClicks /
                            campaign.events.pageViews) *
                          100
                        : 0;

                    const conversion =
                      campaign.events.pageViews > 0
                        ? (campaign.events.leadCaptures /
                            campaign.events.pageViews) *
                          100
                        : 0;

                    return (
                      <tr
                        key={campaign.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {campaign.campaignName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Created{" "}
                            {new Date(
                              campaign.createdAt,
                            ).toLocaleDateString("en-IN")}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <MetricValue
                            value={campaign.events.pageViews}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <MetricValue
                            value={campaign.events.ctaClicks}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                            {campaign.events.leadCaptures}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-indigo-700">
                            {ctr.toFixed(1)}%
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-green-700">
                            {conversion.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="AI Generations"
          value={analytics.totals.aiGenerations}
        />

        <SummaryCard
          label="Total CTA Clicks"
          value={analytics.totals.ctaClicks}
        />

        <SummaryCard
          label="Total Leads"
          value={analytics.totals.leads}
        />
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function MetricValue({ value }: { value: number }) {
  return (
    <span className="text-sm font-semibold text-slate-800">
      {value.toLocaleString("en-IN")}
    </span>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}