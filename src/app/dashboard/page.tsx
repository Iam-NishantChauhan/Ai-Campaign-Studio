"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../../components/DashboardHeader";
import CampaignList from "../../components/CampaignList";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
  <main className="min-h-screen bg-gray-100">
    <DashboardHeader />

    <div className="max-w-6xl mx-auto p-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {user.name}
        </h1>

        <p className="text-gray-600">
          {user.email}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>

    {/* Dashboard navigation */}
    <div className="max-w-6xl mx-auto px-6 mb-6 flex gap-4">
      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50"
      >
        Campaigns
      </Link>

      <Link
        href="/dashboard/leads"
        className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50"
      >
        Leads
      </Link>

      <Link
        href="/dashboard/analytics"
        className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50"
      >
        Analytics
      </Link>
    </div>

    <CampaignList />
  </main>
  );
}