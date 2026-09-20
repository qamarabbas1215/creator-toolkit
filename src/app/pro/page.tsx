import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ProUpgrade } from "@/components/pro/ProUpgrade";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Pro",
  description: `Upgrade to ${SITE_NAME} Pro for advanced creator tools and priority features.`,
  alternates: {
    canonical: "/pro",
  },
  openGraph: {
    title: `${SITE_NAME} Pro`,
    description: `Upgrade to ${SITE_NAME} Pro for advanced creator tools and priority features.`,
    url: "/pro",
    siteName: SITE_NAME,
    type: "website",
  },
};

const BENEFITS = [
  { icon: "⚡", title: "Priority tools", text: "Get early access to new tools before anyone else." },
  { icon: "🔒", title: "Private & secure", text: "Your files and data stay in your browser. No uploads, ever." },
  { icon: "🎯", title: "Advanced features", text: "High-volume conversions, batch limits lifted, and more." },
  { icon: "💬", title: "Support", text: "Direct support and feature requests from the roadmap." },
  { icon: "📈", title: "Creator analytics", text: "Track your most-used tools and saved prompts." },
  { icon: "🚫", title: "No ads", text: "A clean, focused experience with no distractions." },
];

export default async function ProPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl text-white shadow-glow">
          ⚡
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Creator Toolkit Pro
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          Create faster. Go Pro.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
          Everything you need to create faster. Pro unlocks advanced tools,
          higher limits, and early access to new features.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-sm">
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-white p-8 shadow-pop dark:border-violet-800 dark:bg-zinc-900">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Pro plan
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Soon
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            We are setting up international payments so creators everywhere
            can join.
          </p>
          <div className="mt-6 flex justify-center">
            <ProUpgrade signedIn={!!user} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg dark:from-violet-500/20 dark:to-fuchsia-500/20">
              {b.icon}
            </span>
            <h2 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {b.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/tools"
          className="inline-flex h-11 items-center rounded-lg bg-zinc-100 px-5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          Browse all free tools
        </Link>
      </div>
    </div>
  );
}
