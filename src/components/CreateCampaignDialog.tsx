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
        campaign
          ? `/api/campaigns/${campaign.id}`
          : "/api/campaigns",
        {
          method: campaign ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          campaign
            ? "Failed to update campaign"
            : "Failed to create campaign"
        );
      }

      alert(
        campaign
          ? "Campaign Updated Successfully!"
          : "Campaign Created Successfully!"
      );

      setOpen(false);
      reset();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>+ New Campaign</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {campaign ? "Edit Campaign" : "Create Campaign"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 mt-4"
        >
          <div>
            <Label>Campaign Name</Label>
            <Input {...register("campaignName")} />
            <p className="text-red-500 text-sm">
              {errors.campaignName?.message}
            </p>
          </div>

          <div>
            <Label>Brand Name</Label>
            <Input {...register("brandName")} />
            <p className="text-red-500 text-sm">
              {errors.brandName?.message}
            </p>
          </div>

          <div>
            <Label>Product Name</Label>
            <Input {...register("productName")} />
            <p className="text-red-500 text-sm">
              {errors.productName?.message}
            </p>
          </div>

          <div>
            <Label>Campaign Goal</Label>
            <Input {...register("campaignGoal")} />
            <p className="text-red-500 text-sm">
              {errors.campaignGoal?.message}
            </p>
          </div>

          <div>
            <Label>Target Audience</Label>
            <Input {...register("targetAudience")} />
            <p className="text-red-500 text-sm">
              {errors.targetAudience?.message}
            </p>
          </div>

          <div>
            <Label>Budget</Label>

            <Input
              type="number"
              {...register("budget", {
                valueAsNumber: true,
              })}
            />

            <p className="text-red-500 text-sm">
              {errors.budget?.message}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? campaign
                ? "Updating..."
                : "Creating..."
              : campaign
              ? "Update Campaign"
              : "Create Campaign"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}