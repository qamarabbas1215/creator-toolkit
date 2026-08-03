"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, TextInput } from "@/components/ui";
import { emitAuthChange } from "@/lib/auth-events";
import type { SessionUser } from "@/lib/session-types";

export function AccountSettings({ user }: { user: SessionUser }) {
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [deleteBusy, setDeleteBusy] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileBusy(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ ok: false, text: data.error ?? "Could not save changes." });
        return;
      }
      setProfileMsg({ ok: true, text: "Profile updated." });
      emitAuthChange();
      router.refresh();
    } catch {
      setProfileMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setProfileBusy(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setPasswordBusy(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordMsg({ ok: false, text: data.error ?? "Could not change password." });
        return;
      }
      setPasswordMsg({ ok: true, text: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setPasswordBusy(false);
    }
  }

  async function deleteAccount() {
    if (
      !window.confirm(
        "This permanently deletes your account and all saved data. Continue?"
      )
    ) {
      return;
    }
    setDeleteBusy(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        emitAuthChange();
        router.push("/");
        router.refresh();
      }
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Account settings
      </h1>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Profile
          </h2>
          <form onSubmit={saveProfile} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <TextInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {profileMsg && (
              <p
                className={
                  profileMsg.ok
                    ? "text-sm text-emerald-600 dark:text-emerald-400"
                    : "text-sm text-red-600 dark:text-red-400"
                }
              >
                {profileMsg.text}
              </p>
            )}
            <Button type="submit" disabled={profileBusy}>
              {profileBusy ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Change password
          </h2>
          <form onSubmit={changePassword} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Current password
              </label>
              <TextInput
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  New password
                </label>
                <TextInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            {passwordMsg && (
              <p
                className={
                  passwordMsg.ok
                    ? "text-sm text-emerald-600 dark:text-emerald-400"
                    : "text-sm text-red-600 dark:text-red-400"
                }
              >
                {passwordMsg.text}
              </p>
            )}
            <Button type="submit" disabled={passwordBusy}>
              {passwordBusy ? "Updating…" : "Update password"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Your plan
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user.plan === "pro"
                ? "You are on the Pro plan."
                : "You are on the free plan."}
            </p>
            <Link href="/pro">
              <Button variant="secondary">
                {user.plan === "pro" ? "View Pro" : "Upgrade to Pro"}
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
            Danger zone
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Deleting your account removes your profile and session immediately.
            This cannot be undone.
          </p>
          <Button
            variant="danger"
            className="mt-4"
            onClick={deleteAccount}
            disabled={deleteBusy}
          >
            {deleteBusy ? "Deleting…" : "Delete account"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
