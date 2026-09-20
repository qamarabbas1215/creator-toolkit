import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${SITE_NAME} — is it free, which tools need an account, what happens to your content, saved projects, the developer API, and how to get support.`,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    url: "/faq",
  },
};

const focusLink =
  "font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40";

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-5 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
      {children}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800">
      <h3 className="py-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <Answer>{children}</Answer>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Help
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Frequently asked questions
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Short answers about how {SITE_NAME} works, what it stores, and how to
        get help.
      </p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Using the tools
      </h2>
      <div className="mt-4">
        <Question title="Is Creator Toolkit free?">
          <p>
            Yes. Every tool is free to use and no account is required to run
            them. Optional features — such as an account, saved projects,
            favorites, and API keys — are included on the free plan. A paid Pro
            plan is planned for the future, and it would only affect those
            optional features, never the core tools.
          </p>
        </Question>
        <Question title="Do I need an account?">
          <p>
            No. All tools work without an account. Signing in adds optional,
            account-backed features: saving projects to your dashboard,
            marking favorites, keeping usage history, and creating developer
            API keys.
          </p>
        </Question>
        <Question title="Which tools work without an account?">
          <p>
            All of them. Signing in unlocks extra features alongside the tools;
            it is never required to use a tool itself.
          </p>
        </Question>
        <Question title="Does my text stay in my browser?">
          <p>
            For the vast majority of tools, yes — text, prompts, and files are
            processed locally by client-side JavaScript and never leave your
            device. A few things do involve our servers: when you explicitly
            save a project, when you send a request through the developer API,
            and (if you are signed in) a record of which tool pages you visit —
            never the content you enter. Some tools also load code libraries
            from a public content-delivery network, which means your browser
            may contact that CDN while the page is open.
          </p>
        </Question>
        <Question title="Are files uploaded?">
          <p>
            No. Files you work with — such as merging PDFs or running OCR — are
            processed in your browser and are not uploaded to our servers.
            Content is only sent to us if you deliberately save a project or
            submit a request through the developer API.
          </p>
        </Question>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Accounts and your data
      </h2>
      <div className="mt-4">
        <Question title="What information is stored with my account?">
          <p>
            Your name, email address, and a securely hashed password. We also
            store things you create with the account: saved projects,
            favorites, API keys (as hashes), and a simple record of which tool
            pages you visit. Sign-in sessions last up to 30 days. See the{" "}
            <Link href="/privacy" className={focusLink}>
              Privacy Policy
            </Link>{" "}
            for the full list.
          </p>
        </Question>
        <Question title="What happens when I save a project?">
          <p>
            The project title and content are stored on our servers and linked
            to your account so you can reopen them later from your dashboard.
            You can rename or delete saved projects at any time, and deleting
            your account removes them from the service.
          </p>
        </Question>
        <Question title="How does email verification work?">
          <p>
            When you register, we send a one-time verification link to the email
            you provide. The link is valid for 24 hours and activates your
            account when opened. If it expires, you can request a new one from
            the verification page.
          </p>
        </Question>
        <Question title="How does password reset work?">
          <p>
            On the forgot-password page, enter your account email and we will
            send you a short verification code. The code is valid for 10 minutes
            and can only be used once. Enter it to choose a new password.
          </p>
        </Question>
        <Question title="Is analytics enabled?">
          <p>
            By default, no third-party analytics scripts are loaded. Third-party
            analytics such as Google Analytics or PostHog are only enabled when
            the site operator configures them for a deployment, and none are
            enabled right now. Separately, when you are signed in, we keep
            simple first-party records of which tool pages you visit so we can
            understand usage and improve the site. If we ever enable third-party
            analytics, we will update the Privacy Policy first and ask for
            consent where required.
          </p>
        </Question>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        API and support
      </h2>
      <div className="mt-4">
        <Question title="How does the developer API work?">
          <p>
            Create an API key in Account settings → API Keys, then send it in an{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
              X-API-Key
            </code>{" "}
            header when you call{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
              POST /api/v1/tools/&#123;slug&#125;/run
            </code>
            . Keys are shown once at creation and can be revoked at any time.
            Free accounts are limited to 60 requests per hour; the API is
            available only for the deterministic tools published through it.
          </p>
        </Question>
        <Question title="How can I contact support?">
          <p>
            Use our{" "}
            <Link href="/contact" className={focusLink}>
              contact page
            </Link>{" "}
            or email us directly at{" "}
            <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className={focusLink}>
              {SITE_SUPPORT_EMAIL}
            </a>
            . We usually reply within a few business days.
          </p>
        </Question>
      </div>

      <p className="mt-10 text-sm text-zinc-400">
        Still have questions? Read the{" "}
        <Link href="/privacy" className={focusLink}>
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className={focusLink}>
          Terms of Service
        </Link>{" "}
        for more detail.
      </p>
    </div>
  );
}