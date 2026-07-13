import CreateCampaignDialog from "./CreateCampaignDialog";
import { Button } from "./ui/button";

type CampaignCardProps = {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
};

export default function CampaignCard({
  id,
  campaignName,
  brandName,
  productName,
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

      alert("Campaign deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-bold">{campaignName}</h2>

      <p className="mt-3 text-gray-700">
        <span className="font-semibold">Brand:</span> {brandName}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Product:</span> {productName}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Goal:</span> {campaignGoal}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Audience:</span> {targetAudience}
      </p>

      <p className="text-gray-700">
        <span className="font-semibold">Budget:</span> ₹{budget}
      </p>

      <div className="mt-5 flex gap-3">
        <CreateCampaignDialog
          campaign={{
            id,
            campaignName,
            brandName,
            productName,
            campaignGoal,
            targetAudience,
            budget,
          }}
          trigger={<Button>Edit</Button>}
        />

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