"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { emitAuthChange } from "@/lib/auth-events";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [registerDone, setRegisterDone] = useState(false);
  const [devLink, setDevLink] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendBusy, setResendBusy] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register"
            ? { name, email, password }
            : { email, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.unverified && mode === "login") {
          setUnverified(true);
          setResendEmail(email);
          setError(data.error ?? "Please verify your email first.");
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      if (mode === "register") {
        if (data.devLink) setDevLink(data.devLink);
        setRegisterDone(true);
        setResendEmail(email);
        return;
      }
      emitAuthChange();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
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

  function resetToLogin() {
    setMode("login");
    setError("");
    setUnverified(false);
    setRegisterDone(false);
    setDevLink("");
    setResendDone(false);
  }

  if (registerDone) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Account created! We&apos;ve sent a verification link to{" "}
          <span className="font-medium">{email}</span>. Please check your inbox and click the
          link to activate your account.
        </p>

        {devLink && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <strong className="font-semibold">Development mode:</strong>{" "}
            Click to verify:{" "}
            <a href={devLink} className="break-all font-medium text-violet-600 underline dark:text-violet-400">
              {devLink}
            </a>
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Didn&apos;t get the email? Enter your address to resend:
          </label>
          <TextInput
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {resendDone ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            If an account exists, a new link has been sent.
          </p>
        ) : (
          <Button onClick={resendVerification} disabled={resendBusy || !resendEmail.trim()} className="w-full">
            {resendBusy ? "Sending…" : "Resend verification email"}
          </Button>
        )}

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={resetToLogin}
            className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError("");
              setUnverified(false);
            }}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === m
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {mode === "register" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </label>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
      )}

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

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <TextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          minLength={mode === "register" ? 8 : undefined}
          required
        />
        {mode === "login" && (
          <div className="flex justify-end pt-0.5">
            <a
              href="/forgot-password"
              className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              Forgot password?
            </a>
          </div>
        )}
      </div>

      {error && (
        <div className="space-y-3">
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
          {unverified && !resendDone && (
            <div className="space-y-2">
              <TextInput
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Button type="button" onClick={resendVerification} disabled={resendBusy || !resendEmail.trim()} className="w-full">
                {resendBusy ? "Sending…" : "Resend verification email"}
              </Button>
            </div>
          )}
          {resendDone && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              If an account exists with that email, a new link has been sent.
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </Button>
    </form>
  );
}