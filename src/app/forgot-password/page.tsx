import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { SITE_NAME } from "@/data/site";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Reset your ${SITE_NAME} password.`,
  robots: { index: false },
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl text-white shadow-glow">
          🔑
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Enter your account email and we&apos;ll send you a verification code.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-pop sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
