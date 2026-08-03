import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Sign in — Account",
  description: `Sign in to ${SITE_NAME} or create a free account.`,
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="text-4xl">⚡</span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome to {SITE_NAME}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to access your dashboard, settings, and Pro features.
        </p>
      </div>
      <LoginForm />
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
