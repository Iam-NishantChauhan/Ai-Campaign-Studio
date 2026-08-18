"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CampaignList from "../../components/CampaignList";
import LeadsPanel from "../../components/LeadsPanel";
import AnalyticsPanel from "../../components/AnalyticsPanel";

type User = {
  id: string;
  name: string;
  email: string;
};

type Tab = "campaigns" | "leads" | "analytics";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      alert(data.message);
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              AI
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Campaign Studio
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                AI-powered marketing campaigns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {user.name} 👋
          </h2>

          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "campaigns"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Campaigns
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "leads"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Leads
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "analytics"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Campaigns */}
        {activeTab === "campaigns" && (
          <section>
            <CampaignList />
          </section>
        )}

        {/* Leads */}
        {activeTab === "leads" && <LeadsPanel />}

        {/* Analytics */}
        {activeTab === "analytics" && <AnalyticsPanel />}
      </div>
    </main>
  );
}
