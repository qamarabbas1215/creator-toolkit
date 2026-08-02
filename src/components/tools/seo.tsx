"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  OptionRow,
  Select,
  Stat,
  StatGrid,
  TextInput,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";
import { analyzeText } from "@/lib/text";

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
  "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was",
  "were", "will", "with", "i", "you", "your", "we", "our", "they", "their",
  "this", "these", "those", "but", "not", "or", "so", "if", "then", "than",
  "too", "very", "can", "just", "have", "had", "do", "does", "did", "been",
  "am", "what", "which", "who", "whom", "when", "where", "how", "all", "any",
  "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "only", "own", "same", "s", "t", "don", "now", "get", "go", "make", "like",
  "one", "would", "could", "should", "may", "might", "must", "about", "into",
  "over", "up", "down", "out", "off", "again", "there", "here", "because",
  "until", "while", "above", "below", "between", "after", "before", "during",
]);

export function KeywordDensity() {
  const [text, setText] = useState("");
  const [includeStopwords, setIncludeStopwords] = useState(false);
  const stats = useMemo(() => analyzeText(text), [text]);

  const keywords = useMemo(() => {
    const freq = new Map<string, number>();
    const words = text
      .toLowerCase()
      .match(/[a-z0-9'’-]+/g)
      ?.filter((w) => includeStopwords || !STOPWORDS.has(w)) ?? [];
    for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
    return [...freq.entries()]
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({
        word,
        count,
        density: stats.words ? ((count / stats.words) * 100) : 0,
      }));
  }, [text, includeStopwords, stats.words]);

  const maxCount = keywords.length ? keywords[0].count : 1;

  return (
    <div className="space-y-6">
      <Textarea
        label="Your content"
        placeholder="Paste your article or blog post to analyze…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <StatGrid>
        <Stat label="Total words" value={stats.words} />
        <Stat label="Unique words" value={stats.uniqueWords} />
        <Stat label="Tracked keywords" value={keywords.length} />
      </StatGrid>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={includeStopwords}
          onChange={(e) => setIncludeStopwords(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Include stop words (the, and, of…)
      </label>

      {keywords.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Keyword frequency
          </h3>
          <div className="mt-3 space-y-2">
            {keywords.map((k) => (
              <div key={k.word} className="flex items-center gap-3">
                <span className="w-40 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {k.word}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(k.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
                  {k.count}
                </span>
                <span className="w-14 text-right text-xs tabular-nums text-zinc-400">
                  {k.density.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function SerpPreview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold dark:bg-zinc-700">
          {url.slice(0, 1).toUpperCase()}
        </span>
        <span className="truncate">{url}</span>
      </div>
      <div
        className={cn(
          "mt-1 cursor-pointer truncate text-lg leading-6",
          title.length <= 60
            ? "text-blue-700 dark:text-blue-400"
            : "text-amber-600 dark:text-amber-400"
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          "mt-0.5 line-clamp-2 text-sm leading-5",
          description.length <= 160
            ? "text-zinc-600 dark:text-zinc-400"
            : "text-amber-600 dark:text-amber-400"
        )}
      >
        {description}
      </div>
    </div>
  );
}

const TITLE_TEMPLATES = [
  (k: string) => `${k}: ${benefit(k)}`,
  (k: string, b: string) => `${benefit(k)} — ${k} ${b ? `| ${b}` : ""}`.replace(/ \| $/, ""),
  (k: string) => `${capFirst(k)} in 2026: The Complete Guide`,
  (k: string, b: string) => `How to ${k} ${b ? `| ${b}` : ""}`.replace(/ \| $/, ""),
  (k: string) => `${capFirst(k)} Explained (Beginner to Pro)`,
  (k: string) => `The Ultimate ${capFirst(k)} Checklist for 2026`,
  (k: string) => `${capFirst(k)}: Everything You Need to Know`,
  (k: string) => `Top ${capFirst(k)} Tips You Can Use Today`,
];

function benefit(k: string): string {
  const nouns = k.split(" ").pop() ?? k;
  return `The Best ${capFirst(nouns)} Guide`;
}

function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [url] = useState("https://example.com/blog/");

  function generate() {
    setTitles(TITLE_TEMPLATES.map((tpl) => tpl(keyword.trim(), brand.trim())));
  }

  const activeTitle = titles[0] ?? "";

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Primary keyword" className="min-w-44 flex-1">
          <TextInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. best running shoes"
          />
        </Field>
        <Field label="Brand (optional)" className="min-w-36">
          <TextInput
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Nike"
          />
        </Field>
        <Button onClick={generate} disabled={!keyword.trim()} className="h-9">
          Generate titles
        </Button>
      </OptionRow>

      {titles.length > 0 && (
        <>
          <SerpPreview
            title={activeTitle}
            description="This is how your page will look in Google search results."
            url={`${url}${keyword.replace(/\s+/g, "-").toLowerCase()}`}
          />
          <div className="space-y-2">
            {titles.map((title, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      title.length <= 60
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {title.length} chars — {title.length <= 60 ? "fits in SERP" : "may be truncated"}
                  </p>
                </div>
                <CopyButton text={title} className="shrink-0" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const DESC_TEMPLATES = [
  (k: string) =>
    `Looking for the best ${k}? Our expert guide covers everything you need to know — features, pros and cons, and honest recommendations to help you choose with confidence.`,
  (k: string) =>
    `Discover the top ${k} in 2026. Compare prices, read expert reviews, and find the perfect option for your needs — no fluff, just what actually matters.`,
  (k: string) =>
    `Everything about ${k}, explained simply. Learn how it works, what to look for, and get practical tips from people who've done it before. Start reading now.`,
  (k: string) =>
    `Wondering what makes ${k} worth your time? This complete guide breaks it down step by step — from basics to pro tips — so you can get results fast.`,
];

export function MetaDescriptionGenerator() {
  const [keyword, setKeyword] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [url] = useState("https://example.com/blog/");
  const [title] = useState("");

  function generate() {
    setDescriptions(DESC_TEMPLATES.map((tpl) => tpl(keyword.trim())));
  }

  const activeDesc = descriptions[0] ?? "";

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Primary keyword" className="min-w-52 flex-1">
          <TextInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. running shoes for beginners"
          />
        </Field>
        <Button onClick={generate} disabled={!keyword.trim()} className="h-9">
          Generate descriptions
        </Button>
      </OptionRow>

      {descriptions.length > 0 && (
        <>
          <SerpPreview
            title={title || `${capFirst(keyword)} — The Complete Guide`}
            description={activeDesc}
            url={`${url}${keyword.replace(/\s+/g, "-").toLowerCase()}`}
          />
          <div className="space-y-2">
            {descriptions.map((desc, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="min-w-0">
                  <p className="text-sm leading-6 text-zinc-900 dark:text-zinc-100">
                    {desc}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      desc.length <= 160
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {desc.length} chars — {desc.length <= 160 ? "good length" : "recommend ≤ 160"}
                  </p>
                </div>
                <CopyButton text={desc} className="shrink-0" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function SlugGenerator() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [removeStopwords, setRemoveStopwords] = useState(true);

  const slug = useMemo(() => {
    let words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    if (removeStopwords) words = words.filter((w) => !STOPWORDS.has(w));
    return words.join(separator);
  }, [text, separator, removeStopwords]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Title or phrase"
        placeholder="e.g. 7 Best AI Tools for Content Creators in 2026"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <OptionRow>
        <Field label="Separator">
          <Select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">hyphen ( - )</option>
            <option value="_">underscore ( _ )</option>
            <option value="">none</option>
          </Select>
        </Field>
        <label className="flex h-9 cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={removeStopwords}
            onChange={(e) => setRemoveStopwords(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Remove stop words
        </label>
      </OptionRow>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <code className="break-all font-mono text-sm text-emerald-600 dark:text-emerald-400">
            /{slug}
          </code>
          <CopyButton text={slug} className="shrink-0" />
        </div>
      </Card>
    </div>
  );
}
