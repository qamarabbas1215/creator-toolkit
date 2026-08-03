"use client";

import { useState } from "react";

export function ProUpgrade({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);

  if (!signedIn) {
    return (
      <a
        href="/login"
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
      >
        Sign in to upgrade
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
      >
        Upgrade to Pro
      </button>
      {open && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
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
