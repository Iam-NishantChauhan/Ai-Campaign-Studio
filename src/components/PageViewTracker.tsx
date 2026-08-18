"use client";

import { useEffect } from "react";

type PageViewTrackerProps = {
  campaignId: string;
};

export default function PageViewTracker({
  campaignId,
}: PageViewTrackerProps) {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaignId,
            eventType: "PAGE_VIEW",
          }),
        });
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [campaignId]);

  return null;
}