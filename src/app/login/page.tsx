import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Sign in — Account",
  description: `Sign in to ${SITE_NAME} or create a free account.`,
  robots: { index: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl text-white shadow-glow">
          ⚡
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome to {SITE_NAME}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to access your dashboard, settings, and Pro features.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-pop sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
        By continuing you agree to our{" "}
        <Link href="/privacy" className="text-violet-600 hover:underline dark:text-violet-400">
          Privacy Policy
        </Link>
        . Your password is stored as a one-way hash and never shared.
      </p>
    </div>
  );
}
