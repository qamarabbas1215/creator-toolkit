"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/tools";
import { SITE_NAME } from "@/data/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AccountNav } from "@/components/layout/AccountNav";
import {
  CommandIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/pro", label: "Pro" },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-zinc-900/5 transition-transform duration-150 hover:scale-105 dark:ring-white/10">
            <Image
              src="/logo.webp"
              alt={`${SITE_NAME} logo`}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </span>
          <span className="hidden text-zinc-900 md:inline dark:text-zinc-50">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={onSearch}
          className="group flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-500 shadow-sm transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-100 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20 sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <SearchIcon width={15} height={15} />
          <span className="truncate">Search tools…</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 sm:flex">
            <CommandIcon width={10} height={10} />
            K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <AccountNav />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 sm:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {menuOpen ? (
              <XIcon width={18} height={18} />
            ) : (
              <MenuIcon width={18} height={18} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-zinc-200 bg-white px-4 py-4 sm:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/tools?category=${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <span>{c.icon}</span>
                {c.name}
              </Link>
            ))}
            <Link
              href="/tools"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-zinc-800"
              )}
            >
              View all tools
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
