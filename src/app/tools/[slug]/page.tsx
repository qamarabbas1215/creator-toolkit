import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getTool, tools } from "@/data/tools";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { JsonLd } from "@/components/seo/JsonLd";

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
  const category = getCategory(tool.category);
  const base = SITE_URL.replace(/\/$/, "");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "All Tools", item: `${base}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${base}/tools?category=${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.name,
        item: `${base}/tools/${tool.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ToolLayout slug={slug}>
        <ToolPageClient slug={slug} />
      </ToolLayout>
    </>
  );
}
