import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use ${SITE_NAME}'s free tools, optional accounts, and developer API.`,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "/terms",
  },
};

const focusLink =
  "font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
        Legal
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-zinc-400">Last updated: September 19, 2026</p>
      <div className="mt-6 space-y-8 text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Acceptance of these terms
          </h2>
          <p className="mt-2">
            By using {SITE_NAME}, you agree to these Terms of Service. If you do
            not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            The service
          </h2>
          <p className="mt-2">
            {SITE_NAME} provides browser-based tools for working with text,
            files, images, and other content. The tools are free to use and do
            not require an account. Optional features — such as an account,
            saved projects, favorites, usage history, and the developer API —
            require an account and may in the future be offered through paid
            plans.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Accounts
          </h2>
          <p className="mt-2">
            When you create an account, you are responsible for keeping your
            credentials secure and for activity that happens under your
            account. You must provide accurate information. Passwords are
            stored as one-way hashes. If you believe your account has been
            compromised, change your password or use the password reset flow on
            the sign-in page. You may delete your account at any time from the
            dashboard, which removes your account data from the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Saved projects
          </h2>
          <p className="mt-2">
            If you choose to save a project, its title and content are stored on
            our servers and associated with your account so you can return to it
            later. You can delete saved projects at any time, and deleting your
            account removes them. Saved projects are handled as described in our{" "}
            <Link href="/privacy" className={focusLink}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Acceptable use
          </h2>
          <p className="mt-2">
            You agree not to misuse the service — for example, by attempting to
            disrupt it, circumvent rate limits or security controls, access
            another person&apos;s account, or use it to store or process content
            that you do not have the right to use. You are responsible for the
            content you bring to the tools and for how you use the output they
            produce.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Your content and tool output
          </h2>
          <p className="mt-2">
            We do not claim ownership of the content you bring to the tools or
            of the output those tools generate. You are free to use tool output
            in your own work, subject to applicable law and the rights of
            others.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Intellectual property
          </h2>
          <p className="mt-2">
            The service itself — including its software, design, text, and
            branding — is the property of the operator of {SITE_NAME}. Nothing
            in these terms grants you rights to the service beyond using it as
            intended.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Developer API
          </h2>
          <p className="mt-2">
            API keys are personal and must be kept secret. The API is subject to
            rate limits, which may change over time, and it is available only
            for the tools we choose to publish through it. Abusive or excessive
            use may result in a revoked key or suspended account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Third-party services
          </h2>
          <p className="mt-2">
            We rely on third-party providers, such as hosting and transactional
            email services, to operate {SITE_NAME}. Some tools load components
            from public content-delivery networks, in which case your browser
            may communicate with those providers. These providers have their
            own terms and policies that apply to their services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Service availability
          </h2>
          <p className="mt-2">
            We work to keep the service available and reliable, but we do not
            guarantee uninterrupted or error-free operation. Features, limits,
            and the set of available tools may change or be removed over time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Disclaimers
          </h2>
          <p className="mt-2">
            The service is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, whether express or implied. Tools are
            provided for convenience and should not be relied on as
            professional, legal, or financial advice. We do not guarantee that
            the service will be error-free or that every tool produces accurate
            results — review output before publishing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Limitation of liability
          </h2>
          <p className="mt-2">
            To the maximum extent permitted by law, {SITE_NAME} and its
            operators are not liable for indirect, incidental, or consequential
            damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Changes to these terms
          </h2>
          <p className="mt-2">
            We may update these terms as the service evolves. Changes will be
            reflected on this page with an updated date. Continuing to use the
            service after changes take effect means you accept the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Termination
          </h2>
          <p className="mt-2">
            We may suspend or terminate access for violations of these terms or
            misuse of the service. You may stop using the service at any time by
            closing your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Contact
          </h2>
          <p className="mt-2">
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className={focusLink}>
              {SITE_SUPPORT_EMAIL}
            </a>{" "}
            or use our{" "}
            <Link href="/contact" className={focusLink}>
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}