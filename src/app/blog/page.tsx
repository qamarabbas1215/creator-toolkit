import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, tutorials, and guides for content creators — YouTube titles, SEO, and everyday workflows.",
};

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Resources
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Blog
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Tips and tutorials for creators.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="font-medium text-violet-600 dark:text-violet-400">
                {post.category}
              </span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-zinc-900 group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
              {post.title}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {post.excerpt}
            </p>
            <span className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400">
              Read post
              <ArrowRightIcon
                width={12}
                height={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
