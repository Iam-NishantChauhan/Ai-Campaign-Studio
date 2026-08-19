"use client";

import { useState } from "react";
import Link from "next/link";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { Button } from "./ui/button";
import { AiContent, Campaign } from "@/types/campaign";

type CampaignCardProps = {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
  initialAiContents?: AiContent[];

  // Called after campaign is updated
  onUpdated?: (campaign: Campaign) => void;

  // Called after campaign is deleted
  onDeleted?: (campaignId: string) => void;
};

export default function CampaignCard({
  id,
  campaignName,
  brandName,
  productName,
  campaignGoal,
  targetAudience,
  budget,
  initialAiContents = [],
  onUpdated,
  onDeleted,
}: CampaignCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // Make sure AI contents is always an array
  const safeAiContents = Array.isArray(initialAiContents)
    ? initialAiContents
    : [];

  const [aiContents, setAiContents] =
    useState<AiContent[]>(safeAiContents);

  const [selectedContent, setSelectedContent] =
    useState<AiContent | null>(safeAiContents[0] ?? null);

  const [latestContent, setLatestContent] =
    useState<AiContent | null>(safeAiContents[0] ?? null);

  // --------------------------------------------------
  // Generate AI Content
  // --------------------------------------------------

  async function generateAiContent() {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate AI content",
        );
      }

      setAiContents((current) => [data, ...current]);
      setLatestContent(data);
      setSelectedContent(data);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Failed to generate AI content",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  // --------------------------------------------------
  // Delete Campaign
  // --------------------------------------------------

  async function deleteCampaign() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteMessage("");

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete campaign",
        );
      }

      /*
       * IMPORTANT:
       * Do NOT reload the page.
       *
       * Tell CampaignList to remove this campaign
       * from its local state.
       */
      onDeleted?.(id);
    } catch (error) {
      console.error(
        "Failed to delete campaign:",
        error,
      );

      setDeleteMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the campaign.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // --------------------------------------------------
  // Campaign Updated
  // --------------------------------------------------

  function handleUpdated(updatedCampaign: Campaign) {
    /*
     * Send updated campaign back to CampaignList.
     *
     * CampaignList will replace the old campaign
     * without refreshing the page.
     */
    onUpdated?.(updatedCampaign);
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                Campaign
              </span>

              {aiContents.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  AI Ready
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
              {campaignName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {brandName}
              <span className="mx-1">•</span>
              {productName}
            </p>
          </div>

          {/* Budget */}
          <div className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Budget
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              ₹{budget.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Campaign details */}
      <div className="px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Campaign Goal"
            value={campaignGoal}
          />

          <InfoItem
            label="Target Audience"
            value={targetAudience}
          />
        </div>

        {/* Delete error */}
        {deleteMessage && (
          <p
            className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
            role="alert"
          >
            {deleteMessage}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {/* Edit */}
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
            onSuccess={handleUpdated}
            trigger={
              <Button
                variant="outline"
                className="border-slate-200"
                disabled={isDeleting}
              >
                Edit
              </Button>
            }
          />

          {/* Delete */}
          <Button
            variant="destructive"
            onClick={deleteCampaign}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>

          {/* Generate AI */}
          <Button
            onClick={generateAiContent}
            disabled={isGenerating || isDeleting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isGenerating
              ? "Generating..."
              : "✨ Generate AI"}
          </Button>

          {/* Landing Page */}
          {selectedContent && (
            <Link
              href={`/campaign/${id}`}
              target="_blank"
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Landing Page →
            </Link>
          )}
        </div>

        {/* Generation error */}
        {generationError && (
          <p
            className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
            role="alert"
          >
            {generationError}
          </p>
        )}

        {/* AI Content */}
        {selectedContent && (
          <section className="mt-7 overflow-hidden rounded-2xl border border-indigo-100 bg-slate-50">
            <div className="flex items-center justify-between border-b border-indigo-100 bg-white px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  AI Generated
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Campaign Content
                </h3>
              </div>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                AI
              </span>
            </div>

            <div className="grid gap-4 p-5">
              <ContentField
                label="Headline"
                value={selectedContent.headline}
              />

              <ContentField
                label="Instagram Caption"
                value={selectedContent.instagramCaption}
              />

              <ContentField
                label="LinkedIn Post"
                value={selectedContent.linkedinPost}
              />

              <ContentField
                label="Email Subject"
                value={selectedContent.emailSubject}
              />

              <ContentField
                label="Email Body"
                value={selectedContent.emailBody}
              />

              <ContentField
                label="Call to Action"
                value={selectedContent.callToAction}
              />
            </div>
          </section>
        )}

        {/* Previous generations */}
        {aiContents.length > 1 && (
          <details className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            <summary className="cursor-pointer bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Previous generations ({aiContents.length - 1})
            </summary>

            <div className="flex flex-wrap gap-2 p-4">
              {/* Latest */}
              {latestContent &&
                selectedContent?.id !== latestContent.id && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      setSelectedContent(latestContent)
                    }
                  >
                    Latest
                  </Button>
                )}

              {/* Previous generations */}
              {aiContents.slice(1).map((content, index) => (
                <Button
                  key={content.id}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedContent(content)
                  }
                >
                  Generation{" "}
                  {aiContents.length - index - 1}
                </Button>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------
// Info Item
// --------------------------------------------------

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

// --------------------------------------------------
// Content Field
// --------------------------------------------------

function ContentField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}