import { Button } from "./ui/button";

type CampaignCardProps = {
  id: string;
  campaignName: string;
  brandName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
};

export default function CampaignCard({
  id,
  campaignName,
  brandName,
  campaignGoal,
  targetAudience,
  budget,
}: CampaignCardProps) {
  
async function deleteCampaign() {
  const confirmed = confirm(
    "Are you sure you want to delete this campaign?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-bold">
        {campaignName}
      </h2>

      <p className="mt-3 text-gray-700">
        <span className="font-semibold">Brand:</span> {brandName}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Goal:</span> {campaignGoal}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Audience:</span> {targetAudience}
      </p>

      <p>
        <span className="font-semibold">
          Budget:
        </span>{" "}
        ₹{budget ?? "Not Set"}
      </p>

      <div className="mt-5 flex gap-3">
        <button className="rounded-md bg-black px-4 py-2 text-white">
          View
        </button>
        <Button
          variant="destructive"
          onClick={deleteCampaign}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}