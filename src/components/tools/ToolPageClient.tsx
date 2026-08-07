"use client";

import { useEffect, useRef } from "react";
import { lazyToolComponents } from "@/components/tools/lazy-tools";

export function ToolPageClient({ slug }: { slug: string }) {
  const reported = useRef<string | null>(null);

  useEffect(() => {
    if (reported.current === slug) return;
    reported.current = slug;
    fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: slug }),
    }).catch(() => {});
  }, [slug]);

  const Component = lazyToolComponents[slug];
  if (!Component) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
        This tool is coming soon.
      </div>
    );
  }
  return <Component />;
}
