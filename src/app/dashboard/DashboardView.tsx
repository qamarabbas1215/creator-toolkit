"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Stat, StatGrid } from "@/components/ui";
import { emitAuthChange } from "@/lib/auth-events";
import type { SessionUser } from "@/lib/session-types";
import { tools } from "@/data/tools";

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

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      emitAuthChange();
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-semibold text-white">
            {initial}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Member since {formatDate(user.created_at)} ·{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{user.email}</span>
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={logout} disabled={busy}>
          {busy ? "Signing out…" : "Sign out"}
        </Button>
      </div>

      <StatGrid className="mt-8">
        <Stat
          label="Your plan"
          value={
            user.plan === "pro" ? (
              <span className="text-violet-600 dark:text-violet-400">Pro</span>
            ) : (
              "Free"
            )
          }
        />
        <Stat label="Available tools" value={tools.length} accent="#8b5cf6" />
        <Stat label="Categories" value={10} />
        <Stat label="Storage" value="Browser" />
      </StatGrid>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
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

      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Quick start
            </h2>
            <span className="text-xs text-zinc-400">{tools.length} tools ready</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { href: "/tools/character-counter", label: "Character Counter", icon: "📝" },
              { href: "/tools/youtube-title-generator", label: "Title Generator", icon: "🎬" },
              { href: "/tools/json-formatter", label: "JSON Formatter", icon: "🧩" },
              { href: "/tools/ai-token-calculator", label: "Token Calculator", icon: "🤖" },
              { href: "/tools/hashtag-generator", label: "Hashtag Generator", icon: "#️⃣" },
              { href: "/tools/pdf-merge", label: "Merge PDF", icon: "🔗" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
              >
                <span>{t.icon}</span>
                {t.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
