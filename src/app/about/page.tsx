import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — a free, private toolbox for creators.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description: `About ${SITE_NAME} — a free, private toolbox for creators.`,
    url: "/about",
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Our story
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        About {SITE_NAME}
      </h1>
      <div className="mt-6 space-y-5 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
        <p>
          {SITE_NAME} is a collection of free tools built for content creators —
          writers, YouTubers, social media managers, SEOs, and developers who
          ship content every day.
        </p>
        <p>
          Most tools run right in your browser — the text, prompts, and files
          you work with are processed on your device. Optional features such as
          saved projects, favorites, and our developer API store data on our
          servers. See our{" "}
          <Link href="/privacy" className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <p>
          We&apos;re constantly adding new tools and improving the ones we have.
          If there&apos;s a tool you wish existed, we&apos;d love to hear from you —
          reach out through our{" "}
          <Link href="/contact" className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
            contact page
          </Link>
          . We love shipping the small things that save creators hours.
        </p>
      </div>
      <div className="mt-10">
        <Link
          href="/tools"
          className="inline-flex h-11 items-center rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 px-6 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-600/30"
        >
          Browse all tools
        </Link>
      </div>
    </main>
  );
}
