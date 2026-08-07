import { getToolExtras } from "@/data/extras";
import { Card } from "@/components/ui";

export function ToolExtras({ slug }: { slug: string }) {
  const extras = getToolExtras(slug);
  if (!extras) return null;
  const hasExamples = extras.examples.length > 0;
  const hasFaqs = extras.faqs.length > 0;
  if (!hasExamples && !hasFaqs) return null;

  return (
    <div className="mt-16 space-y-12">
      {hasExamples && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-500 to-cyan-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Examples
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {extras.examples.map((ex) => (
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

      {hasFaqs && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {extras.faqs.map((faq) => (
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
