"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "@/lib/use-auth";

export function SaveProjectButton({
  value,
  filename,
}: {
  value: string;
  filename: string;
}) {
  const pathname = usePathname();
  const user = useAuthState();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const match = pathname?.match(/^\/tools\/([^/]+)/);
  const toolSlug = match?.[1];

  if (!toolSlug) return null;

  function openForm() {
    const base = filename.replace(/\.[a-z0-9]+$/i, "");
    setTitle(`${base} — ${new Date().toLocaleDateString()}`);
    setOpen(true);
    setSaved(false);
    setError(null);
  }

  async function save() {
    if (!user || !value) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          title: title.trim() || "Untitled project",
          content: value,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not save the project.");
        return;
      }
      setOpen(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (user === undefined) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        title="Sign in to save this result to your projects"
        className="inline-flex h-7 items-center rounded-md px-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        Save
      </Link>
    );
  }

  return (
    <div className="relative">
      {saved ? (
        <span className="inline-flex h-7 items-center rounded-md bg-emerald-100 px-2 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          Saved
        </span>
      ) : (
        <button
          type="button"
          onClick={openForm}
          disabled={!value}
          title="Save this result to your projects"
          className="inline-flex h-7 items-center rounded-md px-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          Save
        </button>
      )}

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Save to projects
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            autoFocus
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
          {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !value}
              className="rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:from-violet-500 hover:to-violet-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
