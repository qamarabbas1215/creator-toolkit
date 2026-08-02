import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";
import { ArrowRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
      >
        <ArrowRightIcon width={13} height={13} className="rotate-180" />
        Back to blog
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="font-medium text-violet-600 dark:text-violet-400">
            {post.category}
          </span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
          {post.excerpt}
        </p>
        <div className="mt-8 space-y-5">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] leading-7 text-zinc-700 dark:text-zinc-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
