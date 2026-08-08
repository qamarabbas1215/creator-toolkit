"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Category, ToolMeta } from "@/types/tool";
import { ToolCard } from "@/components/tools/ToolCard";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ToolsExplorer({
  categories,
  tools,
  initialCategory,
}: {
  categories: Category[];
  tools: ToolMeta[];
  initialCategory: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(initialCategory);

  const categoryTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = !category || tool.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const cat = categories.find((c) => c.slug === tool.category);
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (cat?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [tools, categories, category, query]);

  const groups = useMemo(() => {
    if (category) return null;
    return categories
      .map((cat) => ({
        cat,
        items: categoryTools.filter((t) => t.category === cat.slug),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, category, categoryTools]);

  function selectCategory(slug: string | null) {
    setCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.replace(slug ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <SearchIcon
          width={18}
          height={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tools.length} tools…`}
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectCategory(null)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
            category === null
              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          )}
        >
          All tools
        </button>
        {categories.map((c) => {
          const active = category === c.slug;
          const count = tools.filter((t) => t.category === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.slug)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
                active
                  ? "border-transparent text-white shadow-sm"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
              style={active ? { backgroundColor: c.color } : undefined}
            >
              <span aria-hidden>{c.icon}</span>
              {c.name}
              <span
                className={cn(
                  "text-[11px]",
                  active ? "text-white/80" : "text-zinc-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {categoryTools.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-3xl" aria-hidden>
            🔍
          </p>
          <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            No tools match “{query}”.
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Try a different search term or category.
          </p>
        </div>
      )}

      {category && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing {categoryTools.length}{" "}
              {categoryTools.length === 1 ? "tool" : "tools"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {!category &&
        groups?.map(({ cat, items }) => (
          <section key={cat.slug} className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-sm"
                style={{ backgroundColor: `${cat.color}1a` }}
                aria-hidden
              >
                {cat.icon}
              </span>
              <div className="min-w-0">
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </h2>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {cat.description} · {items.length} tools
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectCategory(cat.slug)}
                className="ml-auto shrink-0 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                View all →
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.slice(0, 8).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} showCategory={false} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
