import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitLife | AI Campaign Studio",
  description: "Discover the FitLife campaign.",
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}