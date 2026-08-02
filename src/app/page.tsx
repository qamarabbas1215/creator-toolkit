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
  StarIcon,
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

const testimonials = [
  {
    quote:
      "Creator Toolkit replaced six bookmarked tools for me. The YouTube title generator alone is worth it.",
    name: "Maya R.",
    role: "YouTuber · 250K subscribers",
  },
  {
    quote:
      "The SEO tools are brilliant for quick content checks. I use the keyword density tool before every blog post.",
    name: "Daniel K.",
    role: "Content marketer",
  },
  {
    quote:
      "Clean, fast, and private. I keep it open in a tab all day for my daily creator workflow.",
    name: "Priya S.",
    role: "Instagram creator",
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
  title,
  subtitle,
  linkHref,
  linkLabel,
}: {
  title: React.ReactNode;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          {linkLabel}
          <ArrowRightIcon width={14} height={14} />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featured = featuredTools();
  const trending = trendingTools();
  const recent = newTools();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-violet-50 via-white to-white dark:border-zinc-800 dark:from-violet-950/30 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
            <SparklesIcon width={13} height={13} />
            {categories.length} categories · {tools.length} free creator tools
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
            Every creator tool you need.
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}
              One place.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Fast, private, and free — character counters, AI token estimators,
            YouTube title generators, SEO tools and more. Everything runs in
            your browser, so your text never leaves your device.
          </p>
          <div className="mt-10 flex w-full justify-center">
            <HomeSearch />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {popularQuickLinks.map((slug) => {
              const tool = featured.find((t) => t.slug === slug);
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-500 dark:hover:text-violet-300"
                >
                  {tool.icon} {tool.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
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
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              style={{ borderTopWidth: 3, borderTopColor: cat.color }}
            >
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
              <span className="mt-3 flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                {featured.filter((t) => t.category === cat.slug).length +
                  trending.filter((t) => t.category === cat.slug).length +
                  recent.filter((t) => t.category === cat.slug).length}{" "}
                tools <ArrowRightIcon width={12} height={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <SectionHeading
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
          title={
            <span className="flex items-center gap-2">
              <ClockIcon width={20} height={20} className="text-violet-500" />
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
      <section className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <SectionHeading
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading title="Why creators use Creator Toolkit" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whyPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                <CheckIcon width={16} height={16} />
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

      {/* Testimonials */}
      <section className="border-y border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-8 flex items-center gap-2">
            <StarIcon width={18} height={18} className="text-amber-500" />
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Loved by creators
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} width={14} height={14} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {t.name}
                  </span>
                  <span className="block text-xs text-zinc-500">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
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
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                {post.category}
              </span>
              <h3 className="mt-2 flex-1 text-sm font-semibold leading-6 text-zinc-900 group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
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
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-16 text-center sm:px-16">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to create faster?
            </h2>
            <p className="mt-3 text-violet-100">
              Join thousands of creators using free tools every day. No sign-up required.
            </p>
            <Link
              href="/tools"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-violet-700 shadow-lg transition-transform hover:scale-[1.03]"
            >
              Browse all tools
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
