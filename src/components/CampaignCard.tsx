"use client";

import { useState } from "react";
import Link from "next/link";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { Button } from "./ui/button";
import { AiContent } from "@/types/campaign";

type CampaignCardProps = {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
  initialAiContents: AiContent[];
};

export default function CampaignCard({
  id,
  campaignName,
  brandName,
  productName,
  campaignGoal,
  targetAudience,
  budget,
  initialAiContents,
}: CampaignCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [aiContents, setAiContents] = useState(initialAiContents);
  const [selectedContent, setSelectedContent] = useState<AiContent | null>(
    initialAiContents[0] ?? null,
  );

  async function generateAiContent() {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate AI content");
      }

      setAiContents((currentContents) => [data, ...currentContents]);
      setSelectedContent(data);
    } catch (error) {
      console.error(error);
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Failed to generate AI content",
      );
    } finally {
      setIsGenerating(false);
    }
  }

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

        <Button onClick={generateAiContent} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate AI"}
        </Button>
      </div>

      {generationError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {generationError}
        </p>
      )}

      {selectedContent && (
        <section className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Generated AI content</h3>

          <div className="mt-4 space-y-4 text-gray-700">
            <ContentField label="Headline" value={selectedContent.headline} />
            <ContentField
              label="Instagram caption"
              value={selectedContent.instagramCaption}
            />
            <ContentField
              label="LinkedIn post"
              value={selectedContent.linkedinPost}
            />
            <ContentField
              label="Email subject"
              value={selectedContent.emailSubject}
            />
            <ContentField label="Email body" value={selectedContent.emailBody} />
            <ContentField
              label="Call to action"
              value={selectedContent.callToAction}
            />
          </div>

          <Link
            className="mt-5 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            href={`/dashboard/campaigns/${id}/landing?contentId=${selectedContent.id}`}
          >
            Preview landing page
          </Link>
        </section>
      )}

      {aiContents.length > 1 && (
        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer font-semibold">
            Previous generations ({aiContents.length - 1})
          </summary>

          <div className="mt-3 space-y-2">
            {aiContents.slice(1).map((content, index) => (
              <Button
                key={content.id}
                variant="outline"
                onClick={() => setSelectedContent(content)}
              >
                View generation {aiContents.length - index - 1}
              </Button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function ContentField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="font-semibold">{label}</h4>
      <p className="mt-1 whitespace-pre-wrap">{value}</p>
    </div>
  );
}
