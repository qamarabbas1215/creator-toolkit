import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} — support, feedback, bug reports, and tool requests.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "/contact",
  },
};

const focusButton =
  "inline-flex h-11 items-center rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 px-6 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950";

const focusLink =
  "font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Get in touch
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Contact {SITE_NAME}
      </h1>
      <div className="mt-6 space-y-5 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
        <p>
          We love hearing from creators. Whether it&apos;s a tool you wish
          existed, a bug you spotted, or feedback on something we built, drop
          us a line.
        </p>
        <div className="mt-10">
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className={focusButton}>
            Email {SITE_SUPPORT_EMAIL}
          </a>
        </div>
        <p className="text-sm text-zinc-400">
          We typically reply within a few business days. Please include the
          tool you were using and what you expected to happen.
        </p>
        <p className="text-sm text-zinc-400">
          Looking for a quick answer first? Check the{" "}
          <Link href="/faq" className={focusLink}>
            FAQ
          </Link>{" "}
          — it covers how the tools work, accounts, saved projects, and more.
        </p>
      </div>
    </div>
  );
}