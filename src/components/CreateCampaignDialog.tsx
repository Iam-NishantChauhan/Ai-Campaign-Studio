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

type Campaign = {
  id: string;
  campaignName: string;
  brandName: string;
  productName: string;
  campaignGoal: string;
  targetAudience: string;
  budget: number;
};

type CreateCampaignDialogProps = {
  campaign?: Campaign;
  trigger?: React.ReactNode;
};

export default function CreateCampaignDialog({
  campaign,
  trigger,
}: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);

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

  async function onSubmit(data: CampaignFormData) {
    try {
      const response = await fetch(
        campaign ? `/api/campaigns/${campaign.id}` : "/api/campaigns",
        {
          method: campaign ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(
          campaign ? "Failed to update campaign" : "Failed to create campaign",
        );
      }

      alert(
        campaign
          ? "Campaign Updated Successfully!"
          : "Campaign Created Successfully!",
      );

      setOpen(false);
      reset();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  const inputClass =
    "mt-2 h-11 rounded-lg border-slate-200 bg-slate-50 px-3 text-sm shadow-sm transition focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const errorClass = "mt-1.5 text-xs font-medium text-red-500";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              {campaign ? "Edit Campaign" : "Create Campaign"}
            </DialogTitle>

            <p className="mt-1 text-sm text-slate-500">
              {campaign
                ? "Update your campaign details and settings."
                : "Set up your campaign and let AI create the marketing content."}
            </p>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-7 py-6">
          {/* Campaign Information */}
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
                  <p className={errorClass}>{errors.campaignName.message}</p>
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
                  <p className={errorClass}>{errors.brandName.message}</p>
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
                  <p className={errorClass}>{errors.productName.message}</p>
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
                  <p className={errorClass}>{errors.campaignGoal.message}</p>
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
                  <p className={errorClass}>{errors.targetAudience.message}</p>
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
                  <p className={errorClass}>{errors.budget.message}</p>
                )}
              </div>
            </div>
          </div>

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
