"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  Stat,
  StatGrid,
  TextInput,
  Textarea,
} from "@/components/ui";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

export function RobotsTxtGenerator() {
  const [disallowAll, setDisallowAll] = useState(false);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [disallow, setDisallow] = useState("/admin\n/private");
  const [allow, setAllow] = useState("");
  const [customRules, setCustomRules] = useState("");

  const output = useMemo(() => {
    const lines: string[] = ["User-agent: *"];
    if (disallowAll) {
      lines.push("Disallow: /");
    } else {
      const disallows = disallow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      for (const d of disallows) lines.push(`Disallow: ${d}`);
      const allows = allow
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      for (const a of allows) lines.push(`Allow: ${a}`);
    }
    if (customRules.trim()) {
      lines.push("", customRules.trim());
    }
    if (sitemap.trim()) {
      lines.push("", `Sitemap: ${sitemap.trim()}`);
    }
    return lines.join("\n");
  }, [disallowAll, disallow, allow, sitemap, customRules]);

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={disallowAll}
          onChange={(e) => setDisallowAll(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Block everything (Disallow: /)
      </label>
      {!disallowAll && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Disallow paths (one per line)">
            <Textarea
              value={disallow}
              onChange={(e) => setDisallow(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </Field>
          <Field label="Allow paths (one per line)">
            <Textarea
              value={allow}
              onChange={(e) => setAllow(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </Field>
        </div>
      )}
      <Field label="Sitemap URL">
        <TextInput value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
      </Field>
      <Field label="Extra rules (optional)">
        <Textarea
          value={customRules}
          onChange={(e) => setCustomRules(e.target.value)}
          rows={3}
          placeholder={"User-agent: Googlebot\nDisallow: /api"}
          className="text-sm"
        />
      </Field>
      <OutputArea value={output} label="robots.txt" filename="robots.txt" rows={10} />
    </div>
  );
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function SitemapGenerator() {
  const [domain, setDomain] = useState("https://example.com");
  const [paths, setPaths] = useState("/\n/blog\n/about\n/contact");
  const [addLastmod, setAddLastmod] = useState(true);
  const [addPriority, setAddPriority] = useState(true);

  const output = useMemo(() => {
    const host = domain.trim().replace(/\/+$/, "");
    const items = paths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);

    const body = items
      .map((p, i) => {
        const loc = `${host}${p.startsWith("/") ? p : `/${p}`}`;
        const lines = [`<url>`, `  <loc>${xmlEscape(loc)}</loc>`];
        if (addLastmod) lines.push(`  <lastmod>${today}</lastmod>`);
        if (addPriority) {
          lines.push(`  <priority>${i === 0 ? "1.0" : "0.8"}</priority>`);
        }
        lines.push(`</url>`);
        return lines.join("\n");
      })
      .join("\n");

    return [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      body,
      `</urlset>`,
    ].join("\n");
  }, [domain, paths, addLastmod, addPriority]);

  return (
    <div className="space-y-6">
      <Field label="Your domain">
        <TextInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="https://example.com" />
      </Field>
      <Field label="Paths / URLs (one per line)">
        <Textarea
          value={paths}
          onChange={(e) => setPaths(e.target.value)}
          rows={6}
          placeholder={"/\n/blog\n/about"}
          className="text-sm"
        />
      </Field>
      <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-300">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={addLastmod} onChange={(e) => setAddLastmod(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Include lastmod
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={addPriority} onChange={(e) => setAddPriority(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Include priority
        </label>
      </div>
      <StatGrid>
        <Stat label="URLs in sitemap" value={paths.split("\n").filter((p) => p.trim()).length} />
      </StatGrid>
      <OutputArea value={output} label="sitemap.xml" filename="sitemap.xml" rows={12} />
    </div>
  );
}

export function SerpPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("https://example.com/blog/my-page");

  const titleLength = title.length || 0;
  const descLength = description.length || 0;
  const titleOk = titleLength <= 60;
  const descOk = descLength <= 160;

  const pixelTitle = Math.min(100, Math.round(titleLength / 60 * 100));
  const pixelDesc = Math.min(100, Math.round(descLength / 160 * 100));

  return (
    <div className="space-y-6">
      <Field label="Title">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your SEO title" />
      </Field>
      <Field label="Description">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Your meta description…"
        />
      </Field>
      <Field label="URL">
        <TextInput value={url} onChange={(e) => setUrl(e.target.value)} />
      </Field>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Google preview
        </h3>
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold dark:bg-zinc-700">
              {(url.replace(/^https?:\/\//, "").charAt(0) || "S").toUpperCase()}
            </span>
            <span className="truncate">{url}</span>
          </div>
          <div
            className={cn(
              "mt-1 cursor-pointer text-lg leading-6",
              titleOk
                ? "text-blue-700 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          >
            {title || "Your page title"}
          </div>
          <div
            className={cn(
              "mt-0.5 line-clamp-2 text-sm leading-5",
              descOk
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          >
            {description || "Your meta description will appear here."}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Snippet fit
        </h3>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Title · {titleLength}/60 chars
              </span>
              <span className={cn(titleOk ? "text-emerald-600" : "text-amber-600")}>
                {titleOk ? "Fits" : "May truncate"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn("h-full rounded-full", titleOk ? "bg-emerald-500" : "bg-amber-500")}
                style={{ width: `${pixelTitle}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Description · {descLength}/160 chars
              </span>
              <span className={cn(descOk ? "text-emerald-600" : "text-amber-600")}>
                {descOk ? "Fits" : "May truncate"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn("h-full rounded-full", descOk ? "bg-emerald-500" : "bg-amber-500")}
                style={{ width: `${pixelDesc}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function tokenize(content: string): string[] {
  return content.toLowerCase().match(/[a-z0-9'’-]+/g) ?? [];
}

const LINK_STOPWORDS = new Set(["the", "a", "an", "and", "or", "for", "of", "to", "in", "on", "with"]);

export function InternalLinkSuggestions() {
  const [content, setContent] = useState("");
  const [links, setLinks] = useState("Homepage | /\nAbout | /about\nBlog | /blog");

  const analysis = useMemo(() => {
    const contentTokens = new Set(tokenize(content));
    const candidates = links
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((s) => s.trim());
        const tokens = tokenize(label);
        const matched = tokens.filter((t) => t.length > 2 && !LINK_STOPWORDS.has(t) && contentTokens.has(t));
        const score = matched.length / Math.max(1, tokens.length);
        return { label: label || url || "", url: url || "", matched, score };
      })
      .sort((a, b) => b.score - a.score);
    return candidates;
  }, [content, links]);

  const output = useMemo(
    () =>
      analysis
        .map((c) => {
          const anchor = c.matched[0] ? c.matched[0] : c.label;
          const strength = c.score > 0.5 ? "strong" : c.score > 0 ? "possible" : "weak";
          return `[${anchor}](${c.url}) — ${strength} (${Math.round(c.score * 100)}% match)`;
        })
        .join("\n"),
    [analysis]
  );

  return (
    <div className="space-y-6">
      <Field label="Your content">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Paste the page or article you want to add internal links to…"
        />
      </Field>
      <Field label="Candidate links (label | url, one per line)">
        <Textarea
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          rows={5}
          placeholder={"Homepage | /\nAbout | /about"}
        />
      </Field>

      {analysis.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Suggested links
          </h3>
          <div className="mt-3 space-y-2">
            {analysis.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {c.label}
                    {c.url && <span className="ml-2 font-mono text-xs text-zinc-400">{c.url}</span>}
                  </p>
                  {c.matched.length > 0 && (
                    <p className="text-xs text-zinc-500">
                      Anchor suggestion: “{c.matched.join(", ")}”
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    c.score > 0.5
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : c.score > 0
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                  )}
                >
                  {Math.round(c.score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
      <OutputArea value={output} label="Link suggestions" filename="internal-links.txt" rows={6} />
    </div>
  );
}
