import Link from "next/link";
import { getToolExtras } from "@/data/extras";
import { getTool } from "@/data/tools";
import { Card } from "@/components/ui";

export function ToolExtras({ slug }: { slug: string }) {
  const extras = getToolExtras(slug);
  if (!extras) return null;

  const examples = extras.examples;
  const faqs = extras.faqs;
  const howTo = extras.howTo ?? [];
  const limits = extras.limits ?? [];
  const related = extras.related ?? [];
  const workedExample = extras.workedExample;
  const privacyNote = extras.privacyNote;
  const blogLink = extras.blogLink;

  const hasExamples = examples.length > 0;
  const hasFaqs = faqs.length > 0;
  const hasHowTo = howTo.length > 0;
  const hasWorked = Boolean(workedExample);
  const hasLimits = limits.length > 0;
  const hasPrivacy = Boolean(privacyNote);
  const hasRelated = related.length > 0;
  const hasBlog = Boolean(blogLink);

  const isEmpty =
    !hasExamples && !hasFaqs && !hasHowTo && !hasWorked && !hasLimits && !hasPrivacy && !hasRelated && !hasBlog;
  if (isEmpty) return null;

  return (
    <div className="mt-16 space-y-12">
      {hasExamples && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Examples
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {examples.map((ex) => (
              <Card key={ex.title} className="border-dashed">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {ex.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {ex.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {hasHowTo && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-500 to-cyan-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              How to use
            </h2>
          </div>
          <ol className="space-y-3">
            {howTo.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {workedExample && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Worked example
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Input
              </h3>
              <p className="mt-2 break-words font-mono text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {workedExample.input}
              </p>
            </Card>
            <Card className="border-emerald-200/60 dark:border-emerald-500/20">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Result
              </h3>
              <p className="mt-2 break-words font-mono text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {workedExample.output}
              </p>
            </Card>
          </div>
          {workedExample.note && (
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {workedExample.note}
            </p>
          )}
        </section>
      )}

      {hasLimits && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Accuracy notes &amp; limits
            </h2>
          </div>
          <ul className="space-y-2">
            {limits.map((limit) => (
              <li
                key={limit}
                className="rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-zinc-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-zinc-300"
              >
                {limit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {privacyNote && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Privacy &amp; processing
            </h2>
          </div>
          <p className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm leading-6 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {privacyNote}
          </p>
        </section>
      )}

      {hasRelated && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-fuchsia-500 to-pink-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Related tools
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rel) => {
              const t = getTool(rel.slug);
              if (!t) return null;
              return (
                <Link
                  key={rel.slug}
                  href={`/tools/${rel.slug}`}
                  className="group rounded-xl border border-zinc-200/80 bg-white p-4 transition-colors hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
                >
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {t.icon} {t.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {rel.note}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {blogLink && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Related reading
            </h2>
          </div>
          <Link
            href={`/blog/${blogLink.slug}`}
            className="group block rounded-xl border border-zinc-200/80 bg-white p-5 transition-colors hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {blogLink.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {blogLink.readTime}
            </p>
          </Link>
        </section>
      )}

      {hasFaqs && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-200/80 bg-white shadow-card dark:border-zinc-800 dark:bg-zinc-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-zinc-100 px-5 py-4 text-sm leading-6 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
