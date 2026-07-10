import Navbar from "../../components/Navbar";
import DashboardHeader from "../../components/DashboardHeader";
import CampaignList from "../../components/CampaignList";


export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <DashboardHeader />
        <CampaignList />
      </div>
    </main>
  );
}