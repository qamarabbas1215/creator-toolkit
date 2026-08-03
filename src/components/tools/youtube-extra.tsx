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
import { OutputArea } from "@/components/ui/OutputArea";

function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function YoutubeDescriptionGenerator() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [withHashtags, setWithHashtags] = useState(true);
  const [socials, setSocials] = useState("");
  const [description, setDescription] = useState("");

  function generate() {
    const t = capFirst(topic.trim());
    if (!t) return;
    const kws = keywords
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);

    const lines: string[] = [
      `${t} — everything you need to know in one video.`,
      "",
      "In this video you'll learn:",
      ...kws.map((k) => `📌 ${k}`),
      "",
      "⏱️ Timestamps:",
      "00:00 Intro",
      "01:00 Main content",
      "",
      "👍 If this helped you, hit LIKE and SUBSCRIBE for more.",
      "",
    ];
    if (socials.trim()) {
      lines.push("🔗 Connect with me:");
      lines.push(...socials.split("\n").map((s) => s.trim()).filter(Boolean));
      lines.push("");
    }
    if (withHashtags) {
      const tags = kws
        .slice(0, 5)
        .map((k) => `#${k.replace(/\s+/g, "").toLowerCase()}`);
      lines.push(tags.join(" "));
    }
    setDescription(lines.join("\n"));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Video topic" className="min-w-48 flex-1">
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to edit videos faster"
          />
        </Field>
        <Field label="Key points (comma separated)" className="min-w-52 flex-1">
          <TextInput
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. timeline, cutting, transitions"
          />
        </Field>
        <Button onClick={generate} disabled={!topic.trim()} className="h-9">
          Generate
        </Button>
      </OptionRow>
      <Field label="Social links (one per line, optional)">
        <TextInput
          value={socials}
          onChange={(e) => setSocials(e.target.value)}
          placeholder={"https://instagram.com/yourname\nhttps://x.com/yourname"}
        />
      </Field>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={withHashtags}
          onChange={(e) => setWithHashtags(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Include hashtags
      </label>
      <OutputArea
        value={description}
        label="Video description"
        filename="youtube-description.txt"
        rows={12}
        placeholder="Generated description appears here…"
      />
    </div>
  );
}

function ctrScore(title: string): {
  score: number;
  bars: { label: string; value: number; max: number }[];
  tips: string[];
} {
  const tips: string[] = [];
  let score = 40;
  const bars: { label: string; value: number; max: number }[] = [];

  const len = title.length;
  if (len <= 60 && len >= 20) {
    score += 20;
  } else if (len > 60 && len <= 70) {
    score += 10;
    tips.push("Title is a bit long — aim for under 60 characters.");
  } else if (len < 20) {
    tips.push("Title is very short — add a specific benefit or outcome.");
  } else {
    tips.push("Title is too long — most of it will be cut off.");
  }
  bars.push({ label: "Length", value: len <= 60 ? 100 : len <= 70 ? 70 : 30, max: 100 });

  if (/\d/.test(title)) {
    score += 15;
  } else {
    tips.push("Add a number to make the benefit concrete (e.g. 5 ways…).");
  }
  bars.push({ label: "Numbers", value: /\d/.test(title) ? 100 : 20, max: 100 });

  const power = ["secret", "ultimate", "crazy", "shocking", "proven", "mistakes", "truth", "easy", "fast", "best", "never", "stop", "wrong", "blueprint"];
  const powerHits = power.filter((w) => title.toLowerCase().includes(w)).length;
  if (powerHits > 0) {
    score += Math.min(15, powerHits * 5);
  } else {
    tips.push("Add an emotional or curiosity-driven power word.");
  }
  bars.push({ label: "Power words", value: powerHits * 34, max: 100 });

  const brackets = /[([{]/.test(title) && /[)\]}»]/.test(title);
  if (brackets) score += 10;
  else tips.push("Try a bracket detail, e.g. (takes 10 minutes).");
  bars.push({ label: "Brackets", value: brackets ? 100 : 20, max: 100 });

  if (/[?]/.test(title)) score += 10;
  bars.push({ label: "Question", value: /[?]/.test(title) ? 100 : 30, max: 100 });

  if (/\p{Extended_Pictographic}/u.test(title)) {
    score += 5;
    bars.push({ label: "Emoji", value: 100, max: 100 });
  } else {
    bars.push({ label: "Emoji", value: 20, max: 100 });
  }

  const firstWord = title.trim().split(/\s+/)[0] ?? "";
  if (/[a-z]/.test(firstWord)) {
    tips.push("Capitalize each key word — it reads more clickable.");
  }

  score = Math.min(100, Math.max(0, score));
  return { score, bars, tips };
}

export function CtrAnalyzer() {
  const [title, setTitle] = useState("");
  const analysis = useMemo(() => ctrScore(title), [title]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Video title"
        placeholder="Paste your YouTube title to analyze…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={3}
      />
      <StatGrid>
        <Stat label="Characters" value={title.length} />
        <Stat
          label="CTR score"
          value={`${analysis.score}/100`}
          accent={
            analysis.score >= 70
              ? "#10b981"
              : analysis.score >= 50
                ? "#f59e0b"
                : "#ef4444"
          }
        />
        <Stat
          label="Verdict"
          value={analysis.score >= 70 ? "Strong" : analysis.score >= 50 ? "Average" : "Weak"}
        />
      </StatGrid>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Score breakdown
        </h3>
        <div className="mt-3 space-y-2">
          {analysis.bars.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-24 text-sm text-zinc-600 dark:text-zinc-400">{b.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
                  style={{ width: `${b.value}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-zinc-500">
                {b.value >= 80 ? "Good" : b.value >= 50 ? "Okay" : "Low"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {analysis.tips.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Suggestions
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {analysis.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function formatMinutes(mins: number): string {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

interface ScriptSection {
  heading: string;
  words: number;
  minutes: number;
}

function parseScript(text: string, wpm: number): ScriptSection[] {
  const lines = text.split("\n");
  const sections: ScriptSection[] = [];
  let current = { heading: "Intro", words: 0 };
  let buffer: string[] = [];

  function flush() {
    const words = buffer.join(" ").match(/[A-Za-z0-9'’-]+/g)?.length ?? 0;
    if (words > 0 || sections.length === 0) {
      sections.push({
        heading: current.heading,
        words,
        minutes: words / wpm,
      });
    }
    buffer = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(##|###|--)\s*/.test(trimmed) || /^\[.*\]$/.test(trimmed)) {
      flush();
      current = { heading: trimmed.replace(/^[#-]+\s*/, "").replace(/[\[\]]/g, "").trim() || "Section", words: 0 };
    } else if (/^\d{1,2}:\d{2}/.test(trimmed)) {
      flush();
      current = { heading: trimmed.replace(/^\d{1,2}:\d{2}\s*/, "") || "Section", words: 0 };
    } else {
      buffer.push(trimmed);
    }
  }
  flush();
  return sections.filter((s) => s.words > 0 || s.heading === "Intro");
}

export function ScriptTimer() {
  const [script, setScript] = useState("");
  const [wpm, setWpm] = useState(140);

  const sections = useMemo(() => parseScript(script, wpm), [script, wpm]);
  const totalMinutes = sections.reduce((a, s) => a + s.minutes, 0);

  const output = useMemo(
    () =>
      [
        `Total speaking time: ${formatMinutes(totalMinutes)}`,
        "",
        ...sections.map((s) => `${s.heading}: ${formatMinutes(s.minutes)} (${s.words} words)`),
      ].join("\n"),
    [sections, totalMinutes]
  );

  return (
    <div className="space-y-6">
      <Textarea
        label="Your script"
        placeholder="Paste your script. Start sections with '## Heading' or '[Section name]'…"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={10}
      />
      <OptionRow>
        <Field label="Speaking speed">
          <Select value={wpm} onChange={(e) => setWpm(Number(e.target.value))}>
            <option value={120}>Slow & clear · 120 wpm</option>
            <option value={140}>Conversational · 140 wpm</option>
            <option value={160}>Enthusiastic · 160 wpm</option>
            <option value={180}>Fast · 180 wpm</option>
          </Select>
        </Field>
        <Stat label="Total time" value={formatMinutes(totalMinutes)} accent="#ef4444" />
      </OptionRow>

      {sections.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Per section
          </h3>
          <div className="mt-3 space-y-2">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                <span className="text-zinc-700 dark:text-zinc-300">{s.heading}</span>
                <span className="tabular-nums text-zinc-500">
                  {s.words} words · {formatMinutes(s.minutes)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
      <OutputArea value={output} label="Time report" filename="script-timing.txt" rows={6} />
    </div>
  );
}

const SHORT_FORMATS = ["Tutorial", "Challenge", "Story", "Fact", "Listicle", "POV", "Reaction", "FAQ"];
const SHORT_HOOKS = [
  (t: string) => `The ${t} secret nobody talks about…`,
  (t: string) => `Stop doing ${t} wrong — do this instead.`,
  (t: string) => `3 ${t} mistakes you're making right now.`,
  (t: string) => `I tried ${t} for 30 days. Here's what happened.`,
  (t: string) => `This ${t} hack will save you hours.`,
  (t: string) => `How I mastered ${t} in just 7 days.`,
  (t: string) => `The truth about ${t} in 2026.`,
  (t: string) => `You're probably doing ${t} all wrong.`,
  (t: string) => `The fastest way to learn ${t}.`,
  (t: string) => `${t} explained in 60 seconds.`,
];

function genShortsIdea(niche: string): string {
  const t = niche.trim();
  const hook = SHORT_HOOKS[Math.floor(Math.random() * SHORT_HOOKS.length)](t);
  const fmt = SHORT_FORMATS[Math.floor(Math.random() * SHORT_FORMATS.length)];
  const cta = [
    "Save this for later — you'll need it.",
    "Follow for more daily tips.",
    "Comment 'YES' if you agree.",
    "Share this with someone who needs it.",
  ];
  return `${hook}\n\nFormat: ${fmt}\n\n${cta[Math.floor(Math.random() * cta.length)]}`;
}

export function ShortsIdeaGenerator() {
  const [niche, setNiche] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);

  function generate() {
    if (!niche.trim()) return;
    setIdeas(Array.from({ length: 6 }, () => genShortsIdea(niche)));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Your niche" className="min-w-52 flex-1">
          <TextInput
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. fitness, cooking, AI tools"
          />
        </Field>
        <Button onClick={generate} disabled={!niche.trim()} className="h-9">
          Generate ideas
        </Button>
      </OptionRow>
      {ideas.length > 0 && (
        <>
          <CopyButton text={ideas.join("\n\n---\n\n")} label="Copy all ideas" />
          <div className="grid gap-3 sm:grid-cols-2">
            {ideas.map((idea, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="whitespace-pre-line text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                  {idea}
                </p>
                <div className="mt-3 flex justify-end">
                  <CopyButton text={idea} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const CTA_GOALS = {
  subscribe: ["Don't forget to subscribe", "Sub for weekly videos", "Hit subscribe — it's free", "Join 50K+ subscribers"],
  like: ["If this helped, give it a like", "Smash that like button", "A like helps more creators find this"],
  comment: ["What did I miss? Drop it below", "Comment your biggest question", "Tell me your take below"],
  share: ["Share this with a friend", "Send this to someone who needs it", "Save & share for later"],
  signup: ["Join my free newsletter", "Grab the free checklist (link in bio)", "Get the template — link below"],
};

export function CtaGenerator() {
  const [goal, setGoal] = useState<keyof typeof CTA_GOALS>("subscribe");
  const [extra, setExtra] = useState("");
  const [ctas, setCtas] = useState<string[]>([]);

  const base = CTA_GOALS[goal] ?? CTA_GOALS.subscribe;

  function generate() {
    const extraCTA = extra.trim()
      ? [`${extra.trim()} — link in description.`]
      : [];
    setCtas([...base, ...extraCTA]);
  }

  const output = ctas.join("\n");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="CTA goal">
          <Select value={goal} onChange={(e) => setGoal(e.target.value as keyof typeof CTA_GOALS)}>
            {Object.keys(CTA_GOALS).map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Custom CTA (optional)" className="min-w-48 flex-1">
          <TextInput
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. Get the free template"
          />
        </Field>
        <Button onClick={generate} className="h-9">
          Generate
        </Button>
      </OptionRow>
      {ctas.length > 0 && (
        <>
          <CopyButton text={output} label="Copy all CTAs" />
          <div className="space-y-2">
            {ctas.map((cta, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-sm leading-6 text-zinc-900 dark:text-zinc-100">{cta}</p>
                <CopyButton text={cta} className="shrink-0" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function normalizeTime(token: string): string {
  const parts = token.split(":").map((p) => p.trim());
  const seconds = parts.length === 1 ? Number(parts[0]) || 0 : Number(parts[1]) || 0;
  const minutes = parts.length >= 2 ? Number(parts[0]) || 0 : 0;
  const hours = parts.length === 3 ? Number(parts[0]) || 0 : 0;
  const mm = hours * 60 + minutes;
  const hh = Math.floor(mm / 60);
  const m = mm % 60;
  const s = seconds;
  if (hh > 0) return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseChapters(text: string): { time: string; title: string }[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:[-–—]\s*)?(.*)$/);
      if (m) return { time: normalizeTime(m[1]), title: m[2].trim() || "Chapter" };
      return null;
    })
    .filter((c): c is { time: string; title: string } => c !== null);
}

export function ChapterGenerator() {
  const [input, setInput] = useState("");
  const raw = true;

  const chapters = useMemo(() => parseChapters(input), [input]);
  const output = useMemo(
    () => chapters.map((c) => `${c.time} ${raw ? c.title : capFirst(c.title)}`).join("\n"),
    [chapters, raw]
  );

  return (
    <div className="space-y-6">
      <Textarea
        label="Timestamps + titles"
        placeholder={"0:00 Intro\n1:35 Tools I use\n5:20 Editing workflow"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        hint="One chapter per line: time followed by the title."
      />
      <Stat label="Chapters" value={chapters.length} accent="#ef4444" />
      <OutputArea
        value={output}
        label="YouTube chapters (copy & paste)"
        filename="chapters.txt"
        rows={8}
      />
    </div>
  );
}

const KEYWORD_PREFIXES = [
  "how to",
  "best",
  "top",
  "what is",
  "why",
  "tutorial",
  "for beginners",
  "vs",
  "tips",
  "ideas",
  "guide",
  "review",
  "2026",
  "examples",
  "step by step",
];

function keywordVariants(seed: string): string[] {
  const s = seed.trim().toLowerCase();
  if (!s) return [];
  return KEYWORD_PREFIXES.map((p) =>
    p === "vs" ? `${s} vs alternatives` : `${p} ${s}`
  );
}

export function YoutubeKeywordFinder() {
  const [seed, setSeed] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  function generate() {
    setKeywords(keywordVariants(seed));
  }

  const output = keywords.join("\n");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Seed keyword" className="min-w-48 flex-1">
          <TextInput
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="e.g. video editing"
          />
        </Field>
        <Button onClick={generate} disabled={!seed.trim()} className="h-9">
          Find keywords
        </Button>
      </OptionRow>
      {keywords.length > 0 && (
        <>
          <CopyButton text={output} label="Copy all keywords" />
          <div className="flex flex-wrap gap-2">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                {k}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
