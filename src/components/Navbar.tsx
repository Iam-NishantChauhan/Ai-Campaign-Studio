import CreateCampaignDialog from "./CreateCampaignDialog";

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold">
          AI Campaign Studio
        </h1>

        <CreateCampaignDialog />
      </div>
    </nav>
  );
}