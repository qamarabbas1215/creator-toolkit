import type { Metadata } from "next";
import Link from "next/link";
import { categories, tools } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types/tool";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse every free tool in Creator Toolkit — writing, YouTube, SEO, social media, image, text, developer, and AI tools.",
};

const categorySlugs = categories.map((c) => c.slug);

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = categorySlugs.includes(category as CategorySlug)
    ? (category as CategorySlug)
    : null;
  const filtered = active ? tools.filter((t) => t.category === active) : tools;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Toolbox
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          All Tools
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {tools.length} fast, free, privacy-friendly tools for creators —
          everything runs in your browser.
        </p>
      </header>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/tools"
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === null
              ? "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-600/20"
              : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/tools?category=${c.slug}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === c.slug
                ? "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Showing {filtered.length} {active ? categories.find((c) => c.slug === active)?.name.toLowerCase() : "tools"}
      </p>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} showCategory={false} />
        ))}
      </section>
    </div>
  );
}
