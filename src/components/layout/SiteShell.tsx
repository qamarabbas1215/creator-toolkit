"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CommandMenu = dynamic(() =>
  import("@/components/layout/CommandMenu").then((m) => m.CommandMenu),
  { ssr: false }
);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onSearch={() => setOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      {open && <CommandMenu onClose={() => setOpen(false)} />}
    </div>
  );
}
