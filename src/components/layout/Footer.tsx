import Link from "next/link";
import { categories, tools } from "@/data/tools";
import { SITE_NAME } from "@/data/site";
import {
  XSocialIcon,
} from "@/components/icons";

const socials = [
  { href: "https://twitter.com/creatortoolkit", label: "X (Twitter)", Icon: XSocialIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-base text-white shadow-sm">
                ⚡
              </span>
              {SITE_NAME}
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              The all-in-one toolbox for creators, writers, YouTubers, and
              developers. Free tools, built to run in your browser.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:text-violet-400"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/tools?category=${c.slug}`}
                    className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                  >
                    {c.icon} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Popular Tools
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {tools
                .filter((t) => t.featured)
                .slice(0, 6)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/tools"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/pro"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Sign in / Sign up
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-zinc-500 transition-colors hover:text-violet-600 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-400 sm:flex-row dark:border-zinc-800">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Made for creators. Free tools — no account required.
          </p>
        </div>
      </div>
    </footer>
  );
}
