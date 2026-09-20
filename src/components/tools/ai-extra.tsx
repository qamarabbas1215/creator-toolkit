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
import { cn } from "@/lib/utils";

export function PromptFormatter() {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [examples, setExamples] = useState("");
  const [tone, setTone] = useState("");

  const output = useMemo(() => {
    const sections: string[] = [];
    if (role.trim()) sections.push(`## Role\n${role.trim()}`);
    if (task.trim()) sections.push(`## Task\n${task.trim()}`);
    if (context.trim()) sections.push(`## Context\n${context.trim()}`);
    if (constraints.trim()) {
      const lines = constraints
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `- ${l}`);
      sections.push(`## Constraints\n${lines.join("\n")}`);
    }
    if (outputFormat.trim()) sections.push(`## Output Format\n${outputFormat.trim()}`);
    if (examples.trim()) sections.push(`## Examples\n${examples.trim()}`);
    if (tone.trim()) sections.push(`## Tone\n${tone.trim()}`);
    return sections.join("\n\n");
  }, [role, task, context, constraints, outputFormat, examples, tone]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Role (who the AI should act as)">
          <TextInput
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. a senior copywriter"
          />
        </Field>
        <Field label="Task (what to do)">
          <TextInput
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. write a product description"
          />
        </Field>
        <Field label="Context (background info)">
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="e.g. a sustainable sneaker brand launching in Europe…"
          />
        </Field>
        <Field label="Constraints (one per line)">
          <Textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            rows={3}
            placeholder={"no jargon\nmax 150 words\nemphasize sustainability"}
          />
        </Field>
        <Field label="Output format">
          <TextInput
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            placeholder="e.g. 3 short paragraphs with a headline"
          />
        </Field>
        <Field label="Tone">
          <TextInput
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="e.g. friendly and confident"
          />
        </Field>
      </div>
      <Field label="Examples (optional)">
        <Textarea
          value={examples}
          onChange={(e) => setExamples(e.target.value)}
          rows={3}
          placeholder="e.g. Input: …\nOutput: …"
        />
      </Field>
      <StatGrid>
        <Stat label="Sections" value={output ? output.split("\n## ").length : 0} />
        <Stat label="Est. tokens" value={Math.round(output.length / 4)} />
      </StatGrid>
      <OutputArea value={output} label="Formatted prompt" filename="formatted-prompt.txt" rows={12} />
    </div>
  );
}

const WEAK_WORDS = ["some", "things", "stuff", "maybe", "etc", "whatever", "something"];
const CONSTRAINT_WORDS = ["must", "only", "limit", "avoid", "exactly", "max", "minimum", "do not", "don't", "no more"];

interface Optimization {
  title: string;
  description: string;
}

export function PromptOptimizer() {
  const [prompt, setPrompt] = useState("");

  const result = useMemo(() => {
    const raw = prompt.trim();
    if (!raw) return { optimized: "", improvements: [] as Optimization[], tokens: 0 };

    const improvements: Optimization[] = [];
    let out = raw;
    let prefix = "";

    if (!/^(you are|you're|act as|imagine you|pretend)/i.test(raw)) {
      prefix = "You are a helpful, precise assistant. ";
      improvements.push({
        title: "Added a role",
        description: "Framing the AI as a capable assistant improves output quality.",
      });
    }

    const weak = WEAK_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(raw));
    if (weak.length > 0) {
      improvements.push({
        title: "Vague words detected",
        description: `Replace "${weak.join(", ")}" with concrete details for sharper results.`,
      });
    }

    const hasConstraint = CONSTRAINT_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(raw));
    if (!hasConstraint) {
      out = `${out}\n\nConstraints: Be specific, avoid fluff, and stay on topic.`;
      improvements.push({
        title: "Added constraints",
        description: "Explicit limits reduce hallucination and scope creep.",
      });
    }

    const hasFormat = /(?:output|format|structure|as a list|in json|table|bullet|step)\b/i.test(raw);
    if (!hasFormat) {
      out = `${out}\n\nOutput: Provide a clear, well-structured answer.`;
      improvements.push({
        title: "Specified output format",
        description: "Telling the model how to answer makes results more usable.",
      });
    }

    const hasExample = /\b(?:example|for instance|like this|e\.g\.)\b/i.test(raw);
    if (!hasExample) {
      improvements.push({
        title: "Consider adding an example",
        description: "One example can dramatically improve consistency — add one if possible.",
      });
    }

    out = `${prefix}${out}\n\nReview your work against the request before answering.`;
    improvements.push({
      title: "Added self-review step",
      description: "Prompting a quick review reduces obvious mistakes.",
    });

    return { optimized: out, improvements, tokens: Math.round(out.length / 4) };
  }, [prompt]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your prompt"
        placeholder="Paste a prompt to optimize…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
      />
      {result.improvements.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Improvements applied
          </h3>
          <ul className="mt-3 space-y-2">
            {result.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-emerald-500">✓</span>
                <span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{imp.title}.</span>{" "}
                  <span className="text-zinc-500">{imp.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <StatGrid>
        <Stat label="Est. tokens" value={result.tokens} accent="#8b5cf6" />
      </StatGrid>
      <OutputArea
        value={result.optimized}
        label="Optimized prompt"
        filename="optimized-prompt.txt"
        rows={12}
        placeholder="Optimized prompt appears here…"
      />
    </div>
  );
}

const OUTPUT_TYPES = [
  { id: "paragraphs", label: "Paragraphs" },
  { id: "list", label: "Bullet list" },
  { id: "steps", label: "Step-by-step" },
  { id: "table", label: "Table" },
  { id: "json", label: "JSON" },
  { id: "short", label: "Short answer" },
];

export function PromptGenerator() {
  const [task, setTask] = useState("");
  const [domain, setDomain] = useState("");
  const [audience, setAudience] = useState("");
  const [outputType, setOutputType] = useState("paragraphs");
  const [generated, setGenerated] = useState("");

  function generate() {
    const t = task.trim();
    if (!t) return;
    const d = domain.trim();
    const a = audience.trim();
    const fmt = OUTPUT_TYPES.find((o) => o.id === outputType)?.label.toLowerCase() ?? "a clear answer";

    const parts: string[] = [];
    parts.push(
      d
        ? `You are an expert in ${d} with deep, practical knowledge.`
        : "You are a helpful, precise assistant with broad expertise."
    );
    parts.push("");
    parts.push(`Your task: ${t}.`);
    if (a) parts.push(`The audience is: ${a}.`);
    parts.push("");
    parts.push("Constraints:");
    parts.push("- Be accurate, specific, and well-organized.");
    parts.push("- Avoid fluff, filler, and unsupported claims.");
    parts.push("- Keep it actionable and easy to follow.");
    parts.push("");
    parts.push(`Output format: respond as ${fmt}.`);
    parts.push("Review your answer against the task before finishing.");
    setGenerated(parts.join("\n"));
  }

  return (
    <div className="space-y-6">
      <Field label="What should the AI do?">
        <TextInput
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. explain how NFTs work"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Domain (optional)">
          <TextInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. digital marketing" />
        </Field>
        <Field label="Audience (optional)">
          <TextInput value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. beginner bloggers" />
        </Field>
      </div>
      <OptionRow>
        <Field label="Output type">
          <Select value={outputType} onChange={(e) => setOutputType(e.target.value)}>
            {OUTPUT_TYPES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={generate} disabled={!task.trim()} className="h-9">
          Generate prompt
        </Button>
      </OptionRow>
      <OutputArea value={generated} label="Generated prompt" filename="generated-prompt.txt" rows={12} />
    </div>
  );
}

interface PromptTemplate {
  title: string;
  category: string;
  prompt: string;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    title: "Blog post outline",
    category: "Writing",
    prompt: "You are an SEO content strategist. Create a detailed outline for a blog post about {topic} targeting {audience}. Include a working title, an intro angle, 5-7 main sections with sub-points, and a conclusion with a call to action.",
  },
  {
    title: "Email reply",
    category: "Writing",
    prompt: "You are a professional but warm communicator. Draft a reply to this email: {email}. Match the tone of the sender, address every point, and end with a clear next step.",
  },
  {
    title: "Product description",
    category: "Marketing",
    prompt: "You are a persuasive copywriter. Write a product description for {product} aimed at {audience}. Highlight the top 3 benefits, use sensory language, and close with a soft call to action. Keep it under 120 words.",
  },
  {
    title: "Social media post",
    category: "Marketing",
    prompt: "You are a social media manager. Write 3 short caption options for {platform} about {topic}. Each should have a hook, a value line, and a call to action. Vary the tone between friendly, bold, and playful.",
  },
  {
    title: "Code review",
    category: "Coding",
    prompt: "You are a senior software engineer. Review this code snippet for bugs, performance issues, and readability: {code}. List issues by severity and suggest concrete fixes with code.",
  },
  {
    title: "Bug fixer",
    category: "Coding",
    prompt: "You are an expert debugger. Here is the code and the error: {error}. Explain the root cause simply, then provide a corrected version with a short note on why it was wrong.",
  },
  {
    title: "Summarize article",
    category: "Research",
    prompt: "You are a research assistant. Summarize the following article in 3 sentences: {article}. Then list the 3 strongest arguments and 1 potential weakness.",
  },
  {
    title: "Study plan",
    category: "Research",
    prompt: "You are a learning coach. Create a 4-week study plan to learn {topic} for a complete beginner. Break it into weekly goals, daily tasks, and checkpoints.",
  },
  {
    title: "Meeting agenda",
    category: "Business",
    prompt: "You are an operations consultant. Build a 30-minute meeting agenda for {meeting purpose}. Include objectives, time-boxed topics, owners, and a clear decision list.",
  },
  {
    title: "Cold pitch",
    category: "Business",
    prompt: "You are a growth marketer. Write a short cold outreach message to {prospect} about {offer}. Start with a personalized opener, state the value, and ask one clear question. Under 120 words.",
  },
  {
    title: "Video script hook",
    category: "Creative",
    prompt: "You are a YouTube scriptwriter. Write 5 opening hooks for a video about {topic}. Each hook should be under 15 words and designed to stop the scroll.",
  },
  {
    title: "Story starter",
    category: "Creative",
    prompt: "You are a fiction writer. Write 3 first lines for a story about {topic} in different genres: mystery, romance, and sci-fi. Each line should create immediate intrigue.",
  },
];

export function PromptLibrary() {
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(PROMPT_TEMPLATES.map((t) => t.category))];
  const filtered =
    category === "All"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              category === c
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => (
          <Card key={t.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  {t.category}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {t.title}
                </h3>
              </div>
              <CopyButton text={t.prompt} className="shrink-0" />
            </div>
            <p className="mt-3 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
              {t.prompt}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function scorePrompt(prompt: string): {
  score: number;
  checks: { label: string; pass: boolean; tip: string }[];
} {
  const checks: { label: string; pass: boolean; tip: string }[] = [];

  const imperative = /\b(write|create|generate|explain|list|describe|summarize|analyze|draft|convert|fix|review)\b/i.test(prompt);
  checks.push({
    label: "Clear instruction",
    pass: imperative,
    tip: imperative ? "" : "Start with a strong action verb (write, create, explain…).",
  });

  const specific = /\d|specific|exactly|precisely|\b(new|old|best|top)\b/i.test(prompt);
  checks.push({
    label: "Specific & detailed",
    pass: specific,
    tip: specific ? "" : "Add numbers, names, or concrete details to remove ambiguity.",
  });

  const constrained = CONSTRAINT_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(prompt));
  checks.push({
    label: "Constraints given",
    pass: constrained,
    tip: constrained ? "" : "Add limits like length, tone, or things to avoid.",
  });

  const examples = /\b(example|for instance|e\.g\.|like this|sample)\b/i.test(prompt);
  checks.push({
    label: "Examples included",
    pass: examples,
    tip: examples ? "" : "Including one example improves output consistency.",
  });

  const format = /(?:output|format|as a |in json|list|table|bullet|paragraph|steps?)\b/i.test(prompt);
  checks.push({
    label: "Output format defined",
    pass: format,
    tip: format ? "" : "Tell the AI how to format the answer.",
  });

  const len = prompt.trim().length;
  let lenPass = len >= 30;
  if (len === 0) lenPass = false;
  checks.push({
    label: "Good length",
    pass: lenPass,
    tip:
      len === 0
        ? "Enter a prompt to test it."
        : len < 30
          ? "Prompt is very short — add context."
          : len > 1500
            ? "Very long — consider splitting into steps."
            : "",
  });

  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { score, checks };
}

export function AiPromptTester() {
  const [prompt, setPrompt] = useState("");
  const result = useMemo(() => scorePrompt(prompt), [prompt]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Prompt to evaluate"
        placeholder="Paste a prompt to score it…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
      />
      <StatGrid>
        <Stat
          label="Prompt score"
          value={`${result.score}/100`}
          accent={
            result.score >= 80
              ? "#10b981"
              : result.score >= 50
                ? "#f59e0b"
                : "#ef4444"
          }
        />
        <Stat label="Characters" value={prompt.length} />
        <Stat label="Est. tokens" value={Math.round(prompt.length / 4)} />
        <Stat label="Words" value={prompt.trim() ? prompt.trim().split(/\s+/).length : 0} />
      </StatGrid>

      {prompt.trim() && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Checklist
          </h3>
          <div className="mt-3 space-y-2">
            {result.checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2 text-sm">
                <span
                  className={cn(
                    "mt-0.5 font-bold",
                    c.pass ? "text-emerald-500" : "text-amber-500"
                  )}
                >
                  {c.pass ? "✓" : "!"}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "font-medium",
                      c.pass ? "text-zinc-800 dark:text-zinc-200" : "text-amber-700 dark:text-amber-300"
                    )}
                  >
                    {c.label}
                  </span>
                  {!c.pass && c.tip && (
                    <span className="block text-xs text-zinc-500">{c.tip}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

const IMG_MEDIA = [
  "photograph",
  "digital painting",
  "3D render",
  "anime illustration",
  "vector illustration",
  "pixel art",
  "oil painting",
  "watercolor painting",
];

const IMG_STYLES = [
  "photorealistic",
  "cinematic",
  "minimalist",
  "surreal",
  "isometric",
  "cyberpunk",
  "fantasy",
  "vintage",
  "low poly",
  "flat design",
];

const IMG_LIGHTING = [
  "golden hour lighting",
  "soft studio lighting",
  "dramatic chiaroscuro",
  "neon lighting",
  "candlelight",
  "overcast diffused light",
  "moonlight",
  "backlit silhouette",
];

const IMG_COLORS = [
  "vibrant saturated colors",
  "soft pastel palette",
  "monochrome black and white",
  "muted earth tones",
  "neon color palette",
  "high contrast",
  "sepia tones",
  "teal and orange grade",
];

const IMG_CAMERAS = [
  "shot on full-frame DSLR, 85mm f/1.8",
  "shot on medium format, 50mm lens",
  "wide angle 24mm",
  "telephoto 200mm",
  "aerial drone shot",
  "macro lens, extreme close-up",
  "long exposure",
];

const IMG_MOODS = [
  "calm and serene",
  "epic and grand",
  "mysterious",
  "joyful",
  "melancholic",
  "tense",
  "dreamy",
  "cozy",
];

const IMG_QUALITY = [
  "8K, highly detailed, masterpiece",
  "4K, crisp details, best quality",
  "highly detailed, sharp focus",
];

const IMG_ASPECTS = ["16:9", "9:16", "1:1", "3:2", "2:3", "4:3", "21:9"];

const IMG_NEGATIVES = [
  "blurry",
  "low quality",
  "watermark",
  "text",
  "signature",
  "deformed hands",
  "extra fingers",
  "bad anatomy",
  "jpeg artifacts",
];

export function AiImagePromptBuilder() {
  const [subject, setSubject] = useState("");
  const [media, setMedia] = useState(IMG_MEDIA[0]);
  const [style, setStyle] = useState(IMG_STYLES[0]);
  const [artist, setArtist] = useState("");
  const [lighting, setLighting] = useState(IMG_LIGHTING[0]);
  const [color, setColor] = useState(IMG_COLORS[0]);
  const [camera, setCamera] = useState(IMG_CAMERAS[0]);
  const [mood, setMood] = useState(IMG_MOODS[0]);
  const [quality, setQuality] = useState(IMG_QUALITY[0]);
  const [aspect, setAspect] = useState("16:9");

  const prompt = useMemo(() => {
    const parts = [
      subject.trim() || "your subject",
      media,
      style,
      artist.trim() ? `in the style of ${artist.trim()}` : "",
      lighting,
      color,
      camera,
      `${mood} mood`,
      quality,
    ].filter(Boolean);
    return parts.join(", ") + ` --ar ${aspect}`;
  }, [subject, media, style, artist, lighting, color, camera, mood, quality, aspect]);

  const negative = useMemo(() => IMG_NEGATIVES.join(", "), []);

  return (
    <div className="space-y-6">
      <Field label="Subject">
        <TextInput
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. a fox drinking tea in a Victorian library"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Medium">
          <Select value={media} onChange={(e) => setMedia(e.target.value)}>
            {IMG_MEDIA.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Style">
          <Select value={style} onChange={(e) => setStyle(e.target.value)}>
            {IMG_STYLES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Lighting">
          <Select value={lighting} onChange={(e) => setLighting(e.target.value)}>
            {IMG_LIGHTING.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Color palette">
          <Select value={color} onChange={(e) => setColor(e.target.value)}>
            {IMG_COLORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Camera / lens">
          <Select value={camera} onChange={(e) => setCamera(e.target.value)}>
            {IMG_CAMERAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Mood">
          <Select value={mood} onChange={(e) => setMood(e.target.value)}>
            {IMG_MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Quality">
          <Select value={quality} onChange={(e) => setQuality(e.target.value)}>
            {IMG_QUALITY.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Aspect ratio">
          <Select value={aspect} onChange={(e) => setAspect(e.target.value)}>
            {IMG_ASPECTS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="Artist (optional)">
          <TextInput
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Wes Anderson"
          />
        </Field>
      </div>

      <OutputArea value={prompt} label="Image prompt" filename="image-prompt.txt" rows={6} />
      <OutputArea value={negative} label="Negative prompt" filename="negative.txt" rows={4} />
    </div>
  );
}

const SPEAKER_PREFIX = /^\s*(?:user|assistant|human|ai|me|you|bot|chatgpt|system|model)\s*[:：]\s*/i;
const TIMESTAMP_LINE = /^\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*(?:am|pm))?\s*$/i;
const TIMESTAMP_PREFIX = /^\s*(\[\d{1,2}:\d{2}(?::\d{2})?\]|\d{1,2}:\d{2}(?::\d{2})?)\s*/;

export function AiChatExportCleaner() {
  const [text, setText] = useState("");
  const [removeSpeakers, setRemoveSpeakers] = useState(true);
  const [removeTimestamps, setRemoveTimestamps] = useState(true);
  const [collapseBlank, setCollapseBlank] = useState(true);

  const output = useMemo(() => {
    let lines = text.split("\n");

    if (removeSpeakers) {
      lines = lines.map((l) => l.replace(SPEAKER_PREFIX, ""));
    }

    if (removeTimestamps) {
      lines = lines
        .map((l) => (TIMESTAMP_LINE.test(l) ? "" : l.replace(TIMESTAMP_PREFIX, "")))
        .map((l) => l.replace(TIMESTAMP_PREFIX, ""));
    }

    lines = lines.map((l) => l.trim());

    if (collapseBlank) {
      const collapsed: string[] = [];
      for (const l of lines) {
        if (l === "" && collapsed[collapsed.length - 1] === "") continue;
        collapsed.push(l);
      }
      lines = collapsed;
    }

    return lines.join("\n").trim();
  }, [text, removeSpeakers, removeTimestamps, collapseBlank]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Chat export"
        placeholder="Paste a ChatGPT / Claude / Gemini export…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <Card className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={removeSpeakers}
            onChange={(e) => setRemoveSpeakers(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600"
          />
          Remove speaker prefixes (User:, ChatGPT:, etc.)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={removeTimestamps}
            onChange={(e) => setRemoveTimestamps(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600"
          />
          Remove timestamps
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={collapseBlank}
            onChange={(e) => setCollapseBlank(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600"
          />
          Collapse blank lines
        </label>
      </Card>
      <OutputArea value={output} label="Cleaned conversation" filename="cleaned-chat.txt" rows={10} />
    </div>
  );
}

interface Lang {
  id: string;
  name: string;
  flag: string;
}

const LANGS: Lang[] = [
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "pt", name: "Portuguese", flag: "🇵🇹" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
  { id: "zh", name: "Chinese", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
];

const DICT: [string, string[]][] = [
  ["the", ["el", "le", "das", "o", "यह", "的", "その"]],
  ["a", ["un", "un", "ein", "um", "एक", "一个", "一つ"]],
  ["an", ["un", "un", "ein", "um", "एक", "一个", "一つ"]],
  ["and", ["y", "et", "und", "e", "और", "和", "と"]],
  ["or", ["o", "ou", "oder", "ou", "या", "或", "または"]],
  ["but", ["pero", "mais", "aber", "mas", "लेकिन", "但是", "しかし"]],
  ["you", ["tú", "tu", "du", "você", "आप", "你", "あなた"]],
  ["your", ["tu", "ton", "dein", "seu", "आपका", "你的", "あなたの"]],
  ["are", ["son", "êtes", "sind", "são", "हैं", "是", "です"]],
  ["is", ["es", "est", "ist", "é", "है", "是", "です"]],
  ["with", ["con", "avec", "mit", "com", "के साथ", "与", "と"]],
  ["about", ["sobre", "à propos", "über", "sobre", "के बारे में", "关于", "について"]],
  ["this", ["este", "ce", "dies", "este", "यह", "这个", "これ"]],
  ["that", ["ese", "cela", "das", "isso", "वह", "那个", "それ"]],
  ["as", ["como", "comme", "als", "como", "के रूप में", "作为", "として"]],
  ["in", ["en", "dans", "in", "em", "में", "在", "で"]],
  ["on", ["en", "sur", "auf", "em", "पर", "在", "に"]],
  ["at", ["en", "à", "an", "em", "पर", "在", "で"]],
  ["please", ["por favor", "s'il vous plaît", "bitte", "por favor", "कृपया", "请", "お願いします"]],
  ["write", ["escribe", "écris", "schreibe", "escreva", "लिखें", "写", "書いて"]],
  ["create", ["crea", "crée", "erstelle", "crie", "बनाएं", "创建", "作成して"]],
  ["generate", ["genera", "génère", "generiere", "gere", "उत्पन्न करें", "生成", "生成して"]],
  ["explain", ["explica", "explique", "erkläre", "explique", "समझाएं", "解释", "説明して"]],
  ["describe", ["describe", "décris", "beschreibe", "descreva", "वर्णन करें", "描述", "説明して"]],
  ["list", ["lista", "liste", "liste", "liste", "सूची", "列出", "リスト"]],
  ["provide", ["proporciona", "fournis", "gib", "forneça", "प्रदान करें", "提供", "提供して"]],
  ["give", ["da", "donne", "gib", "dê", "दें", "给", "与えて"]],
  ["help", ["ayuda", "aide", "hilf", "ajude", "मदद", "帮助", "助けて"]],
  ["make", ["haz", "fais", "mache", "faça", "बनाएं", "做", "作って"]],
  ["use", ["usa", "utilise", "verwende", "use", "उपयोग करें", "使用", "使って"]],
  ["using", ["usando", "en utilisant", "mit", "usando", "उपयोग करके", "使用", "使って"]],
  ["step", ["paso", "étape", "Schritt", "passo", "कदम", "步骤", "ステップ"]],
  ["by", ["por", "par", "von", "por", "द्वारा", "由", "によって"]],
  ["for", ["para", "pour", "für", "para", "के लिए", "为了", "のために"]],
  ["following", ["siguiente", "suivant", "folgend", "seguinte", "निम्न", "以下", "以下の"]],
  ["task", ["tarea", "tâche", "Aufgabe", "tarefa", "कार्य", "任务", "タスク"]],
  ["prompt", ["indicación", "consigne", "Prompt", "instrução", "प्रॉम्प्ट", "提示词", "プロンプト"]],
  ["answer", ["respuesta", "réponse", "Antwort", "resposta", "उत्तर", "回答", "答え"]],
  ["question", ["pregunta", "question", "Frage", "pergunta", "प्रश्न", "问题", "質問"]],
  ["topic", ["tema", "sujet", "Thema", "tópico", "विषय", "主题", "トピック"]],
  ["output", ["salida", "sortie", "Ausgabe", "saída", "आउटपुट", "输出", "出力"]],
  ["response", ["respuesta", "réponse", "Antwort", "resposta", "प्रतिक्रिया", "响应", "応答"]],
  ["text", ["texto", "texte", "Text", "texto", "पाठ", "文本", "テキスト"]],
  ["content", ["contenido", "contenu", "Inhalt", "conteúdo", "सामग्री", "内容", "コンテンツ"]],
  ["example", ["ejemplo", "exemple", "Beispiel", "exemplo", "उदाहरण", "例子", "例"]],
  ["important", ["importante", "important", "wichtig", "importante", "महत्वपूर्ण", "重要", "重要"]],
  ["ensure", ["asegúrate", "assure", "stelle sicher", "garanta", "सुनिश्चित करें", "确保", "確実に"]],
  ["avoid", ["evita", "évite", "vermeide", "evite", "बचें", "避免", "避けて"]],
  ["keep", ["mantén", "garde", "halte", "mantenha", "रखें", "保持", "保って"]],
  ["simple", ["simple", "simple", "einfach", "simples", "सरल", "简单", "シンプル"]],
  ["clear", ["claro", "clair", "klar", "claro", "स्पष्ट", "清晰", "明確"]],
  ["concise", ["conciso", "concis", "präzise", "conciso", "संक्षिप्त", "简洁", "簡潔"]],
  ["detailed", ["detallado", "détaillé", "detailliert", "detalhado", "विस्तृत", "详细", "詳細"]],
  ["professional", ["profesional", "professionnel", "professionell", "profissional", "पेशेवर", "专业", "プロフェッショナル"]],
  ["friendly", ["amigable", "amical", "freundlich", "amigável", "मैत्रीपूर्ण", "友好", "フレンドリー"]],
  ["tone", ["tono", "ton", "Ton", "tom", "लहजा", "语气", "トーン"]],
  ["format", ["formato", "format", "Format", "formato", "प्रारूप", "格式", "形式"]],
  ["like", ["como", "comme", "wie", "como", "जैसे", "像", "のように"]],
  ["should", ["deberías", "devrais", "solltest", "deveria", "चाहिए", "应该", "すべき"]],
  ["need", ["necesito", "besoin", "brauche", "preciso", "ज़रूरत", "需要", "必要"]],
  ["want", ["quiero", "veux", "möchte", "quero", "चाहते हैं", "想要", "欲しい"]],
  ["summary", ["resumen", "résumé", "Zusammenfassung", "resumo", "सारांश", "摘要", "要約"]],
  ["summarize", ["resume", "résume", "fasse zusammen", "resuma", "सारांशित करें", "总结", "要約して"]],
  ["draft", ["borrador", "brouillon", "Entwurf", "rascunho", "मसौदा", "草稿", "下書き"]],
  ["edit", ["edita", "modifie", "bearbeite", "edite", "संपादित करें", "编辑", "編集して"]],
  ["rewrite", ["reescribe", "réécris", "umschreiben", "reescreva", "फिर से लिखें", "重写", "書き直して"]],
  ["translate", ["traduce", "traduis", "übersetze", "traduza", "अनुवाद करें", "翻译", "翻訳して"]],
  ["improve", ["mejora", "améliore", "verbessere", "melhore", "सुधारें", "改善", "改善して"]],
  ["keywords", ["palabras clave", "mots-clés", "Schlüsselwörter", "palavras-chave", "कीवर्ड", "关键词", "キーワード"]],
  ["ideas", ["ideas", "idées", "Ideen", "ideias", "विचार", "想法", "アイデア"]],
  ["title", ["título", "titre", "Titel", "título", "शीर्षक", "标题", "タイトル"]],
  ["email", ["correo", "e-mail", "E-Mail", "e-mail", "ईमेल", "电子邮件", "メール"]],
  ["blog", ["blog", "blog", "Blog", "blog", "ब्लॉग", "博客", "ブログ"]],
  ["post", ["publicación", "publication", "Beitrag", "postagem", "पोस्ट", "帖子", "投稿"]],
  ["article", ["artículo", "article", "Artikel", "artigo", "लेख", "文章", "記事"]],
  ["script", ["guion", "script", "Drehbuch", "roteiro", "स्क्रिप्ट", "脚本", "脚本"]],
  ["video", ["video", "vidéo", "Video", "vídeo", "वीडियो", "视频", "動画"]],
  ["code", ["código", "code", "Code", "código", "कोड", "代码", "コード"]],
  ["function", ["función", "fonction", "Funktion", "função", "फ़ंक्शन", "函数", "関数"]],
  ["fix", ["arregla", "corrige", "repariere", "corrija", "ठीक करें", "修复", "修正して"]],
  ["error", ["error", "erreur", "Fehler", "erro", "त्रुटि", "错误", "エラー"]],
  ["data", ["datos", "données", "Daten", "dados", "डेटा", "数据", "データ"]],
  ["image", ["imagen", "image", "Bild", "imagem", "छवि", "图像", "画像"]],
  ["style", ["estilo", "style", "Stil", "estilo", "शैली", "风格", "スタイル"]],
  ["subject", ["sujeto", "sujet", "Thema", "assunto", "विषय", "主题", "主題"]],
  ["background", ["fondo", "arrière-plan", "Hintergrund", "fundo", "पृष्ठभूमि", "背景", "背景"]],
  ["lighting", ["iluminación", "éclairage", "Beleuchtung", "iluminação", "प्रकाश", "光照", "照明"]],
  ["good", ["bueno", "bon", "gut", "bom", "अच्छा", "好", "良い"]],
  ["great", ["genial", "super", "großartig", "ótimo", "महान", "很棒", "素晴らしい"]],
  ["best", ["mejor", "meilleur", "beste", "melhor", "सर्वश्रेष्ठ", "最好", "最高の"]],
  ["new", ["nuevo", "nouveau", "neu", "novo", "नया", "新", "新しい"]],
  ["every", ["cada", "chaque", "jeder", "cada", "हर", "每个", "毎"]],
  ["today", ["hoy", "aujourd'hui", "heute", "hoje", "आज", "今天", "今日"]],
];

export function AiPromptTranslator() {
  const [prompt, setPrompt] = useState("");
  const [langId, setLangId] = useState("es");

  const langIndex = LANGS.findIndex((l) => l.id === langId);

  const translated = useMemo(() => {
    if (!prompt.trim()) return "";
    const words = prompt.match(/\b[a-zA-Z][a-zA-Z-']*[a-zA-Z]\b|[.,!?;:]/g) ?? [];
    return words
      .map((w) => {
        if (/^[.,!?;:]$/.test(w)) return w;
        const entry = DICT.find(([en]) => en === w.toLowerCase());
        if (!entry) return w;
        const t = entry[1][langIndex] ?? w;
        return w[0] === w[0].toUpperCase()
          ? t.charAt(0).toUpperCase() + t.slice(1)
          : t;
      })
      .join(" ");
  }, [prompt, langIndex]);

  return (
    <div className="space-y-6">
      <Textarea
        label="English prompt"
        placeholder="Paste an English prompt to translate common vocabulary…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
      />
      <OptionRow>
        <Field label="Target language" className="min-w-48">
          <Select value={langId} onChange={(e) => setLangId(e.target.value)}>
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.flag} {l.name}
              </option>
            ))}
          </Select>
        </Field>
      </OptionRow>
      <Card>
        <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          This translates common prompt vocabulary word-by-word from a built-in
          dictionary. Words without a dictionary match are kept in English — perfect
          for building bilingual prompts.
        </p>
      </Card>
      <OutputArea
        value={translated}
        label={`Prompt with translated vocabulary (${LANGS[langIndex].name})`}
        filename={`prompt-${langId}.txt`}
        rows={8}
      />
    </div>
  );
}

const PROMPT_FILLERS = [
  "actually",
  "basically",
  "really",
  "very",
  "quite",
  "just",
  "simply",
  "literally",
  "totally",
  "honestly",
  "obviously",
  "clearly",
  "extremely",
];

const PROMPT_PHRASES: [RegExp, string][] = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bin the event that\b/gi, "if"],
  [/\bit is important to note that\b/gi, "note that"],
  [/\bwith regard to\b/gi, "about"],
  [/\bwhen it comes to\b/gi, "for"],
  [/\bthere is no doubt that\b/gi, "undoubtedly"],
  [/\ba majority of\b/gi, "most"],
];

export function AiPromptShortener() {
  const [prompt, setPrompt] = useState("");

  const result = useMemo(() => {
    let out = prompt;
    for (const [re, sub] of PROMPT_PHRASES) out = out.replace(re, sub);
    for (const w of PROMPT_FILLERS) {
      out = out.replace(new RegExp(`\\s\\b${w}\\b\\s?`, "gi"), " ");
    }
    out = out.replace(/\s{2,}/g, " ").trim();
    const before = prompt.length;
    const after = out.length;
    return {
      out,
      saved: Math.max(0, before - after),
      tokensBefore: Math.round(before / 4),
      tokensAfter: Math.round(after / 4),
    };
  }, [prompt]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your prompt"
        placeholder="Paste a wordy prompt to tighten it…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
      />
      <StatGrid>
        <Stat label="Chars before" value={prompt.length} />
        <Stat label="Chars after" value={result.out.length} accent="#8b5cf6" />
        <Stat label="Saved" value={result.saved} accent="#10b981" />
        <Stat
          label="Tokens"
          value={`${result.tokensBefore} → ${result.tokensAfter}`}
        />
      </StatGrid>
      <OutputArea value={result.out} label="Shortened prompt" filename="shortened-prompt.txt" rows={8} />
    </div>
  );
}
