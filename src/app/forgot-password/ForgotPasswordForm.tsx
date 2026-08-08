"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, TextInput } from "@/components/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDevOtp(typeof data.devOtp === "string" ? data.devOtp : "");
      setOtp("");
      setPassword("");
      setConfirm("");
      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "This code is invalid or has expired.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <strong className="font-semibold">Password updated.</strong> You can
          now sign in with your new password. For security, all your other
          sessions were signed out.
        </div>
        <Link href="/login">
          <Button type="button" className="w-full">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <strong className="font-semibold">Code sent.</strong> We&apos;ve
          emailed a 6-digit verification code to{" "}
          <span className="font-medium">{email}</span>. It&apos;s valid for 10
          minutes.
        </div>

        {devOtp && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <strong className="font-semibold">Development mode:</strong> email
            is not configured, so use this code —{" "}
            <span className="font-mono text-lg font-bold tracking-[0.3em]">
              {devOtp}
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Verification code
          </label>
          <TextInput
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            autoComplete="one-time-code"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            New password
          </label>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Confirm new password
          </label>
          <TextInput
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Updating…" : "Set new password"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={busy}
          onClick={sendCode}
        >
          Resend code
        </Button>
        <p className="text-center text-sm">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Use a different email
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); sendCode(); }} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <TextInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Sending…" : "Send verification code"}
      </Button>
    </form>
  );
}
