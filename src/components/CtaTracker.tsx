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
      href="#lead-form"
      onClick={handleClick}
      className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
    >
      {children}
    </a>
  );
}