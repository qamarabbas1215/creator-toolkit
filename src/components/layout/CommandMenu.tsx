"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategory, searchTools, tools } from "@/data/tools";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";

export function CommandMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (query.trim() ? searchTools(query) : tools.slice(0, 8)),
    [query]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function go(slug: string) {
    router.push(`/tools/${slug}`);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item.slug);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-fade-in-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-pop dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <SearchIcon width={16} height={16} className="text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={`Search ${tools.length} tools…`}
            className="h-12 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">
              No tools found for “{query}”
            </li>
          )}
          {results.map((tool, i) => (
            <li key={tool.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(tool.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  i === active && "bg-violet-50 dark:bg-zinc-800"
                )}
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
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800">
          <span>{results.length} {results.length === 1 ? "tool" : "tools"}</span>
          <span className="hidden sm:inline">↑↓ to navigate · Enter to open</span>
        </div>
      </div>
    </div>
  );
}
