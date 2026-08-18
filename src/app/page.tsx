"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AI Campaign Studio
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
              AI-powered marketing platform
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Create campaigns.
              <span className="block text-indigo-400">
                Generate content.
              </span>
              Capture leads.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              AI Campaign Studio helps you create marketing campaigns,
              generate AI-powered content, publish campaign landing pages,
              capture leads, and track campaign activity.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                Get Started →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>✓ Campaign Management</span>
              <span>✓ AI Content</span>
              <span>✓ Lead Tracking</span>
              <span>✓ Analytics</span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-6 text-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      Campaign
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Summer Product Launch
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      AI Campaign Studio
                    </p>
                  </div>

                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                    ₹50,000
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Goal
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Increase product sales
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Audience
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Young professionals
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      AI Generated
                    </p>

                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
                      AI
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold">
                    Unlock Your Best Summer Yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create engaging social, email and campaign content with
                    AI-generated marketing ideas.
                  </p>

                  <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              From campaign idea to measurable leads.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <FeatureCard
              title="AI Content Generation"
              description="Generate headlines, social posts, email content and calls to action using AI."
            />

            <FeatureCard
              title="Campaign Landing Pages"
              description="Every campaign gets its own dynamic public landing page."
            />

            <FeatureCard
              title="Leads & Analytics"
              description="Capture visitor information and monitor campaign activity from your dashboard."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Ready to build your next campaign?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Create an account and start building AI-powered campaigns.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Create Your Account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AI Campaign Studio
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        ✦
      </div>

      <h3 className="text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}