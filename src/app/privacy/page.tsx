import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME} — what we store, what stays in your browser, and your choices about your data.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Legal
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Privacy Policy
      </h1>
      <div className="mt-6 space-y-8 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Short version
          </h2>
          <p className="mt-2">
            {SITE_NAME}&apos;s tools process your text, prompts, and files
            locally in your browser. We store data on our servers only when you
            use optional features such as an account, saved projects,
            favorites, or our developer API. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            What happens to the content you use in tools
          </h2>
          <p className="mt-2">
            When you use a tool, the text, prompts, or files you enter are
            processed on your device by client-side JavaScript. For the vast
            majority of tools, that content never leaves your browser.
          </p>
          <p className="mt-2">
            Two optional features transmit content to our servers:{" "}
            <strong>saved projects</strong> (when you explicitly save a project
            to your account) and the{" "}
            <strong>developer API</strong> (which processes requests sent by
            API clients). Any other sharing is done by your browser through the
            mechanism you choose (for example, copying, downloading, or linking
            to an external service) and is not handled by us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Data we collect
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Account information.</strong> If you create an account, we
              store your name, email address, and a securely hashed password.
            </li>
            <li>
              <strong>Session information.</strong> When you sign in, we create
              a session so you stay signed in. Sessions expire after 30 days.
            </li>
            <li>
              <strong>Saved projects.</strong> Projects you choose to save are
              stored on our servers, including the title and content you
              provide.
            </li>
            <li>
              <strong>Favorites.</strong> Tools you mark as favorites are
              associated with your account.
            </li>
            <li>
              <strong>Usage information.</strong> If you are signed in, we
              record which tools you visit and how often, to understand what is
              useful and improve the service.
            </li>
            <li>
              <strong>API keys and request logs.</strong> If you create an API
              key, we store a hashed version of it and record requests made
              with it, including the tool called, the response status, and the
              IP address of the requester.
            </li>
            <li>
              <strong>Account recovery data.</strong> When you verify your email
              or reset your password, we store a short-lived, hashed token with
              a limited lifetime.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            How we use your data
          </h2>
          <p className="mt-2">
            We use your data to provide the service: to authenticate you, to
            save and sync your projects and favorites, to deliver account
            email, to enforce fair use of the API, and to understand aggregate
            usage so we can build better tools. We do not sell your personal
            data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Cookies and local storage
          </h2>
          <p className="mt-2">
            If you sign in, a cookie holds your session identifier. It is
            HTTP-only, and in production it is sent over a secure connection.
            We may use local storage to remember preferences such as your
            theme.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Email
          </h2>
          <p className="mt-2">
            When you create an account, verify your email, or reset your
            password, we send transactional emails through a third-party email
            provider.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Analytics
          </h2>
          <p className="mt-2">
            We aim to operate without invasive analytics. Site-wide analytics
            are currently disabled. If we enable third-party analytics in the
            future, we will update this policy first and, where required, ask
            for your consent before loading them.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Third-party services
          </h2>
          <p className="mt-2">
            The service and its databases are hosted with cloud infrastructure
            providers. Transactional email is delivered through a third-party
            email provider. Some tools load components such as PDF and video
            processing runtimes from a public content-delivery network; in
            those cases your browser may communicate with the CDN.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Data retention
          </h2>
          <p className="mt-2">
            Sessions expire after 30 days. Email verification tokens expire
            after 24 hours and password-reset tokens after 10 minutes.
            Rate-limit records are retained only long enough to enforce fair
            use. Deleting your account removes your account data from the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Your choices and control
          </h2>
          <p className="mt-2">
            You can sign out, manage or delete your projects and favorites, and
            delete your account from the dashboard at any time. To delete your
            account or ask questions about your data, contact us using the
            details below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Security
          </h2>
          <p className="mt-2">
            Passwords are stored using a salted, slow hashing function. Session
            cookies are HTTP-only, and account and recovery tokens are hashed
            before storage. No method of transmission or storage is completely
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Children&apos;s privacy
          </h2>
          <p className="mt-2">
            The service is not directed to children under 13, and we do not
            knowingly collect personal information from them.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this policy as the service evolves. Significant
            changes will be reflected on this page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Contact
          </h2>
          <p className="mt-2">
            Questions about this policy or your data? Email us at{" "}
            <a
              href={`mailto:${SITE_SUPPORT_EMAIL}`}
              className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
            >
              {SITE_SUPPORT_EMAIL}
            </a>{" "}
            or use our{" "}
            <Link href="/contact" className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}