import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getTool, tools } from "@/data/tools";
import { SITE_NAME } from "@/data/site";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageClient } from "@/components/tools/ToolPageClient";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const category = getCategory(tool.category);
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    keywords: [...tool.keywords, category.name, "free tool", "online tool"],
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolLayout slug={slug}>
      <ToolPageClient slug={slug} />
    </ToolLayout>
  );
}
