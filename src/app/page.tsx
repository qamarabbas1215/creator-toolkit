import Link from "next/link";
import type { Metadata } from "next";
import { categories, featuredTools, newTools, tools, trendingTools } from "@/data/tools";
import { SITE_DESCRIPTION } from "@/data/site";
import { HomeSearch } from "@/components/home/HomeSearch";
import { ToolCard } from "@/components/tools/ToolCard";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  SparklesIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Free Tools for Content Creators",
  description: SITE_DESCRIPTION,
};

const popularQuickLinks = [
  "case-converter",
  "youtube-title-generator",
  "hashtag-generator",
  "keyword-density",
  "json-formatter",
];

const whyPoints = [
  {
    title: "100% free, forever",
    description: "Every tool is free with no sign-up, no limits, and no hidden paywalls.",
  },
  {
    title: "Private by design",
    description: "Everything runs in your browser. Your text never leaves your device.",
  },
  {
    title: "Fast & reliable",
    description: "Zero waiting, zero page reloads. Type and results appear instantly.",
  },
];

const blogPosts = [
  {
    title: "How to write YouTube titles that actually get clicked",
    category: "YouTube",
    readTime: "6 min read",
    slug: "youtube-titles-that-get-clicked",
  },
  {
    title: "The creator's SEO checklist before you hit publish",
    category: "SEO",
    readTime: "8 min read",
    slug: "creators-seo-checklist",
  },
  {
    title: "Our 5 most used text tools (and how to use them)",
    category: "Text Tools",
    readTime: "4 min read",
    slug: "most-used-text-tools",
  },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  linkHref,
  linkLabel,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          {linkLabel}
          <ArrowRightIcon
            width={14}
            height={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featured = featuredTools();
  const trending = trendingTools();
  const recent = newTools();
  const marqueeTools = [...new Map(
    [...featured, ...trending, ...recent].map((t) => [t.slug, t])
  ).values()];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-violet-50 via-white to-white dark:border-zinc-800 dark:from-violet-950/30 dark:via-zinc-950 dark:to-zinc-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-fuchsia-500/15 to-violet-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500/15 to-violet-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/15 to-violet-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {categories.length} categories · {tools.length} free creator tools
            <SparklesIcon width={13} height={13} className="text-violet-500" />
          </span>
          <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-zinc-50">
            Every creator tool you need.
            <span className="animate-shimmer mt-1 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_auto] bg-clip-text text-transparent">
              One place.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Fast, private, and free — character counters, AI token estimators,
            YouTube title generators, SEO tools and more. Everything runs in
            your browser, so your text never leaves your device.
          </p>
          <div className="mt-10 flex w-full justify-center">
            <HomeSearch />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Popular
            </span>
            {popularQuickLinks.map((slug) => {
              const tool = featured.find((t) => t.slug === slug);
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-600 hover:shadow-pop dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-500 dark:hover:text-violet-300"
                >
                  {tool.icon} {tool.name}
                </Link>
              );
            })}
          </div>

          <dl className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-800">
            {[
              { value: `${tools.length}+`, label: "Free tools" },
              { value: `${categories.length}`, label: "Categories" },
              { value: "100%", label: "Free forever" },
              { value: "0", label: "Sign-ups needed" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white px-4 py-4 text-center dark:bg-zinc-950"
              >
                <dt className="sr-only">{item.label}</dt>
                <dd className="bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                  {item.value}
                </dd>
                <dd className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tools marquee */}
      <section
        aria-label="Popular tools"
        className="overflow-hidden border-b border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent dark:from-zinc-950"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-zinc-950"
          />
          <div className="animate-marquee flex w-max items-center gap-3">
            {[...marqueeTools, ...marqueeTools].map((tool, i) => (
              <Link
                key={`${tool.slug}-${i}`}
                href={`/tools/${tool.slug}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
              >
                <span aria-hidden>{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Explore"
          title="Browse by category"
          subtitle="Organized for the way creators actually work."
          linkHref="/tools"
          linkLabel="All tools"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ backgroundColor: cat.color }}
              />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: `${cat.color}1a` }}
                aria-hidden
              >
                {cat.icon}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {cat.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {cat.description}
              </p>
              <span className="mt-3 flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                {featured.filter((t) => t.category === cat.slug).length +
                  trending.filter((t) => t.category === cat.slug).length +
                  recent.filter((t) => t.category === cat.slug).length}{" "}
                tools
                <ArrowRightIcon width={12} height={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured tools"
            subtitle="Our most-loved tools, ready when you are."
            linkHref="/tools"
            linkLabel="View all"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="This week"
          title={
            <span className="flex items-center gap-2">
              <ClockIcon width={22} height={22} className="text-violet-500" />
              Trending now
            </span>
          }
          subtitle="What creators are using this week."
          linkHref="/tools"
          linkLabel="View all"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Newly added */}
      <section className="border-y border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="Fresh out"
            title="Newly added"
            subtitle="Fresh tools, shipped regularly."
            linkHref="/tools"
            linkLabel="View all"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Why us" title="Why creators use Creator Toolkit" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whyPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 dark:from-violet-500/20 dark:to-fuchsia-500/20 dark:text-violet-400">
                <CheckIcon width={17} height={17} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {point.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Resources"
          title="From the blog"
          subtitle="Tips and tutorials for creators."
          linkHref="/blog"
          linkLabel="Read the blog"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                {post.category}
              </span>
              <h3 className="mt-2 flex-1 text-sm font-semibold leading-6 text-zinc-900 transition-colors group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
                {post.title}
              </h3>
              <span className="mt-3 flex items-center gap-1 text-xs text-zinc-400">
                {post.readTime}
                <ArrowRightIcon width={12} height={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700 px-6 py-20 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create faster?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-violet-100">
              Join thousands of creators using free tools every day. No sign-up
              required — just open a tool and start.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tools"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-violet-700 shadow-lg shadow-black/10 transition-all duration-150 hover:scale-[1.03] hover:bg-violet-50"
              >
                Browse all tools
                <ArrowRightIcon width={16} height={16} />
              </Link>
              <Link
                href="/pro"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Go Pro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
