import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import PageViewTracker from "@/components/PageViewTracker";
import CtaTracker from "@/components/CtaTracker";

type LandingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ contentId?: string | string[] }>;
};

export default async function CampaignLandingPage({
  params,
  searchParams,
}: LandingPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const { contentId } = await searchParams;
  const selectedContentId = Array.isArray(contentId) ? contentId[0] : contentId;

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      aiContents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  const content = selectedContentId
    ? campaign.aiContents.find((item) => item.id === selectedContentId)
    : campaign.aiContents[0];

  if (selectedContentId && !content) {
    notFound();
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            {campaign.brandName}
          </p>
          <h1 className="mt-3 text-3xl font-bold">No AI content yet</h1>
          <p className="mt-3 text-slate-600">
            Generate campaign content before previewing this landing page.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PageViewTracker campaignId={campaign.id} />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <p className="text-lg font-bold">{campaign.brandName}</p>
        <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Back to dashboard
        </Link>
      </header>

      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            {campaign.productName}
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            {content.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Created for {campaign.targetAudience}.
          </p>
          <CtaTracker campaignId={campaign.id}>
  {content.callToAction}
</CtaTracker>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2">
        <ContentPanel title="Instagram" text={content.instagramCaption} />
        <ContentPanel title="LinkedIn" text={content.linkedinPost} />
      </section>

      <section id="campaign-email" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-indigo-50 p-8 ring-1 ring-indigo-100">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-700">
            {content.emailSubject}
          </p>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
            {content.emailBody}
          </p>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold">Stay in the loop</h2>
          <p className="mt-2 text-slate-600">
            Share your details to receive updates from {campaign.brandName}.
          </p>
          <LeadCaptureForm
            campaignId={campaign.id}
            brandName={campaign.brandName}
          />
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-slate-500">
        {campaign.campaignName} by {campaign.brandName}
      </footer>
    </main>
  );
}

function ContentPanel({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
        {text}
      </p>
    </article>
  );
}
