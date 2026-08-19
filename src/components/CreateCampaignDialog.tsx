"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  campaignSchema,
  CampaignFormData,
} from "@/validations/campaign.schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Campaign } from "@/types/campaign";

type EditableCampaign = {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
};

type CreateCampaignDialogProps = {
  campaign?: EditableCampaign;
  trigger?: React.ReactNode;

  /**
   * Called after successful CREATE or UPDATE.
   * The updated/created campaign is returned.
   */
  onSuccess?: (campaign: Campaign) => void;
};

export default function CreateCampaignDialog({
  campaign,
  trigger,
  onSuccess,
}: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),

    defaultValues: {
      campaignName: "",
      brandName: "",
      productName: "",
      campaignGoal: "",
      targetAudience: "",
      budget: 0,
    },
  });

  /*
   * Populate form when editing.
   *
   * Notice:
   * We DO NOT call setMessage() or setMessageType()
   * inside this effect.
   */
  useEffect(() => {
    if (campaign) {
      reset({
        campaignName: campaign.campaignName,
        brandName: campaign.brandName,
        productName: campaign.productName,
        campaignGoal: campaign.campaignGoal,
        targetAudience: campaign.targetAudience,
        budget: campaign.budget,
      });
    } else {
      reset({
        campaignName: "",
        brandName: "",
        productName: "",
        campaignGoal: "",
        targetAudience: "",
        budget: 0,
      });
    }
  }, [campaign, reset]);

  function handleDialogChange(value: boolean) {
    setOpen(value);

    if (value) {
      setMessage("");
      setMessageType("");
    }
  }

  async function onSubmit(data: CampaignFormData) {
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        campaign
          ? `/api/campaigns/${campaign.id}`
          : "/api/campaigns",
        {
          method: campaign ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            (campaign
              ? "Failed to update campaign"
              : "Failed to create campaign"),
        );
      }

      /*
       * IMPORTANT
       *
       * Your API should return the created/updated
       * campaign object.
       *
       * Example:
       *
       * {
       *   id,
       *   campaignName,
       *   ...
       *   aiContents: []
       * }
       */

      const savedCampaign = result as Campaign;

      setMessage(
        campaign
          ? "Campaign updated successfully!"
          : "Campaign created successfully!",
      );

      setMessageType("success");

      /*
       * Update parent state immediately.
       *
       * NO window.location.reload()
       */
      onSuccess?.(savedCampaign);

      /*
       * Close dialog after showing success message.
       */
      setTimeout(() => {
        setOpen(false);

        setMessage("");
        setMessageType("");

        if (!campaign) {
          reset();
        }
      }, 800);
    } catch (error) {
      console.error("Campaign save failed:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setMessageType("error");
    }
  }

  const inputClass =
    "mt-2 h-11 rounded-lg border-slate-200 bg-slate-50 px-3 text-sm shadow-sm transition focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const errorClass =
    "mt-1.5 text-xs font-medium text-red-500";

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogChange}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="rounded-lg bg-indigo-600 px-5 font-semibold shadow-sm hover:bg-indigo-700">
            + New Campaign
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-slate-200 bg-white p-0 shadow-2xl sm:max-w-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-white px-7 py-6">
          <DialogHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
              ✨
            </div>

            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {campaign
                ? "Edit Campaign"
                : "Create Campaign"}
            </DialogTitle>

            <p className="mt-1 text-sm text-slate-500">
              {campaign
                ? "Update your campaign details and settings."
                : "Set up your campaign and let AI create the marketing content."}
            </p>
          </DialogHeader>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-7 py-6"
        >
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Campaign Information
            </h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {/* Campaign Name */}
              <div className="sm:col-span-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Campaign Name
                </Label>

                <Input
                  {...register("campaignName")}
                  placeholder="e.g. Summer Product Launch"
                  className={inputClass}
                />

                {errors.campaignName?.message && (
                  <p className={errorClass}>
                    {errors.campaignName.message}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  Brand Name
                </Label>

                <Input
                  {...register("brandName")}
                  placeholder="e.g. Nike"
                  className={inputClass}
                />

                {errors.brandName?.message && (
                  <p className={errorClass}>
                    {errors.brandName.message}
                  </p>
                )}
              </div>

              {/* Product */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  Product Name
                </Label>

                <Input
                  {...register("productName")}
                  placeholder="e.g. Air Max"
                  className={inputClass}
                />

                {errors.productName?.message && (
                  <p className={errorClass}>
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Goal */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  Campaign Goal
                </Label>

                <Input
                  {...register("campaignGoal")}
                  placeholder="e.g. Increase product sales"
                  className={inputClass}
                />

                {errors.campaignGoal?.message && (
                  <p className={errorClass}>
                    {errors.campaignGoal.message}
                  </p>
                )}
              </div>

              {/* Audience */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  Target Audience
                </Label>

                <Input
                  {...register("targetAudience")}
                  placeholder="e.g. Young professionals"
                  className={inputClass}
                />

                {errors.targetAudience?.message && (
                  <p className={errorClass}>
                    {errors.targetAudience.message}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  Budget
                </Label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ₹
                  </span>

                  <Input
                    type="number"
                    {...register("budget", {
                      valueAsNumber: true,
                    })}
                    placeholder="50000"
                    className={`${inputClass} pl-8`}
                  />
                </div>

                {errors.budget?.message && (
                  <p className={errorClass}>
                    {errors.budget.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Success / Error Message */}
          {message && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="rounded-lg border-slate-200 px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-6 font-semibold shadow-sm hover:bg-indigo-700"
            >
              {isSubmitting
                ? campaign
                  ? "Updating..."
                  : "Creating..."
                : campaign
                  ? "Update Campaign"
                  : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}