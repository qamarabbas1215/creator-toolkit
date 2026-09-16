"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { emitAuthChange } from "@/lib/auth-events";

function VerifyEmailInner() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [state, setState] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error"
  );
  const [error, setError] = useState(
    token ? "" : "No verification token provided. Please check your email for the link."
  );
  const [devLink, setDevLink] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendBusy, setResendBusy] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setState("error");
          setError(data.error ?? "Verification failed.");
          return;
        }
        setState("success");
        emitAuthChange();
        setTimeout(() => router.push("/dashboard"), 1200);
      } catch {
        if (!cancelled) {
          setState("error");
          setError("Network error. Please try again.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token, router]);

  async function resend() {
    if (!resendEmail.trim()) return;
    setResendBusy(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      const data = await res.json();
      if (data.devLink) setDevLink(data.devLink);
      setResendDone(true);
    } catch { /* no-op */ }
    setResendBusy(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl text-white shadow-glow">
          ✉️
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Verify your email
        </h1>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-pop sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        {state === "verifying" && (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Verifying your email…
          </p>
        )}

        {state === "success" && (
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Email verified! Redirecting you to the dashboard…
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>

            {devLink && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <strong className="font-semibold">Development mode:</strong>{" "}
                <a href={devLink} className="break-all font-medium text-violet-600 underline dark:text-violet-400">
                  {devLink}
                </a>
              </div>
            )}

            {!resendDone && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Your email address
                  </label>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
                  />
                </div>
                <Button onClick={resend} disabled={resendBusy || !resendEmail.trim()} className="w-full">
                  {resendBusy ? "Sending…" : "Resend verification email"}
                </Button>
              </>
            )}
            {resendDone && (
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                If an account exists with that email, a new link has been sent.
              </p>
            )}

            <div className="pt-2 text-center">
              <Link href="/login" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400">
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}