"use client";

type CtaTrackerProps = {
  campaignId: string;
  children: React.ReactNode;
};

export default function CtaTracker({
  campaignId,
  children,
}: CtaTrackerProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          eventType: "CTA_CLICK",
        }),
      });
    } catch (error) {
      console.error("Failed to track CTA click:", error);
    }
  };

  return (
    <a
      href="#campaign-email"
      onClick={handleClick}
      className="mt-8 inline-flex rounded-md bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-slate-200"
    >
      {children}
    </a>
  );
}