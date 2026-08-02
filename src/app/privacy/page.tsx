import type { Metadata } from "next";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Privacy Policy
      </h1>
      <div className="mt-6 space-y-8 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Short version
          </h2>
          <p className="mt-2">
            {SITE_NAME} is built to be private. Our tools process your text
            entirely in your browser — we don&apos;t upload, store, or read it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            What we do with your data
          </h2>
          <p className="mt-2">
            Nothing. When you use a tool, the text you paste is processed
            locally on your device using client-side JavaScript. It never
            leaves your browser, so there is nothing for us (or anyone else) to
            store or sell.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Local storage
          </h2>
          <p className="mt-2">
            We use your browser&apos;s local storage only for preferences such as
            your theme choice (light or dark). No personal data is stored.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Analytics
          </h2>
          <p className="mt-2">
            We aim to operate without invasive tracking. If aggregate,
            privacy-friendly analytics are added in the future, this policy will
            be updated first.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Changes
          </h2>
          <p className="mt-2">
            We may update this policy as the service evolves. Significant
            changes will be reflected on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
