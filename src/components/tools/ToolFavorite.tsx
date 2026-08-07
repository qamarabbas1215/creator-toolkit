"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "@/lib/use-auth";
import { cn } from "@/lib/utils";

export function ToolFavorite({ slug }: { slug: string }) {
  const user = useAuthState();
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.slugs)) {
          setFavorited(data.slugs.includes(slug));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, slug]);

  async function onToggle() {
    if (!user) return;
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(Boolean(data.favorited));
      }
    } finally {
      setBusy(false);
    }
  }

  if (user === undefined) {
    return (
      <span className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        title="Sign in to favorite this tool"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <span aria-hidden>☆</span>
        Favorite
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      aria-pressed={favorited}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors",
        favorited
          ? "border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30"
          : "border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      )}
    >
      <span aria-hidden>{favorited ? "★" : "☆"}</span>
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
