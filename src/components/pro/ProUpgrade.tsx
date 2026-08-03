"use client";

import { useState } from "react";

const linkClasses =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 px-5 text-base font-medium text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950";

export function ProUpgrade({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);

  if (!signedIn) {
    return (
      <a href="/login" className={linkClasses}>
        Sign in to upgrade
      </a>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} className={linkClasses}>
        Upgrade to Pro
      </button>
      {open && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm leading-6 text-amber-800 shadow-card dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <strong className="font-semibold">Payments are coming soon.</strong>{" "}
          We are finalizing payment options that work for international
          creators (the project is based in Pakistan, so we are evaluating
          providers like PayPal, Payoneer, Stripe, and direct bank transfer).
          Until then, Pro remains free to try once billing is live.
        </div>
      )}
    </div>
  );
}
