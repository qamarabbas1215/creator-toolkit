"use client";

import { useMemo, useState } from "react";
import { Field, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { formatJSON } from "@/lib/format";

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

const VIDEO_FORMATS = [
  "Tutorial: How to {topic} from Scratch",
  "The TRUTH About {topic} (What Nobody Says)",
  "I Tried {topic} for 30 Days — Here's What Happened",
  "{topic}: The Complete Beginner's Guide",
  "5 Mistakes to Avoid When {topic}",
  "Why {topic} Is Blowing Up in 2026",
  "Reacting to {topic} Trends",
  "Vlog: A Day of {topic}",
  "Deep Dive: The Science of {topic}",
  "Comparing {topic} vs. {alternative}",
];

export function VideoIdeaGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const ideas = useMemo(() => {
    const base = topic.trim().toLowerCase().replace(/[.!?]$/, "") || "content creation";
    return shuffle(
      VIDEO_FORMATS.map((f) =>
        f
          .replaceAll("{topic}", base)
          .replaceAll("{alternative}", pick(["the old way", "paid tools", "free options"], seed))
      ),
      seed
    ).slice(0, 5);
  }, [topic, seed]);

  const output = ideas.join("\n");

  return (
    <div className="space-y-6">
      <Field label="Topic or niche">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. cooking at home" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New ideas</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Video ideas" filename="video-ideas.txt" rows={6} />
    </div>
  );
}

const OUTLINE_HOOKS = [
  "00:00 Hook — the surprising reason this matters to you",
  "00:15 Intro — what we'll cover and what you'll get out of it",
];
const OUTLINE_MIDS = [
  "Key point 1: {point}",
  "Key point 2: {point}",
  "Common mistakes and how to avoid them",
  "Demonstration / walkthrough",
];
const OUTLINE_ENDS = [
  "Recap and main takeaways",
  "CTA — subscribe for more {topic} content",
];

export function VideoOutlineGenerator() {
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "your topic";
    const pointList = points
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter(Boolean);
    const mids = pointList.length >= 2 ? pointList.slice(0, 3) : OUTLINE_MIDS.map((m) => m.replaceAll("{point}", "expanded example"));
    const lines = [...OUTLINE_HOOKS, ...mids.map((m, i) => `0${i + 3}:00 ${m.replaceAll("{point}", mids.length > i ? mids[i] : "example")}`), ...OUTLINE_ENDS.map((e) => e.replaceAll("{topic}", base))];
    return shuffle(lines, seed).length ? lines.join("\n") : "";
  }, [topic, points, seed]);

  return (
    <div className="space-y-6">
      <Field label="Video topic">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. how to edit photos" className={INPUT_CLS} />
      </Field>
      <Field label="Key points (one per line)">
        <Textarea value={points} onChange={(e) => setPoints(e.target.value)} rows={4} placeholder={"Shot composition\nColor grading\nExporting"} />
      </Field>
      <div className="flex gap-2">
        <Button onClick={() => setSeed((s) => s + 1)}>New outline</Button>
      </div>
      <OutputArea value={output} label="Video outline" filename="video-outline.txt" rows={10} />
    </div>
  );
}

const POST_TEMPLATES = [
  "Question for you 👇\n\n{question}\n\nDrop your answer in the comments — I read every single one!",
  "Quick poll: {question}\n\nResults may surprise you…",
  "Behind the scenes 🎬\n\n{detail}\n\nWhat do you want to see next?",
  "Unpopular opinion: {opinion}\n\nAgree or disagree? Tell me why below.",
  "This week I learned {lesson}.\n\n{question}",
];

const POST_QUESTIONS = [
  "What's your biggest {topic} struggle right now?",
  "Which {topic} tip changed the game for you?",
  "What should I test in my next {topic} video?",
];

export function CommunityPostGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "content";
    return pick(POST_TEMPLATES, seed)
      .replaceAll("{question}", pick(POST_QUESTIONS, seed + 1).replaceAll("{topic}", base))
      .replaceAll("{opinion}", `the best ${base} tools are usually the free ones`)
      .replaceAll("{detail}", "here's the setup I use to film every video")
      .replaceAll("{lesson}", `a tiny ${base} habit compounds fast`);
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Your topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. video editing" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New post</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Community post draft" filename="community-post.txt" rows={8} />
    </div>
  );
}

const THUMB_PATTERNS = [
  "You WON'T Believe This {topic} Tip",
  "The {topic} Method That WORKS",
  "{number} {topic} Hacks in 60 Seconds",
  "STOP Doing This If You Want {topic} Results",
  "This {topic} Secret Changed Everything",
  "I Tested Every {topic} Trick So You Don't Have To",
];

export function ThumbnailTextGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "growth";
    return shuffle(
      THUMB_PATTERNS.map((p) => p.replaceAll("{topic}", base).replaceAll("{number}", String(3 + (Math.abs(seed) % 5)))),
      seed
    )
      .slice(0, 4)
      .join("\n");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Video topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. photo editing" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>More text</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Thumbnail text ideas" filename="thumbnail-text.txt" rows={5} />
      <p className="text-xs text-zinc-400 dark:text-zinc-500">Keep thumbnail text under 5 words for best readability.</p>
    </div>
  );
}

const CHECKLIST = [
  "Hook in the first 15 seconds",
  "Clear title with a searchable keyword",
  "Compelling thumbnail (readable at small size)",
  "Audio levels consistent across the video",
  "Captions / subtitles added",
  "CTA to subscribe placed before the end",
  "End screen with links to 2 more videos",
  "Description with timestamps and keyword",
  "Tags / hashtags filled in",
  "Pinned comment asking a question",
];

export function VideoChecklistGenerator() {
  const [title, setTitle] = useState("");
  const [extra, setExtra] = useState("");

  const output = useMemo(() => {
    const extras = extra
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);
    return [
      title ? `Video: ${title}` : "Video checklist",
      "",
      ...CHECKLIST.map((c, i) => `${i + 1}. [ ] ${c}`),
      ...extras.map((e, i) => `${CHECKLIST.length + i + 1}. [ ] ${e}`),
    ].join("\n");
  }, [title, extra]);

  return (
    <div className="space-y-6">
      <Field label="Video title (optional)">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My Best Video Yet" className={INPUT_CLS} />
      </Field>
      <Field label="Your own checklist items (one per line)">
        <Textarea value={extra} onChange={(e) => setExtra(e.target.value)} rows={3} placeholder={"Custom item A\nCustom item B"} />
      </Field>
      <OutputArea value={output} label="Pre-publish checklist" filename="video-checklist.txt" rows={14} />
    </div>
  );
}

const KEYWORD_SEEDS = [
  "{t} for beginners",
  "how to {t}",
  "best {t} tools",
  "{t} tips and tricks",
  "{t} tutorial",
  "what is {t}",
  "{t} examples",
  "{t} guide 2026",
  "learn {t}",
  "{t} mistakes to avoid",
];

export function MetaKeywordsGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim().toLowerCase() || "seo";
    const list = shuffle(
      KEYWORD_SEEDS.map((k) => k.replaceAll("{t}", base)),
      seed
    );
    return list.join(", ");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Main topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. vegan meal prep" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>More keywords</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Meta keywords" filename="meta-keywords.txt" rows={4} />
      <p className="text-xs text-zinc-400 dark:text-zinc-500">Google ignores the meta keywords tag, but these are still useful for content planning and internal tagging.</p>
    </div>
  );
}

export function HeadingOutlineGenerator() {
  const [topic, setTopic] = useState("");
  const [subtopics, setSubtopics] = useState("");

  const output = useMemo(() => {
    const base = topic.trim() || "Topic";
    const subs = subtopics
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const mid = subs.length >= 2 ? subs.slice(0, 4) : ["What Is " + base + "?", "Why " + base + " Matters", "How to Get Started", "Common Mistakes"];
    return [
      `H1: ${base}`,
      "",
      ...mid.map((m) => `H2: ${m}`),
      "  H3: Key point",
      "  H3: Example / case study",
      "H2: Frequently Asked Questions",
      "H2: Final Takeaways",
    ].join("\n");
  }, [topic, subtopics]);

  return (
    <div className="space-y-6">
      <Field label="Main topic">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Home Workouts" className={INPUT_CLS} />
      </Field>
      <Field label="Subtopics (one per line, optional)">
        <Textarea value={subtopics} onChange={(e) => setSubtopics(e.target.value)} rows={4} placeholder={"Benefits\nEquipment\nBeginner routine"} />
      </Field>
      <OutputArea value={output} label="H1/H2/H3 outline" filename="heading-outline.txt" rows={12} />
    </div>
  );
}

export function AltTextGenerator() {
  const [imageDescription, setImageDescription] = useState("");
  const [context, setContext] = useState("");

  const output = useMemo(() => {
    const desc = imageDescription.trim();
    if (!desc) return "";
    const ctx = context.trim();
    const base = desc.replace(/[.!?]+$/, "");
    const options = [
      `A photo of ${base}${ctx ? ` in the context of ${ctx}` : ""}.`,
      `${base.charAt(0).toUpperCase() + base.slice(1)}, ${ctx ? `${ctx} — ` : ""}shown clearly for accessibility.`,
      `Illustration showing ${base}${ctx ? ` related to ${ctx}` : ""}.`,
    ];
    return options.join("\n\n");
  }, [imageDescription, context]);

  return (
    <div className="space-y-6">
      <Field label="Describe the image">
        <Textarea value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} rows={3} placeholder="a golden retriever puppy sitting in a park" />
      </Field>
      <Field label="Context / purpose (optional)">
        <input type="text" value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. a blog post about dog training" className={INPUT_CLS} />
      </Field>
      <OutputArea value={output} label="Alt text options" filename="alt-text.txt" rows={6} />
    </div>
  );
}

export function ContentBriefGenerator() {
  const [topic, setTopic] = useState("");
  const [target, setTarget] = useState("");
  const [wordTarget, setWordTarget] = useState(1200);

  const output = useMemo(() => {
    const base = topic.trim() || "your topic";
    const words = Math.max(300, Math.min(5000, wordTarget));
    return [
      `Content brief: ${base}`,
      "",
      `Target: ${target.trim() || "readers new to the topic"}`,
      `Word count: ~${words} words`,
      `Reading level: conversational, clear`,
      "",
      "SEO keywords:",
      `  - ${base} guide`,
      `  - ${base} tips`,
      `  - how to ${base.toLowerCase()}`,
      "",
      "Structure:",
      "  H1: " + base,
      "  H2: Why this matters",
      "  H2: Step-by-step / core content",
      "  H2: Common questions",
      "  H2: Conclusion + CTA",
      "",
      "Requirements:",
      "  - Answer the primary question in the first 100 words",
      "  - Include at least 2 internal links",
      "  - Add an FAQ section",
      "  - 3+ headings and one table or list",
    ].join("\n");
  }, [topic, target, wordTarget]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Topic">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Home Workouts" className={INPUT_CLS} />
        </Field>
        <Field label="Target audience">
          <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. busy beginners" className={INPUT_CLS} />
        </Field>
      </div>
      <Field label={`Target word count: ${wordTarget}`}>
        <input type="range" min={300} max={5000} step={100} value={wordTarget} onChange={(e) => setWordTarget(Number(e.target.value))} className="w-full accent-violet-600" />
      </Field>
      <OutputArea value={output} label="Content brief" filename="content-brief.txt" rows={20} />
    </div>
  );
}

export function FaqSchemaGenerator() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    const questions: { q: string; a: string }[] = [];
    let currentQ: string | null = null;
    for (const line of input.split("\n").map((l) => l.trim()).filter(Boolean)) {
      const qMatch = line.match(/^(?:Q\d*[.:)\s]*|Question[: ]*)(.+?)[?？]?\s*$/i);
      const aMatch = line.match(/^A\d*[.:)\s]+(.+)$/i);
      if (aMatch) {
        if (currentQ) {
          questions.push({ q: currentQ, a: aMatch[1].replace(/^"(.*)"$/, "$1") });
          currentQ = null;
        }
      } else if (qMatch && qMatch[1]) {
        currentQ = qMatch[1];
      }
    }
    if (questions.length === 0) {
      return { output: "", error: "Add at least one Q&A pair, e.g. 'Q: What is this? A: It's a tool.'" };
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };
    return { output: formatJSON(JSON.stringify(schema)), error: null };
  }, [input]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Q&A pairs"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder={"Q: What is a content brief?\nA: A document that outlines what to write.\nQ: Who uses them?\nA: Writers and SEO teams."}
      />
      {error && input && <p className="text-sm text-red-500">{error}</p>}
      <OutputArea value={output} label="FAQPage JSON-LD schema" filename="faq-schema.json" rows={12} />
    </div>
  );
}
