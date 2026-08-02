import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        Tool not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Browse the full tool library instead.
      </p>
      <Link
        href="/tools"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
      >
        Browse all tools
        <ArrowRightIcon width={15} height={15} />
      </Link>
    </main>
  );
}
