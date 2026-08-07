"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  Select,
  Stat,
  StatGrid,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import {
  analyzeText,
  countSyllables,
  readingLevelLabel,
  splitWords,
} from "@/lib/text";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = Math.abs(seed) || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ReadingEaseChecker() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const stats = analyzeText(text);
    const ease = stats.readingEase;
    const label = readingLevelLabel(ease);
    const color =
      ease >= 60
        ? "text-emerald-600 dark:text-emerald-400"
        : ease >= 30
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";
    return { stats, ease, label, color };
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste an article or paragraph to score its readability…"
      />
      {result.stats.words > 0 && (
        <>
          <Card>
            <div className="flex items-baseline gap-3">
              <span className={cn("text-4xl font-bold tabular-nums", result.color)}>
                {result.ease.toFixed(1)}
              </span>
              <div>
                <p className="font-semibold">{result.label}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Flesch Reading Ease (0–100)
                </p>
              </div>
            </div>
          </Card>
          <StatGrid>
            <Stat label="Syllables" value={result.stats.syllables} />
            <Stat label="Words" value={result.stats.words} />
            <Stat label="Sentences" value={result.stats.sentences} />
            <Stat label="Avg syllables / word" value={(result.stats.syllables / Math.max(1, result.stats.words)).toFixed(2)} />
          </StatGrid>
        </>
      )}
    </div>
  );
}

export function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState("");

  const analysis = useMemo(() => {
    const text = headline.trim();
    if (!text) return null;
    const stats = analyzeText(text);
    const words = stats.words;
    const lengthScore = words >= 6 && words <= 12 ? 10 : words < 6 ? 7 : 6;
    const powerWords = ["secret", "proven", "powerful", "essential", "amazing", "ultimate", "free", "easy", "now", "new", "instant", "boost"];
    const powerHits = powerWords.filter((w) => text.toLowerCase().includes(w)).length;
    const powerScore = Math.min(10, 4 + powerHits * 2);
    const numberScore = /\d/.test(text) ? 9 : 6;
    const questionScore = /[?]/.test(text) ? 8 : 7;
    const punctuationScore = /[!.?]/.test(text) ? 9 : 6;
    const score = Math.round((lengthScore + powerScore + numberScore + questionScore + punctuationScore) / 5);
    return { text, words, score, powerHits, lengthScore, powerScore, numberScore, questionScore, punctuationScore };
  }, [headline]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        rows={3}
        placeholder="Write or paste a headline to score…"
      />
      {analysis && (
        <Card>
          <div className="flex items-baseline gap-3">
            <span className={cn("text-4xl font-bold tabular-nums", analysis.score >= 8 ? "text-emerald-600" : analysis.score >= 6 ? "text-amber-600" : "text-red-600")}>
              {analysis.score}/10
            </span>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {analysis.score >= 8 ? "Strong headline" : analysis.score >= 6 ? "Decent — could be sharper" : "Needs work"}
            </p>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            <li className="flex justify-between">
              <span>Word count ({analysis.words})</span>
              <span className="font-semibold">{analysis.lengthScore}/10</span>
            </li>
            <li className="flex justify-between">
              <span>Power words found ({analysis.powerHits})</span>
              <span className="font-semibold">{analysis.powerScore}/10</span>
            </li>
            <li className="flex justify-between">
              <span>Numbers / specificity</span>
              <span className="font-semibold">{analysis.numberScore}/10</span>
            </li>
            <li className="flex justify-between">
              <span>Question / engagement</span>
              <span className="font-semibold">{analysis.questionScore}/10</span>
            </li>
            <li className="flex justify-between">
              <span>Punctuation impact</span>
              <span className="font-semibold">{analysis.punctuationScore}/10</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}

const BLOG_TOPICS = [
  "10 Proven Ways to Grow Your Email List This Year",
  "How to Write Blog Posts That Actually Get Read",
  "The Beginner's Guide to Starting a Side Hustle",
  "Why Your Content Isn't Converting (and How to Fix It)",
  "7 Tools Every Creative Professional Needs in 2026",
  "How We Grew Our Audience 3x in Six Months",
  "The Complete Checklist for Launching a Product",
  "What Nobody Tells You About Working From Home",
  "5 Mistakes to Avoid When Building a Personal Brand",
  "How to Repurpose One Idea Into 30 Pieces of Content",
];

const BLOG_FORMATS = [
  "Ultimate Guide to {topic}",
  "{topic}: Everything You Need to Know",
  "How to {topic} in {number} Easy Steps",
  "The {number} Best {topic} Strategies",
  "Why {topic} Matters More Than Ever",
  "Common {topic} Mistakes to Avoid",
  "A Simple Plan for {topic}",
  "The Future of {topic}: What's Next",
];

export function BlogTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const titles = useMemo(() => {
    if (topic.trim().length > 1) {
      const base = topic.trim().toLowerCase().replace(/[.!,]$/, "");
      return shuffle(
        BLOG_FORMATS.map((f) =>
          f
            .replace("{topic}", base)
            .replace("{number}", String(2 + (Math.abs(seed) % 7)))
        ),
        seed
      ).slice(0, 5);
    }
    return shuffle(BLOG_TOPICS, seed).slice(0, 5);
  }, [topic, seed]);

  const output = titles.join("\n");

  return (
    <div className="space-y-6">
      <Field label="Topic (optional)">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. content marketing"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <Button onClick={() => setSeed((s) => s + 1)}>New ideas</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Blog post title ideas" filename="blog-titles.txt" rows={5} />
    </div>
  );
}

const ESSAY_TYPES = ["argumentative", "persuasive", "expository", "narrative", "compare-and-contrast", "analytical"];
const ESSAY_TEMPLATES = [
  "{topic}: A {type} Perspective",
  "The Case For and Against {topic}",
  "How {topic} Shapes Our Everyday Lives",
  "Understanding {topic} Through a {type} Lens",
  "Five Key Arguments About {topic}",
  "Why {topic} Matters in the Modern World",
];

export function EssayTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState(ESSAY_TYPES[0]);
  const [seed, setSeed] = useState(1);

  const titles = useMemo(() => {
    const base = topic.trim() || "Technology";
    return shuffle(
      ESSAY_TEMPLATES.map((t) => t.replace("{topic}", base).replace("{type}", type)),
      seed
    ).slice(0, 5);
  }, [topic, type, seed]);

  const output = titles.join("\n");

  return (
    <div className="space-y-6">
      <OptionRowInline>
        <Field label="Essay topic">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. social media"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </Field>
        <Field label="Essay type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {ESSAY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={() => setSeed((s) => s + 1)}>New ideas</Button>
      </OptionRowInline>
      <OutputArea value={output} label="Essay title ideas" filename="essay-titles.txt" rows={5} />
    </div>
  );
}

function OptionRowInline({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-end gap-4">{children}</div>;
}

const RHYME_WORDS: Record<string, string[]> = {
  cat: ["bat", "hat", "mat", "pat", "rat", "sat", "flat", "chat", "that"],
  day: ["way", "say", "may", "play", "stay", "today", "away", "grey", "display"],
  light: ["night", "right", "sight", "bright", "white", "height", "kite", "might"],
  run: ["sun", "fun", "done", "one", "begun", "outdone", "overrun", "gun"],
  song: ["long", "strong", "wrong", "throng", "belong", "along", "drawn"],
  blue: ["true", "new", "few", "through", "grew", "view", "knew", "due"],
  time: ["rhyme", "climb", "prime", "sublime", "chime", "mime", "crime"],
  bright: ["night", "light", "right", "sight", "height", "mite", "white"],
  know: ["go", "so", "show", "grow", "flow", "slow", "glow", "below"],
  heart: ["start", "art", "part", "chart", "smart", "apart", "depart"],
};

const RHYME_FALLBACK = ["try adding a different word — rhymes depend on sound, not spelling"];

export function RhymeFinder() {
  const [word, setWord] = useState("");

  const rhymes = useMemo(() => {
    const key = word.trim().toLowerCase();
    if (!key) return [];
    return RHYME_WORDS[key] ?? RHYME_FALLBACK;
  }, [word]);

  return (
    <div className="space-y-6">
      <Field label="Word">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="e.g. cat, light, blue"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </Field>
      {rhymes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {rhymes.map((r) => (
            <span key={r} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              {r}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Rhymes for a curated set of common words are included instantly.
      </p>
    </div>
  );
}

export function SyllableCounter() {
  const [text, setText] = useState("");

  const rows = useMemo(() => {
    const list = splitWords(text);
    return [...new Set(list.map((w) => w.toLowerCase()))]
      .map((w) => ({ word: w, syllables: countSyllables(w) }))
      .sort((a, b) => b.syllables - a.syllables)
      .slice(0, 50);
  }, [text]);

  const total = useMemo(() => countSyllables(text), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type words to count syllables per word and in total…"
      />
      {text.trim() && (
        <StatGrid>
          <Stat label="Total syllables" value={total} />
          <Stat label="Unique words scanned" value={rows.length} />
        </StatGrid>
      )}
      {rows.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Per word (top 50)</h3>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
            {rows.map((r) => (
              <div key={r.word} className="flex justify-between text-sm">
                <span className="truncate text-zinc-600 dark:text-zinc-300">{r.word}</span>
                <span className="tabular-nums text-zinc-400">{r.syllables}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

const HAIKU_LINES = [
  ["cold winter morning", "a blanket of fresh white snow", "birds find breakfast now"],
  ["an old silent pond", "a frog jumps into the pond", "splash! silence again"],
  ["the light of a candle", "is transferred to another", "springtime of wisdom"],
  ["over the winter", "the snow has finally melted", "cherry blossoms bloom"],
  ["gentle autumn wind", "leaves dance down to the wet ground", "the season turns gold"],
  ["warm summer evening", "cicadas sing through the dusk", "stars begin to wake"],
  ["quiet mountain trail", "a fox crosses the soft path", "morning mist lingers"],
  ["the moon glows above", "waves whisper against the shore", "a lone boat drifts on"],
  ["first morning coffee", "steam rises into cool air", "day begins slowly"],
  ["empty city streets", "one lamp post hums in the rain", "footsteps echo soft"],
];

export function HaikuGenerator() {
  const [seed, setSeed] = useState(1);

  const haiku = useMemo(() => pick(HAIKU_LINES, seed), [seed]);
  const output = haiku.join("\n");

  return (
    <div className="space-y-6">
      <Button onClick={() => setSeed((s) => s + 1)}>New haiku</Button>
      <Card className="border-dashed">
        <p className="whitespace-pre-line text-center text-lg italic leading-8 text-zinc-700 dark:text-zinc-200">
          {output}
        </p>
        <p className="mt-2 text-center text-xs text-zinc-400">
          5 · 7 · 5 syllables
        </p>
      </Card>
    </div>
  );
}

const ACRONYM_PATTERNS = [
  "{w1} {w2} {w3}",
  "{w1}-{w2}",
  "{w1} & {w2}",
  "{w1} {w2} {w3} System",
  "The {w1} {w2} Framework",
  "{w1} {w2} {w3} {w4}",
];

export function AcronymGenerator() {
  const [phrase, setPhrase] = useState("");
  const [seed, setSeed] = useState(1);

  const result = useMemo(() => {
    const words = phrase
      .split(/\s+/)
      .filter((w) => /^[a-z]/i.test(w))
      .map((w) => w.replace(/[^a-zA-Z]/g, ""));
    if (words.length < 2) return null;
    const letters = words.map((w) => w[0].toUpperCase()).join("");
    const spellings = words.map((w) => `${w[0].toUpperCase()}.`).join(" ");
    return { letters, spellings, count: words.length };
  }, [phrase]);

  const output = useMemo(() => {
    if (!result) return "";
    const w1 = result.letters[0];
    const w2 = result.letters[1] ?? "";
    const w3 = result.letters[2] ?? "";
    const w4 = result.letters[3] ?? "";
    const variants = shuffle(ACRONYM_PATTERNS, seed).slice(0, 5).map((p) =>
      p.replace("{w1}", w1).replace("{w2}", w2).replace("{w3}", w3).replace("{w4}", w4)
    );
    return variants.join("\n");
  }, [result, seed]);

  return (
    <div className="space-y-6">
      <Field label="Words or phrase">
        <div className="flex gap-2">
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="e.g. Search Engine Optimization"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <Button onClick={() => setSeed((s) => s + 1)}>Vary</Button>
        </div>
      </Field>
      {result && (
        <Card>
          <div className="text-center">
            <p className="text-5xl font-bold tracking-widest text-violet-600 dark:text-violet-400">
              {result.letters}
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{result.spellings}</p>
            <p className="mt-1 text-xs text-zinc-400">Initials from {result.count} words</p>
          </div>
        </Card>
      )}
      {output && <OutputArea value={output} label="Acronym style variants" filename="acronym-variants.txt" rows={5} />}
    </div>
  );
}

const RESIGNATION_TEMPLATES = `
Dear {manager},

Please accept this letter as formal notification that I am resigning from my position as {role} at {company}, effective {weeks} weeks from today, {date}.

I want to thank you for the opportunities I've had during my time at {company}. I have learned a great deal and genuinely appreciate the support and guidance I've received.

I'll do everything I can to ensure a smooth handover of my responsibilities before my departure. Please let me know how I can help during this transition.

Thank you again for everything. I wish {company} continued success.

Sincerely,
{name}
`.trim();

export function ResignationLetterGenerator() {
  const [manager, setManager] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [weeks, setWeeks] = useState(2);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  const output = useMemo(
    () =>
      RESIGNATION_TEMPLATES.replaceAll("{manager}", manager || "[Manager's name]")
        .replaceAll("{role}", role || "[Your role]")
        .replaceAll("{company}", company || "[Company]")
        .replaceAll("{weeks}", String(weeks))
        .replaceAll("{date}", date || "[Date]")
        .replaceAll("{name}", name || "[Your name]"),
    [manager, role, company, weeks, date, name]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Manager's name">
          <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} className={INPUT_CLS} />
        </Field>
        <Field label="Your role">
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className={INPUT_CLS} />
        </Field>
        <Field label="Company">
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT_CLS} />
        </Field>
        <Field label="Notice period (weeks)">
          <input type="number" min={1} max={12} value={weeks} onChange={(e) => setWeeks(Number(e.target.value) || 1)} className={INPUT_CLS} />
        </Field>
        <Field label="Last working day">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT_CLS} />
        </Field>
        <Field label="Your name">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLS} />
        </Field>
      </div>
      <OutputArea value={output} label="Resignation letter" filename="resignation-letter.txt" rows={16} />
    </div>
  );
}

const COLD_EMAIL_OPENERS = [
  "I came across {company} while researching {industry} and was impressed by {detail}.",
  "I've been following {company}'s work in {industry} and noticed {detail}.",
  "Hi {name}, I have a quick idea that could help {company} with {detail}.",
];

const COLD_EMAIL_CLOSERS = [
  "Would you be open to a 10-minute call this week?",
  "Is this something worth exploring together? Happy to share more.",
  "If it's helpful, I can send over a short one-pager.",
];

export function ColdEmailGenerator() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [detail, setDetail] = useState("");
  const [offer, setOffer] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const opener = pick(COLD_EMAIL_OPENERS, seed)
      .replaceAll("{name}", name || "[First name]")
      .replaceAll("{company}", company || "[Company]")
      .replaceAll("{industry}", industry || "[Industry]")
      .replaceAll("{detail}", detail || "[a specific observation]");
    const closer = pick(COLD_EMAIL_CLOSERS, seed + 1);
    return `Subject: Quick idea for ${company || "[Company]"}\n\nHi ${name || "[First name]"},\n\n${opener}\n\n${offer || "[Your offer or value proposition]"}\n\n${closer}\n\nBest,\n[Your name]\n[Your title]`;
  }, [name, company, industry, detail, offer, seed]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Prospect name">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLS} placeholder="Alex" />
        </Field>
        <Field label="Company">
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT_CLS} placeholder="Acme Inc." />
        </Field>
        <Field label="Industry">
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className={INPUT_CLS} placeholder="SaaS" />
        </Field>
        <Field label="Something you noticed">
          <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)} className={INPUT_CLS} placeholder="their new product launch" />
        </Field>
      </div>
      <Field label="Your offer / value proposition">
        <textarea value={offer} onChange={(e) => setOffer(e.target.value)} rows={2} className={INPUT_CLS} placeholder="e.g. I help teams cut onboarding time by 40% with a lightweight checklist tool." />
      </Field>
      <div className="flex gap-2">
        <Button onClick={() => setSeed((s) => s + 1)}>Rewrite</Button>
      </div>
      <OutputArea value={output} label="Cold email draft" filename="cold-email.txt" rows={14} />
    </div>
  );
}

const EMAIL_SUBJECT_STYLES: Record<string, string[]> = {
  curiosity: ["{topic}? Not what you'd expect", "The {topic} secret few people know", "What I learned about {topic}"],
  direct: ["{topic}: next steps", "Your {topic} plan", "Quick question about {topic}"],
  numbers: ["5 {topic} tips", "3 mistakes with {topic}", "10 {topic} ideas"],
  urgency: ["Last chance: {topic}", "Closing soon: {topic}", "Don't miss this {topic} update"],
  personal: ["A note about {topic}", "Wanted to share this on {topic}", "Thinking of you + {topic}"],
};

export function EmailSubjectGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<keyof typeof EMAIL_SUBJECT_STYLES>("curiosity");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "your project";
    const lines = shuffle(EMAIL_SUBJECT_STYLES[style], seed).slice(0, 5).map((t) => t.replaceAll("{topic}", base));
    return lines.join("\n");
  }, [topic, style, seed]);

  return (
    <div className="space-y-6">
      <Field label="Topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. the pricing update" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New subjects</Button>
        </div>
      </Field>
      <Field label="Style">
        <Select value={style} onChange={(e) => setStyle(e.target.value as keyof typeof EMAIL_SUBJECT_STYLES)}>
          {Object.keys(EMAIL_SUBJECT_STYLES).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </Field>
      <OutputArea value={output} label="Subject line ideas" filename="email-subjects.txt" rows={5} />
    </div>
  );
}

const THANKYOU_OCCASIONS: Record<string, { opener: string; body: string; closer: string }> = {
  interview: {
    opener: "Thank you so much for taking the time to meet with me today.",
    body: "I really appreciated learning more about {company} and the {role} role. Our conversation reinforced my interest in the position — I was especially excited about the team's work on {detail}.",
    closer: "I look forward to hearing about the next steps. Please don't hesitate to reach out if I can provide anything else.",
  },
  gift: {
    opener: "Thank you so much for the wonderful gift!",
    body: "It was incredibly thoughtful of you. I already {detail} — it honestly made my day. Your generosity means a lot to me.",
    closer: "Thank you again for your kindness. I can't wait to see you soon!",
  },
  boss: {
    opener: "I wanted to take a moment to thank you for your support and guidance.",
    body: "Your feedback on {detail} genuinely helped me grow. Working with someone so {quality} makes all the difference, and I'm grateful for the mentorship.",
    closer: "Thank you for everything you do. It doesn't go unnoticed.",
  },
  client: {
    opener: "Thank you for your continued trust in us.",
    body: "We truly appreciate the opportunity to work with you on {detail}. Your feedback helps us improve, and we're proud of what we've accomplished together.",
    closer: "Looking forward to our next project together!",
  },
};

export function ThankYouNoteGenerator() {
  const [occasion, setOccasion] = useState<keyof typeof THANKYOU_OCCASIONS>("interview");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [detail, setDetail] = useState("");
  const [quality, setQuality] = useState("");
  const [name] = useState("");

  const output = useMemo(() => {
    const t = THANKYOU_OCCASIONS[occasion];
    const body = t.body
      .replaceAll("{company}", company || "[Company]")
      .replaceAll("{role}", role || "[Role]")
      .replaceAll("{detail}", detail || "[the specific thing]")
      .replaceAll("{quality}", quality || "[quality]");
    return `${t.opener}\n\n${body}\n\n${t.closer}\n\nBest,\n${name || "[Your name]"}`;
  }, [occasion, company, role, detail, quality, name]);

  return (
    <div className="space-y-6">
      <OptionRowInline>
        <Field label="Occasion">
          <Select value={occasion} onChange={(e) => setOccasion(e.target.value as keyof typeof THANKYOU_OCCASIONS)}>
            {Object.keys(THANKYOU_OCCASIONS).map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Company / role (interview)">
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={INPUT_CLS} placeholder="Acme" />
        </Field>
      </OptionRowInline>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="The specific detail">
          <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)} className={INPUT_CLS} placeholder="e.g. the onboarding demo" />
        </Field>
        <Field label="Role (interview)">
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className={INPUT_CLS} placeholder="Marketing Manager" />
        </Field>
        <Field label="Quality (boss)">
          <input type="text" value={quality} onChange={(e) => setQuality(e.target.value)} className={INPUT_CLS} placeholder="patient" />
        </Field>
      </div>
      <OutputArea value={output} label="Thank-you note" filename="thank-you-note.txt" rows={12} />
    </div>
  );
}

const CONCLUSION_OPENERS = [
  "In conclusion, {topic} is far more than a passing trend — it shapes how we work and create.",
  "To wrap up, the evidence around {topic} is clear: it pays to pay attention.",
  "Ultimately, {topic} comes down to one thing: consistent, intentional action.",
  "So, what does all of this mean for {topic}? Quite a lot, actually.",
];

const CONCLUSION_MIDDLES = [
  "By focusing on the core principles we've covered — {points} — anyone can make steady progress.",
  "The key takeaway is that {points} are within reach for anyone willing to start small.",
  "Whether you're just beginning or already deep in the journey, applying {points} will move the needle.",
];

const CONCLUSION_CLOSERS = [
  "The next step is yours to take. Start today, and let the results speak for themselves.",
  "Start with one small change, and build from there — consistency beats intensity.",
  "Now it's time to act. Pick one idea, try it, and adjust as you go.",
];

export function ConclusionGenerator() {
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<"neutral" | "inspirational">("neutral");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "this topic";
    const list = points.trim() || "the strategies above";
    let opener = pick(CONCLUSION_OPENERS, seed).replaceAll("{topic}", base);
    const middle = pick(CONCLUSION_MIDDLES, seed + 1).replaceAll("{points}", list);
    let closer = pick(CONCLUSION_CLOSERS, seed + 2);
    if (tone === "inspirational") {
      opener = opener.replace("consistent, intentional action", "vision, grit, and consistency");
      closer = "You have everything you need to begin. Take the first step today.";
    }
    return `${opener}\n\n${middle}\n\n${closer}`;
  }, [topic, points, tone, seed]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Topic">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className={INPUT_CLS} placeholder="e.g. remote work" />
        </Field>
        <Field label="Key points (comma separated)">
          <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} className={INPUT_CLS} placeholder="planning, focus, tools" />
        </Field>
      </div>
      <OptionRowInline>
        <Field label="Tone">
          <Select value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
            <option value="neutral">Neutral</option>
            <option value="inspirational">Inspirational</option>
          </Select>
        </Field>
        <Button onClick={() => setSeed((s) => s + 1)}>Rewrite</Button>
      </OptionRowInline>
      <OutputArea value={output} label="Conclusion paragraph" filename="conclusion.txt" rows={8} />
    </div>
  );
}
