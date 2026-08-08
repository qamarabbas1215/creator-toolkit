"use client";

import { useMemo, useState } from "react";
import { Card, Field, Select, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { splitSentences } from "@/lib/text";

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

const INTERVIEW_TYPES = {
  behavioral: [
    "Tell me about a time you had to handle a difficult teammate.",
    "Describe a project that failed. What did you learn?",
    "How do you prioritize when everything is urgent?",
    "Give an example of a time you took initiative beyond your role.",
    "How do you handle feedback you disagree with?",
  ],
  technical: [
    "Explain a technical concept to a non-technical person.",
    "How would you design a URL shortener?",
    "What's the difference between a process and a thread?",
    "How do you debug a slow production page?",
    "Describe a time you fixed a critical bug under pressure.",
  ],
  creative: [
    "Tell me about a campaign or piece of work you're proud of.",
    "How do you generate ideas when you feel stuck?",
    "Describe a brief that was vague — how did you approach it?",
    "What's your process for turning feedback into revisions?",
    "Share a time you chose a creative risk over a safe option.",
  ],
  leadership: [
    "How do you motivate a team through a hard quarter?",
    "Tell me about a time you had to make an unpopular decision.",
    "How do you give difficult feedback?",
    "Describe how you've helped someone grow on your team.",
    "How do you handle competing priorities from stakeholders?",
  ],
};

export function InterviewQuestionGenerator() {
  const [role, setRole] = useState("");
  const [type, setType] = useState<keyof typeof INTERVIEW_TYPES>("behavioral");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = role.trim() || "the role";
    const questions = shuffle(INTERVIEW_TYPES[type], seed).slice(0, 5);
    return [
      `Interview questions for ${base} — ${type} focus`,
      "",
      ...questions.map((q, i) => `${i + 1}. ${q}`),
    ].join("\n");
  }, [role, type, seed]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Role">
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className={INPUT_CLS} />
        </Field>
        <Field label="Question type">
          <Select value={type} onChange={(e) => setType(e.target.value as keyof typeof INTERVIEW_TYPES)}>
            {Object.keys(INTERVIEW_TYPES).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button onClick={() => setSeed((s) => s + 1)}>New questions</Button>
      <OutputArea value={output} label="Interview questions" filename="interview-questions.txt" rows={8} />
    </div>
  );
}

const MJ_STYLES = [
  "cinematic, photorealistic",
  "studio photography, softbox lighting",
  "digital art, vibrant colors",
  "anime style, clean linework",
  "3D render, octane render, subsurface scattering",
  "oil painting, textured brushstrokes",
  "isometric, stylized, pastel palette",
];

const MJ_RATIOS = ["1:1", "16:9", "9:16", "4:5", "3:2"];

export function MidjourneyPromptGenerator() {
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState(0);
  const [ratio, setRatio] = useState("16:9");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = subject.trim() || "a mysterious forest";
    const styleDesc = MJ_STYLES[style];
    const params = `--ar ${ratio} --v 6.1 --stylize ${150 + (Math.abs(seed) % 150)}`;
    return `${base}, ${styleDesc}, highly detailed, award-winning composition ${params}`;
  }, [subject, style, ratio, seed]);

  return (
    <div className="space-y-6">
      <Field label="Subject">
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. a knight on a floating island" className={INPUT_CLS} />
      </Field>
      <Field label="Style">
        <Select value={style} onChange={(e) => setStyle(Number(e.target.value))}>
          {MJ_STYLES.map((s, i) => (
            <option key={s} value={i}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Aspect ratio">
        <Select value={ratio} onChange={(e) => setRatio(e.target.value)}>
          {MJ_RATIOS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>
      <Button onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
      <OutputArea value={output} label="Midjourney prompt" filename="midjourney-prompt.txt" rows={4} />
    </div>
  );
}

export function PromptComparator() {
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");

  const metrics = useMemo(() => {
    const count = (p: string) => {
      const words = p.trim().split(/\s+/).filter(Boolean);
      const unique = new Set(words.map((w) => w.toLowerCase()));
      return { words: words.length, unique: unique.size, chars: p.length };
    };
    const a = count(promptA);
    const b = count(promptB);
    const specificityWords = ["", "concrete", "specific", "detailed", "golden", "soft", "moody", "cinematic", "vivid", "close-up", "wide-angle", "shallow depth"];
    const specificity = (p: string) => specificityWords.filter((w) => w && p.toLowerCase().includes(w)).length;
    return {
      a,
      b,
      aSpec: specificity(promptA),
      bSpec: specificity(promptB),
    };
  }, [promptA, promptB]);

  const verdict = useMemo(() => {
    if (!promptA.trim() && !promptB.trim()) return null;
    const score = (m: typeof metrics.a, spec: number) => m.words * 1 + spec * 2 + (m.unique / Math.max(1, m.words)) * 3;
    const sa = score(metrics.a, metrics.aSpec);
    const sb = score(metrics.b, metrics.bSpec);
    if (Math.abs(sa - sb) < 0.001) return "Prompts look equally detailed.";
    return sa > sb ? "Prompt A is more detailed and specific." : "Prompt B is more detailed and specific.";
  }, [metrics, promptA, promptB]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Textarea label="Prompt A" value={promptA} onChange={(e) => setPromptA(e.target.value)} rows={6} placeholder="Describe subject, style, lighting, composition…" />
        <Textarea label="Prompt B" value={promptB} onChange={(e) => setPromptB(e.target.value)} rows={6} placeholder="Describe subject, style, lighting, composition…" />
      </div>
      {verdict && (
        <Card>
          <p className="text-sm font-semibold">{verdict}</p>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">Prompt A</p>
              <p>Words: {metrics.a.words}</p>
              <p>Unique: {metrics.a.unique}</p>
              <p>Specificity cues: {metrics.aSpec}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-400">Prompt B</p>
              <p>Words: {metrics.b.words}</p>
              <p>Unique: {metrics.b.unique}</p>
              <p>Specificity cues: {metrics.bSpec}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

const IMPROVE_RULES = [
  "Break long sentences into shorter ones.",
  "Replace vague words like 'good', 'bad', 'very' with concrete language.",
  "Add an active voice instead of passive constructions.",
  "End with a clear call to action.",
  "Keep the tone professional but conversational.",
  "Remove filler phrases like 'I think', 'sort of', 'basically'.",
];

export function AiResponseImprover() {
  const [text, setText] = useState("");

  const output = useMemo(() => {
    if (!text.trim()) return "";
    const lower = text.toLowerCase();
    const vague = [" very ", " really ", " good ", " bad ", " nice "].filter((w) => lower.includes(w));
    const passive = /\b(is|are|was|were) (being )?\w+ed\b/i.test(text);
    const longSentences = splitSentences(text).filter((s) => s.split(/\s+/).length > 30).length;
    const suggestions = IMPROVE_RULES.slice(0, 4);
    const flags = [
      passive ? "Uses passive voice in places." : null,
      longSentences > 0 ? `Found ${longSentences} very long sentence(s).` : null,
      vague.length > 0 ? `Contains vague wording (${vague.map((v) => v.trim()).join(", ")}).` : null,
    ].filter(Boolean);
    return [
      `Original (${text.split(/\s+/).filter(Boolean).length} words)`,
      "",
      text.trim(),
      "",
      "--- Suggested improvements ---",
      ...suggestions.map((s, i) => `${i + 1}. ${s}`),
      ...flags.map((f) => `• ${f}`),
    ].join("\n");
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea label="Your response" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste an AI or human-written response to improve…" />
      <OutputArea value={output} label="Improved response" filename="improved-response.txt" rows={12} />
    </div>
  );
}

const QUESTION_TEMPLATES = [
  "What is {topic} and why does it matter?",
  "How does {topic} compare to {alt}?",
  "What are the most common mistakes with {topic}?",
  "What should beginners know before trying {topic}?",
  "How long does it take to see results with {topic}?",
  "What tools or resources are best for {topic}?",
  "Can {topic} work for someone on a tight budget?",
  "Where can I learn more about {topic}?",
];

export function QuestionGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "this subject";
    return shuffle(QUESTION_TEMPLATES.map((q) => q.replaceAll("{topic}", base).replaceAll("{alt}", pick(["alternatives", "paid options", "the usual approach"], seed))), seed)
      .slice(0, 6)
      .join("\n");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. podcasting" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New questions</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Question ideas" filename="questions.txt" rows={7} />
    </div>
  );
}
