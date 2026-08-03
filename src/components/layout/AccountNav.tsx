"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AUTH_EVENT, emitAuthChange } from "@/lib/auth-events";
import type { SessionUser } from "@/lib/session-types";

export function AccountNav() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    function fetchUser() {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (active) setUser(data.user ?? null);
        })
        .catch(() => {
          if (active) setUser(null);
        });
    }
    fetchUser();
    window.addEventListener(AUTH_EVENT, fetchUser);
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      active = false;
      window.removeEventListener(AUTH_EVENT, fetchUser);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    emitAuthChange();
    router.push("/");
    router.refresh();
  }

  if (user === undefined) {
    return (
      <span className="h-9 w-16 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-3 text-sm font-medium text-white transition-colors hover:bg-violet-700"
      >
        Sign in
      </Link>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
            <span
              className={
                user.plan === "pro"
                  ? "mt-1.5 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "mt-1.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }
            >
              {user.plan === "pro" ? "⚡ Pro" : "Free"}
            </span>
          </div>
          <nav className="p-1 text-sm">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/account", label: "Account settings" },
              { href: "/pro", label: "Pro" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-zinc-100 p-1 dark:border-zinc-800">
            <button
              type="button"
              onClick={logout}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
