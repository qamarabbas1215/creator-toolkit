import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ProUpgrade } from "@/components/pro/ProUpgrade";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Pro",
  description: `Upgrade to ${SITE_NAME} Pro for advanced creator tools and priority features.`,
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
        <span className="text-5xl">⚡</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {SITE_NAME} Pro
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
          Everything you need to create faster. Pro unlocks advanced tools,
          higher limits, and early access to new features.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-2xl">{b.icon}</span>
            <h2 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {b.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 text-center dark:border-violet-900 dark:from-violet-950/50 dark:to-fuchsia-950/40">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Pro — coming soon
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-300">
          We are working on international payment options so creators
          everywhere can join. Subscribe to get updates, or explore all the
          free tools right now.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ProUpgrade signedIn={!!user} />
          <Link
            href="/tools"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-100 px-5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Browse free tools
          </Link>
        </div>
      </div>
    </div>
  );
}
