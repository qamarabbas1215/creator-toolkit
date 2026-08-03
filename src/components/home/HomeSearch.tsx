"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategory, searchTools, tools } from "@/data/tools";
import { SearchIcon } from "@/components/icons";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = useMemo(() => searchTools(query), [query]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-pop transition-all duration-200 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-900">
        <SearchIcon width={20} height={20} className="shrink-0 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tools.length}+ tools…`}
          className="h-12 w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
        />
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-500 sm:flex dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          ⌘K
        </kbd>
      </div>

      {query.trim() && results.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-pop dark:border-zinc-800 dark:bg-zinc-900">
          <ul className="max-h-80 overflow-y-auto p-1.5">
            {results.map((tool) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => router.push(`/tools/${tool.slug}`)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-violet-50 dark:hover:bg-zinc-800"
                >
                  <span aria-hidden>{tool.icon}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {tool.name}
                  </span>
                  <span className="ml-auto text-xs text-zinc-400">
                    {getCategory(tool.category).name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
