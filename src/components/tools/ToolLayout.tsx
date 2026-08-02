import Link from "next/link";
import {
  getCategory,
  getTool,
  relatedTools,
  toolsByCategory,
} from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";

export function ToolLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const tool = getTool(slug);
  if (!tool) return null;
  const cat = getCategory(tool.category);
  const related = relatedTools(slug);
  const sidebarTools = toolsByCategory(tool.category).filter(
    (t) => t.slug !== slug
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1.5 overflow-hidden text-xs text-zinc-400">
        <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/tools"
          className="hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Tools
        </Link>
        <span>/</span>
        <Link
          href={`/tools?category=${cat.slug}`}
          className="hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {cat.name}
        </Link>
        <span>/</span>
        <span className="truncate font-medium text-zinc-600 dark:text-zinc-300">
          {tool.name}
        </span>
      </nav>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: `${cat.color}1a` }}
              aria-hidden
            >
              {tool.icon}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                {tool.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {tool.description}
              </p>
            </div>
          </header>
          {children}
        </div>

        {sidebarTools.length > 0 && (
          <aside className="w-full shrink-0 lg:w-72">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              More {cat.name}
            </h2>
            <ul className="mt-3 space-y-1">
              {sidebarTools.slice(0, 10).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <span aria-hidden>{t.icon}</span>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <section className="mt-16">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Related Tools
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
