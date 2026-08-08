"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Stat, StatGrid } from "@/components/ui";
import { ToolCard } from "@/components/tools/ToolCard";
import { emitAuthChange } from "@/lib/auth-events";
import { formatNumber } from "@/lib/utils";
import type { SessionUser } from "@/lib/session-types";
import type { ToolMeta } from "@/types/tool";

interface ProjectSummary {
  id: number;
  toolSlug: string;
  title: string;
  content: string;
  toolName: string;
  toolIcon: string;
  createdAt: number;
  updatedAt: number;
}

interface TopTool {
  slug: string;
  runs: number;
  name: string;
  icon: string;
  categoryName: string;
  color: string;
}

interface UserData {
  favorites: ToolMeta[];
  recent: ToolMeta[];
  topTools: TopTool[];
  stats: {
    totalRuns: number;
    distinctTools: number;
    thisWeekRuns: number;
    favoritesCount: number;
    projectsCount: number;
  };
  projects: ProjectSummary[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DashboardView({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Proceed with local sign-out even if the network call fails.
    }
    emitAuthChange();
    router.push("/");
    router.refresh();
    setBusy(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/user-data")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load dashboard data.");
        return res.json();
      })
      .then((body) => {
        if (active && body) setData(body);
      })
      .catch(() => {
        if (active) setError("Could not load your dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function deleteProject(id: number) {
    if (!window.confirm("Delete this saved project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                projects: prev.projects.filter((p) => p.id !== id),
                stats: { ...prev.stats, projectsCount: Math.max(0, prev.stats.projectsCount - 1) },
              }
            : prev
        );
      } else {
        setError("Could not delete the project. Please try again.");
      }
    } catch {
      setError("Network error. Could not delete the project.");
    }
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-semibold text-white shadow-glow">
            {initial}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Dashboard
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Member since {formatDate(user.created_at)} ·{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {user.email}
              </span>
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={logout} disabled={busy}>
          {busy ? "Signing out…" : "Sign out"}
        </Button>
      </div>

      {loading && (
        <div className="mt-8 space-y-8">
          <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {data && (
        <>
          <StatGrid className="mt-8">
            <Stat
              label="Your plan"
              value={
                user.plan === "pro" ? (
                  <span className="text-violet-600 dark:text-violet-400">⚡ Pro</span>
                ) : (
                  "Free"
                )
              }
            />
            <Stat
              label="Favorite tools"
              value={formatNumber(data.stats.favoritesCount)}
              accent="#f59e0b"
            />
            <Stat
              label="Tools visited"
              value={formatNumber(data.stats.distinctTools)}
              accent="#8b5cf6"
            />
            <Stat
              label="Runs this week"
              value={formatNumber(data.stats.thisWeekRuns)}
              accent="#10b981"
            />
          </StatGrid>

          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Saved projects
              </h2>
              <span className="ml-auto text-xs text-zinc-400">
                {data.stats.projectsCount} saved
              </span>
            </div>
            {data.projects.length === 0 ? (
              <Card className="border-dashed">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No projects yet. Use the{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    Save
                  </span>{" "}
                  button on any tool output to keep your work here.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {data.projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-card sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <span className="text-2xl" aria-hidden>
                      {p.toolIcon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.title}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {p.toolName} · Updated {formatDate(p.updatedAt)}
                      </p>
                      {p.content && (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-400 dark:text-zinc-500">
                          {p.content}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/tools/${p.toolSlug}`}>
                        <Button variant="secondary" size="sm">
                          Open tool
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(p.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Your favorites
              </h2>
              <span className="ml-auto text-xs text-zinc-400">
                {data.stats.favoritesCount} tools
              </span>
            </div>
            {data.favorites.length === 0 ? (
              <Card className="border-dashed">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No favorites yet. Tap the{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    ☆ Favorite
                  </span>{" "}
                  button on any tool page to pin it here.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.favorites.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-500 to-cyan-500" />
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Recently used
              </h2>
              <span className="ml-auto text-xs text-zinc-400">
                {data.stats.distinctTools} tools in your history
              </span>
            </div>
            {data.recent.length === 0 ? (
              <Card className="border-dashed">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Tools you visit will show up here for quick access.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.recent.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            )}
          </section>

          {data.topTools.length > 0 && (
            <section className="mt-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Your most used tools
                </h2>
              </div>
              <Card>
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data.topTools.map((t, i) => (
                    <li key={t.slug} className="flex items-center gap-3 py-2.5">
                      <span className="w-5 text-sm font-semibold tabular-nums text-zinc-300 dark:text-zinc-600">
                        {i + 1}
                      </span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                        style={{ backgroundColor: `${t.color}1a` }}
                        aria-hidden
                      >
                        {t.icon}
                      </span>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 transition-colors hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400"
                      >
                        {t.name}
                      </Link>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {formatNumber(t.runs)} runs
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          )}

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.plan === "pro" ? "Pro membership" : "Upgrade to Pro"}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {user.plan === "pro"
                      ? "You are on the Pro plan. Enjoy all pro benefits."
                      : "Unlock advanced tools and priority features."}
                  </p>
                </div>
                <span className="text-3xl">⚡</span>
              </div>
              <div className="mt-4">
                <Link href="/pro">
                  <Button variant={user.plan === "pro" ? "secondary" : "primary"}>
                    {user.plan === "pro" ? "View Pro page" : "Upgrade to Pro"}
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Account settings
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update your name, email, and password.
                  </p>
                </div>
                <span className="text-3xl">⚙️</span>
              </div>
              <div className="mt-4">
                <Link href="/account">
                  <Button variant="secondary">Open settings</Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
