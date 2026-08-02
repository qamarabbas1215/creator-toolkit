"use client";

import { toolComponents } from "@/components/tools";

export function ToolPageClient({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
        This tool is coming soon.
      </div>
    );
  }
  return <Component />;
}
