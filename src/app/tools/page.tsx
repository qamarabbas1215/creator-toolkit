import type { Metadata } from "next";
import { categories, tools } from "@/data/tools";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6 py-10 sm:px-8 dark:border-zinc-800 dark:from-violet-950/30 dark:via-zinc-950 dark:to-fuchsia-950/20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 blur-3xl"
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Toolbox
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          All Tools
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {tools.length} fast, free, privacy-friendly tools for creators —
          everything runs in your browser. Pick a category or search below.
        </p>
      </header>

      <div className="mt-8">
        <ToolsExplorer
          categories={categories}
          tools={tools}
          initialCategory={active}
        />
      </div>
    </div>
  );
}
