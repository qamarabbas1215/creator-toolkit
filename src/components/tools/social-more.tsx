"use client";

import { useMemo, useState } from "react";
import { Card, Field } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";

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

const TIKTOK_FORMATS = [
  "POV: you just discovered {topic}",
  "3 things I wish I knew about {topic}",
  "Day 1 of mastering {topic}",
  "The {topic} hack that blew my mind 🤯",
  "Rating popular {topic} hacks",
  "What happens when you try {topic} for a week",
  "Comment your {topic} hot take 👇",
  "Transformation: {topic} before vs after",
];

export function TikTokIdeaGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "productivity";
    return shuffle(TIKTOK_FORMATS.map((f) => f.replaceAll("{topic}", base)), seed)
      .slice(0, 5)
      .join("\n");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Topic or niche">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. meal prep" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New ideas</Button>
        </div>
      </Field>
      <OutputArea value={output} label="TikTok ideas" filename="tiktok-ideas.txt" rows={6} />
    </div>
  );
}

const STORY_TEMPLATES = [
  "Swipe up for the {topic} trick I can't stop using ✨",
  "Sneak peek: behind the scenes of {topic} 🎬",
  "Poll time: {poll}",
  "Day {n} of sharing {topic} tips — today's tip:",
  "You asked, I answered: the truth about {topic}",
  "Quick {topic} tip for your next try 👉",
];

export function InstagramStoryGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "your niche";
    const n = 1 + (Math.abs(seed) % 30);
    return shuffle(STORY_TEMPLATES.map((f) => f.replaceAll("{topic}", base).replaceAll("{n}", String(n)).replaceAll("{poll}", `which ${base} style do you prefer?`)), seed)
      .slice(0, 3)
      .join("\n\n");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. skincare" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New ideas</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Story ideas" filename="story-ideas.txt" rows={8} />
    </div>
  );
}

const PIN_PATTERNS = [
  "{topic} Ideas That Actually Work",
  "The Ultimate {topic} Checklist",
  "10 {topic} Mistakes to Avoid",
  "How to {topic} in 5 Easy Steps",
  "Free Printable: {topic} Planner",
  "What I Learned About {topic}",
  "7 {topic} Tips for Busy People",
];

export function PinterestTitleGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || "diy";
    return shuffle(PIN_PATTERNS.map((p) => p.replaceAll("{topic}", base)), seed)
      .slice(0, 5)
      .join("\n");
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Pin topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. home organization" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New titles</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Pinterest pin titles" filename="pin-titles.txt" rows={6} />
    </div>
  );
}

const POLL_TOPICS = ["content format", "tool", "feature", "schedule", "topic for next post", "aesthetic"];

export function PollIdeasGenerator() {
  const [topic, setTopic] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = topic.trim() || pick(POLL_TOPICS, seed);
    const a = shuffle(["Option A", "Option B", "Yes", "No", "This", "That", "Every day", "Once a week", "First option", "Second option"], seed).slice(0, 2);
    return `Poll: Which ${base} do you prefer?\n\n${a[0]}  vs  ${a[1]}`;
  }, [topic, seed]);

  return (
    <div className="space-y-6">
      <Field label="Poll topic">
        <div className="flex gap-2">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. video length" className={INPUT_CLS} />
          <Button onClick={() => setSeed((s) => s + 1)}>New poll</Button>
        </div>
      </Field>
      <OutputArea value={output} label="Poll draft" filename="poll.txt" rows={4} />
    </div>
  );
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn", "X (Twitter)"];

export function ContentCalendarGenerator() {
  const [theme, setTheme] = useState("");

  const output = useMemo(() => {
    const base = theme.trim() || "brand";
    const lines: string[] = [`Weekly content calendar — theme: ${base}`, ""];
    const days = shuffle(WEEKDAYS, 1);
    for (let i = 0; i < 7; i++) {
      const platform = PLATFORMS[i % PLATFORMS.length];
      const formats = ["post", "story", "video", "tip", "poll", "behind the scenes", "meme"];
      lines.push(`${days[i]} — ${platform}: ${pick(formats, i + 3)} about ${base}`);
    }
    lines.push("", "Ideas are suggestions — adapt to what your audience responds to.");
    return lines.join("\n");
  }, [theme]);

  return (
    <div className="space-y-6">
      <Field label="Content theme">
        <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. wellness journey" className={INPUT_CLS} />
      </Field>
      <OutputArea value={output} label="Weekly calendar" filename="content-calendar.txt" rows={12} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {PLATFORMS.map((p) => (
          <Card key={p} className="p-3 text-center text-xs font-medium">
            {p}
          </Card>
        ))}
      </div>
    </div>
  );
}
