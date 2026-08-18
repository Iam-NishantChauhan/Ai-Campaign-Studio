"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  campaign: {
    id: string;
    campaignName: string;
  };
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/leads");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data: Lead[] = await response.json();

        setLeads(data);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  const campaigns = useMemo(() => {
    const uniqueCampaigns = new Map<string, string>();

    leads.forEach((lead) => {
      if (lead.campaign) {
        uniqueCampaigns.set(
          lead.campaign.id,
          lead.campaign.campaignName,
        );
      }
    });

    return Array.from(uniqueCampaigns.entries());
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.name.toLowerCase().includes(searchValue) ||
        lead.email.toLowerCase().includes(searchValue) ||
        lead.campaign.campaignName
          .toLowerCase()
          .includes(searchValue);

      const matchesCampaign =
        campaignFilter === "all" ||
        lead.campaign.id === campaignFilter;

      return matchesSearch && matchesCampaign;
    });
  }, [leads, search, campaignFilter]);

  if (loading) {
    return (
      <section>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Leads
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            View leads captured from your campaigns.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading leads...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Lead Management
          </p>

          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            Leads
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            View and manage people who submitted your campaign forms.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Total Leads
          </p>

          <p className="mt-1 text-3xl font-bold text-indigo-900">
            {leads.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search name, email or campaign..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={campaignFilter}
          onChange={(event) => setCampaignFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All campaigns</option>

          {campaigns.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredLeads.length}
          </span>{" "}
          {filteredLeads.length === 1 ? "lead" : "leads"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <span className="text-xl">👥</span>
            </div>

            <h4 className="mt-4 font-semibold text-slate-900">
              {search || campaignFilter !== "all"
                ? "No matching leads"
                : "No leads yet"}
            </h4>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {search || campaignFilter !== "all"
                ? "Try changing your search or campaign filter."
                : "Leads captured from your campaign landing pages will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Lead
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Campaign
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Captured
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Lead */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {lead.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            Lead #{lead.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {lead.email}
                    </td>

                    {/* Campaign */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {lead.campaign.campaignName}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        lead.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}