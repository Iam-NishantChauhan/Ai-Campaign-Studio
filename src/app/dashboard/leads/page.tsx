"use client";

import { useEffect, useState } from "react";

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/leads");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();

        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>

        <p className="mt-2 text-gray-500">
          View leads captured from your campaigns.
        </p>
      </div>

      <div className="mb-6 rounded-lg border p-6">
        <p className="text-sm text-gray-500">
          Total Leads
        </p>

        <p className="mt-2 text-3xl font-bold">
          {leads.length}
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">
            No leads captured yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Campaign</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b last:border-b-0"
                >
                  <td className="p-4">
                    {lead.name}
                  </td>

                  <td className="p-4">
                    {lead.email}
                  </td>

                  <td className="p-4">
                    {lead.campaign.campaignName}
                  </td>

                  <td className="p-4">
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}