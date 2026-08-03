import Link from "next/link";
import { getCategory } from "@/data/tools";
import type { ToolMeta } from "@/types/tool";

export function ToolCard({
  tool,
  showCategory = true,
}: {
  tool: ToolMeta;
  showCategory?: boolean;
}) {
  const cat = getCategory(tool.category);
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-transform duration-150 group-hover:scale-110"
          style={{ backgroundColor: `${cat.color}1a` }}
          aria-hidden
        >
          {tool.icon}
        </span>
        {tool.isNew && (
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
            NEW
          </span>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {tool.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {tool.description}
      </p>
      {showCategory && (
        <span className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500">
          {cat.icon} {cat.name}
        </span>
      )}
    </Link>
  );
}
