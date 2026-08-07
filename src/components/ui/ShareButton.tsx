"use client";

import { useEffect, useState } from "react";

export function ShareButton({ text }: { text?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: text ?? "Check out this free tool on Creator Toolkit",
          url,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      title="Share this tool"
      aria-label="Share this tool"
      className="inline-flex h-7 items-center rounded-md px-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
