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
      <div className="flex items-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 shadow-lg shadow-violet-500/5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-900">
        <SearchIcon width={18} height={18} className="shrink-0 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tools.length}+ tools…`}
          className="h-14 w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
        />
      </div>

      {query.trim() && results.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <ul className="max-h-80 overflow-y-auto p-1.5">
            {results.map((tool) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => router.push(`/tools/${tool.slug}`)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-violet-50 dark:hover:bg-zinc-800"
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
