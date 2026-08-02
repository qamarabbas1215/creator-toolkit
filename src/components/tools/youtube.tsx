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

const POWER_WORDS = [
  "Ultimate",
  "Secret",
  "Crazy",
  "Simple",
  "Powerful",
  "Shocking",
  "Proven",
  "Beginner-Friendly",
  "Complete",
  "Mind-Blowing",
];

const TITLE_OUTCOMES = [
  "Step-by-Step Guide",
  "What Nobody Tells You",
  "For Beginners",
  "In 2026",
  "Full Tutorial",
  "Pro Tips That Work",
];

function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateTitles(topic: string, outcome: string): string[] {
  const t = capFirst(topic.trim());
  if (!t) return [];
  const p = POWER_WORDS[Math.floor(Math.random() * POWER_WORDS.length)];
  const outcomes = [outcome, ...TITLE_OUTCOMES.filter((o) => o !== outcome)];
  return [
    `${p} ${t} — ${outcomes[0]}`,
    `How to Master ${t} (${outcomes[1]})`,
    `I Tried ${t} For 30 Days — Here's What Happened`,
    `The Truth About ${t} Nobody Talks About`,
    `5 ${t} Mistakes You're Making Right Now`,
    `${t} Explained in 10 Minutes`,
    `Stop Doing ${t} The WRONG Way`,
    `The ${t} Blueprint for Absolute Beginners`,
    `${t}: What I Wish I Knew Before Starting`,
    `Why Everyone's Talking About ${t} Right Now`,
    `${p} ${t} Tips That Actually Work in 2026`,
    `${t} From Zero to Pro — The Complete ${outcomes[0]}`,
  ];
}

function titleScore(title: string): number {
  let score = 50;
  const len = title.length;
  if (len <= 60) score += 20;
  else if (len <= 70) score += 12;
  else score -= 10;
  if (/\d/.test(title)) score += 10;
  if (/\b(how|why|what|stop|mistakes|truth|secret|guide|tutorial)\b/i.test(title))
    score += 10;
  if (POWER_WORDS.some((w) => title.includes(w))) score += 5;
  if (/['"…]/.test(title)) score += 5;
  return Math.min(100, Math.max(0, score));
}

function TitleRow({ title }: { title: string }) {
  const score = titleScore(title);
  const ok = title.length <= 70;
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
          <span className={cn(ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
            {title.length} chars {ok ? "✓" : "— too long"}
          </span>
          <span className="text-zinc-400">CTR score: {score}/100</span>
        </div>
      </div>
      <CopyButton text={title} className="shrink-0" />
    </div>
  );
}

export function YoutubeTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [outcome, setOutcome] = useState(TITLE_OUTCOMES[0]);
  const [titles, setTitles] = useState<string[]>([]);

  function generate() {
    setTitles(generateTitles(topic, outcome));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Topic or keyword" className="min-w-52 flex-1">
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. making money with AI"
          />
        </Field>
        <Field label="Angle" className="min-w-44">
          <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            {TITLE_OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </Field>
        <Button
          onClick={generate}
          disabled={!topic.trim()}
          className="h-9"
        >
          Generate titles
        </Button>
      </OptionRow>

      {titles.length > 0 && (
        <div className="space-y-2">
          {titles.map((title, i) => (
            <TitleRow key={`${title}-${i}`} title={title} />
          ))}
        </div>
      )}
    </div>
  );
}

function tagVariants(keyword: string): string[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return [];
  return [
    k,
    `${k} tips`,
    `how to ${k}`,
    `best ${k}`,
    `${k} tutorial`,
    `${k} for beginners`,
    `${k} 2026`,
    `${k} ideas`,
    `${k} guide`,
    `${k} explained`,
    `${k} tutorial for beginners`,
    `top ${k}`,
  ];
}

export function YoutubeTagGenerator() {
  const [keywords, setKeywords] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  function generate() {
    const base = keywords
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    const all = base.flatMap(tagVariants);
    const defaults = [
      "content creator",
      "youtube tips",
      "creator tips",
      "viral",
      "shorts",
      "tutorial",
      "how to",
    ];
    const pool = [...new Set([...all, ...defaults])];
    setTags(pool.slice(0, 60));
  }

  const commaOutput = tags.join(", ");
  const hashtagOutput = tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Keywords (comma separated)" className="min-w-52 flex-1">
          <TextInput
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. video editing, thumbnails, youtube growth"
          />
        </Field>
        <Button onClick={generate} disabled={!keywords.trim()} className="h-9">
          Generate tags
        </Button>
      </OptionRow>

      {tags.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={commaOutput} label="Copy comma-separated" />
            <CopyButton text={hashtagOutput} label="Copy hashtags" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function generateHooks(topic: string): string[] {
  const t = capFirst(topic.trim());
  if (!t) return [];
  return [
    `Stop scrolling — ${t} is about to change everything.`,
    `Nobody tells you this about ${t}…`,
    `I was completely wrong about ${t}.`,
    `This ${t} secret saved me 10 hours a week.`,
    `If you're doing ${t}, you're doing it wrong.`,
    `The ${t} secret that took me years to learn.`,
    `Don't start ${t} until you watch this.`,
    `How I mastered ${t} in just 30 days.`,
    `3 things I wish I knew before starting ${t}.`,
    `The uncomfortable truth about ${t} in 2026.`,
  ];
}

export function YoutubeHookGenerator() {
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState<string[]>([]);

  function generate() {
    setHooks(generateHooks(topic));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Video topic" className="min-w-52 flex-1">
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. starting a YouTube channel"
          />
        </Field>
        <Button onClick={generate} disabled={!topic.trim()} className="h-9">
          Generate hooks
        </Button>
      </OptionRow>

      {hooks.length > 0 && (
        <div className="space-y-2">
          <CopyButton text={hooks.join("\n\n")} label="Copy all hooks" />
          {hooks.map((hook, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm leading-6 text-zinc-900 dark:text-zinc-100">
                “{hook}”
              </p>
              <CopyButton text={hook} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const THUMBNAIL_PRESETS = [
  { label: "16:9 · 1280×720", w: 1280, h: 720 },
  { label: "16:9 · 1920×1080", w: 1920, h: 1080 },
  { label: "9:16 · 720×1280 (Shorts)", w: 720, h: 1280 },
  { label: "1:1 · 1080×1080", w: 1080, h: 1080 },
];

function analyzeThumbnail(
  text: string,
  fontSize: number,
  width: number
): { score: number; warnings: string[]; wordCount: number } {
  const warnings: string[] = [];
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  let score = 50;

  if (wordCount <= 6) score += 25;
  else if (wordCount <= 8) score += 10;
  else {
    score -= 20;
    warnings.push(
      "Too many words — aim for 6 or fewer for maximum impact."
    );
  }

  const relativeSize = (fontSize / width) * 100;
  if (relativeSize >= 9) score += 20;
  else if (relativeSize >= 6) score += 8;
  else {
    score -= 10;
    warnings.push(
      "Text may be too small on mobile — increase the font size."
    );
  }

  if (text.length <= 40) score += 5;
  else warnings.push("Keep the text short — it should be a headline, not a paragraph.");

  if (wordCount >= 2 && wordCount <= 5) score += 10;

  if (score < 40)
    warnings.push("Low impact — add emotional words or a clear benefit.");
  else if (score >= 80)
    warnings.push("Great thumbnail text — clear, readable, and punchy.");

  return { score: Math.min(100, Math.max(0, score)), warnings, wordCount };
}

export function ThumbnailTextChecker() {
  const [text, setText] = useState("");
  const [preset, setPreset] = useState(0);
  const [fontSize, setFontSize] = useState(140);

  const presetInfo = THUMBNAIL_PRESETS[preset];
  const analysis = useMemo(
    () => analyzeThumbnail(text, fontSize, presetInfo.w),
    [text, fontSize, presetInfo.w]
  );
  const previewFont = (fontSize / presetInfo.w) * 1280;

  return (
    <div className="space-y-6">
      <Textarea
        label="Thumbnail text"
        placeholder="e.g. 5 MISTAKES YOU MAKE…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <OptionRow>
        <Field label="Canvas size" className="min-w-48 flex-1">
          <Select value={preset} onChange={(e) => setPreset(Number(e.target.value))}>
            {THUMBNAIL_PRESETS.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={`Font size · ${fontSize}px`} className="min-w-40">
          <input
            type="range"
            min={60}
            max={260}
            step={10}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="h-9 w-full accent-violet-600"
          />
        </Field>
      </OptionRow>

      <StatGrid>
        <Stat label="Words" value={analysis.wordCount} />
        <Stat label="Characters" value={text.length} />
        <Stat
          label="Readability score"
          value={`${analysis.score}/100`}
          accent={analysis.score >= 70 ? "#10b981" : analysis.score >= 50 ? "#f59e0b" : "#ef4444"}
        />
      </StatGrid>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Thumbnail preview
        </h3>
        <div
          className="mt-3 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 text-center font-black uppercase text-white"
          style={{ aspectRatio: `${presetInfo.w} / ${presetInfo.h}` }}
        >
          <span
            className="max-w-[90%] leading-tight"
            style={{ fontSize: `${Math.min(previewFont, 120)}px` }}
          >
            {text || "Your text"}
          </span>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Recommendations
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {analysis.warnings.length === 0 && (
            <li className="text-zinc-500">No issues detected.</li>
          )}
          {analysis.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="mt-0.5">•</span>
              {w}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
