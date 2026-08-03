"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  OptionRow,
  Select,
  TextInput,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

const CAPTION_TONES = {
  casual: {
    label: "Casual",
    openers: ["So I was thinking…", "Real talk:", "Quick one for you:"],
    closers: ["Anyway, that's it. Go be great. ✨", "Thoughts? Drop a comment 👇"],
  },
  inspiring: {
    label: "Inspiring",
    openers: ["Your story is your superpower.", "Every expert was once a beginner.", "Small steps. Big results."],
    closers: ["Keep showing up. It matters.", "You've got this. 💪"],
  },
  educational: {
    label: "Educational",
    openers: ["Here's how it actually works:", "3 things I wish I knew sooner:", "The short version:"],
    closers: ["Save this for later. 📌", "Follow for more breakdowns."],
  },
  professional: {
    label: "Professional",
    openers: ["I've been thinking about this for a while:", "Quick insight worth sharing:", "Key takeaway from a project I just finished:"],
    closers: ["Happy to discuss further in the comments.", "What's your experience been? Let's talk."],
  },
  fun: {
    label: "Fun & playful",
    openers: ["Plot twist:", "POV: you finally got it right", "Warning: contains 100% real content"],
    closers: ["Tag someone who needs to see this 😄", "10/10 would recommend."],
  },
};

const VIRAL_TAGS = [
  "viral",
  "trending",
  "explore",
  "reels",
  "fyp",
  "foryou",
  "contentcreator",
  "creator",
  "instagood",
];

function cleanTag(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<keyof typeof CAPTION_TONES>("casual");
  const [cta, setCta] = useState("");
  const [captions, setCaptions] = useState<string[]>([]);

  function generate() {
    const t = topic.trim();
    if (!t) return;
    const toneData = CAPTION_TONES[tone];
    const tags = [
      ...new Set([
        `#${cleanTag(t)}`,
        "#creatorlife",
        ...VIRAL_TAGS,
      ]),
    ]
      .slice(0, 8)
      .join(" ");

    const ctaLine = cta.trim() ? `${cta.trim()} 👇` : "Comment your thoughts 👇";

    setCaptions(
      [0, 1, 2, 3].map((i) => {
        const opener = toneData.openers[i % toneData.openers.length];
        const closer = toneData.closers[i % toneData.closers.length];
        return [
          `${opener}`,
          ``,
          `Today I want to talk about ${t} — the part nobody mentions.`,
          `I've spent a lot of time on this so you don't have to.`,
          ``,
          `${closer}`,
          `${ctaLine}`,
          ``,
          tags,
        ].join("\n");
      })
    );
  }

  const allText = captions.join("\n\n———\n\n");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Topic / niche" className="min-w-48 flex-1">
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. morning routines"
          />
        </Field>
        <Field label="Tone">
          <Select value={tone} onChange={(e) => setTone(e.target.value as keyof typeof CAPTION_TONES)}>
            {Object.entries(CAPTION_TONES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="CTA (optional)" className="min-w-40">
          <TextInput
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g. Save this post"
          />
        </Field>
        <Button onClick={generate} disabled={!topic.trim()} className="h-9">
          Generate
        </Button>
      </OptionRow>

      {captions.length > 0 && (
        <>
          <CopyButton text={allText} label="Copy all captions" />
          <div className="space-y-3">
            {captions.map((c, i) => (
              <Card key={i}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Caption {i + 1}
                  </span>
                  <CopyButton text={c} />
                </div>
                <p className="whitespace-pre-line text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                  {c}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function TweetFormatter() {
  const [text, setText] = useState("");

  const cleaned = useMemo(() => {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, "-")
      .replace(/[^\S\n]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }, [text]);

  const length = cleaned.length;
  const over = Math.max(0, length - 280);
  const ok = length <= 280;

  const tweets = useMemo(() => {
    if (!cleaned) return [];
    const sentences = cleaned
      .split(/(?<=[.!?…])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const chunks: string[] = [];
    let buffer = "";
    for (const s of sentences) {
      if (buffer && (buffer + " " + s).length > 260) {
        chunks.push(buffer);
        buffer = s;
      } else {
        buffer = buffer ? buffer + " " + s : s;
      }
    }
    if (buffer) chunks.push(buffer);
    return chunks;
  }, [cleaned]);

  const threadOutput = tweets.map((t, i) => `${t}\n\n${i + 1}/${tweets.length}`).join("\n\n");

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste text to clean up for X / Twitter…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div
              className={cn(
                "text-2xl font-bold tabular-nums",
                ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {length}
              <span className="text-base font-medium text-zinc-400"> / 280</span>
            </div>
            <div className="text-xs text-zinc-500">
              {ok ? "Fits in one tweet." : `${over} characters over the limit.`}
            </div>
          </div>
          <CopyButton text={cleaned} label="Copy formatted" />
        </div>
      </Card>
      <OutputArea
        value={cleaned}
        label="Formatted text"
        filename="tweet.txt"
        rows={8}
      />

      {tweets.length > 1 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Split into a thread ({tweets.length} tweets)
          </h3>
          <div className="mt-3 space-y-2">
            {tweets.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <span className="mr-2 font-semibold text-violet-600 dark:text-violet-400">
                  {i + 1}
                </span>
                {t}
                <span className="mt-1 block text-right text-[11px] text-zinc-400">
                  {t.length}/280
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <CopyButton text={threadOutput} label="Copy thread" />
          </div>
        </Card>
      )}
    </div>
  );
}

export function ThreadGenerator() {
  const [text, setText] = useState("");

  const tweets = useMemo(() => {
    const sentences = text
      .split(/(?<=[.!?…])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const chunks: string[] = [];
    let buffer = "";
    for (const s of sentences) {
      if (buffer && (buffer + " " + s).length > 240) {
        chunks.push(buffer);
        buffer = s;
      } else {
        buffer = buffer ? buffer + " " + s : s;
      }
    }
    if (buffer) chunks.push(buffer);
    return chunks;
  }, [text]);

  const output = tweets.map((t, i) => `${t}\n\n${i + 1}/${tweets.length}`).join("\n\n");

  return (
    <div className="space-y-6">
      <Textarea
        label="Long-form content"
        placeholder="Paste your full post, essay, or notes — it will be split into tweets…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <Card>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{tweets.length}</span>{" "}
          tweet{tweets.length === 1 ? "" : "s"} in your thread.
        </p>
      </Card>
      {tweets.length > 0 && (
        <>
          <CopyButton text={output} label="Copy full thread" />
          <div className="space-y-2">
            {tweets.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">
                    Tweet {i + 1} of {tweets.length}
                  </span>
                  <span className="text-[11px] text-zinc-400">{t.length} chars</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-800 dark:text-zinc-200">{t}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const LINKEDIN_HASHTAGS = [
  "contentcreation",
  "creatoreconomy",
  "productivity",
  "marketing",
  "growth",
  "socialmedia",
];

export function LinkedinFormatter() {
  const [text, setText] = useState("");
  const [addHashtags, setAddHashtags] = useState(true);

  const output = useMemo(() => {
    const sentences = text
      .split(/(?<=[.!?…])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    let out = sentences.join("\n");
    if (addHashtags) {
      const tags = LINKEDIN_HASHTAGS.map((t) => `#${t}`).join(" ");
      out += `\n\n${tags}`;
    }
    return out;
  }, [text, addHashtags]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your post"
        placeholder="Paste a draft to reformat for LinkedIn…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        hint="Breaks long paragraphs into scannable one-sentence lines — the LinkedIn-friendly style."
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={addHashtags}
          onChange={(e) => setAddHashtags(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Add trending hashtags at the end
      </label>
      <OutputArea value={output} label="LinkedIn post" filename="linkedin-post.txt" rows={12} />
    </div>
  );
}

function hashtagPool(niche: string): string[] {
  const base = cleanTag(niche);
  const variants = base
    ? [
        base,
        `${base}tips`,
        `${base}community`,
        `${base}life`,
        `${base}goals`,
        `${base}2026`,
      ]
    : [];
  return [...new Set([...variants, ...VIRAL_TAGS])].slice(0, 12);
}

export function InstagramCaptionOptimizer() {
  const [caption, setCaption] = useState("");
  const [niche, setNiche] = useState("");
  const [addLineBreaks, setAddLineBreaks] = useState(true);
  const [addHashtags, setAddHashtags] = useState(true);

  const output = useMemo(() => {
    let out = caption.trim();
    if (addLineBreaks) {
      const sentences = out
        .split(/(?<=[.!?…])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const lines: string[] = [];
      let line = "";
      for (const s of sentences) {
        if (line && line.split(" ").length + s.split(" ").length > 14) {
          lines.push(line);
          line = s;
        } else {
          line = line ? `${line} ${s}` : s;
        }
      }
      if (line) lines.push(line);
      out = lines.join("\n");
    }
    if (addHashtags && niche.trim()) {
      out += `\n\n${hashtagPool(niche).map((t) => `#${t}`).join(" ")}`;
    }
    return out;
  }, [caption, niche, addLineBreaks, addHashtags]);

  const length = output.length;
  const underLimit = length <= 2200;

  return (
    <div className="space-y-6">
      <Field label="Your caption">
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={8}
          placeholder="Paste your caption draft…"
        />
      </Field>
      <OptionRow>
        <Field label="Niche (for hashtags)" className="min-w-48 flex-1">
          <TextInput
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. travel, fitness"
          />
        </Field>
        <label className="flex h-9 items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={addLineBreaks}
            onChange={(e) => setAddLineBreaks(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Break into short lines
        </label>
        <label className="flex h-9 items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={addHashtags}
            onChange={(e) => setAddHashtags(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Add hashtags
        </label>
      </OptionRow>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div
              className={cn(
                "text-2xl font-bold tabular-nums",
                underLimit ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}
            >
              {length}
              <span className="text-base font-medium text-zinc-400"> / 2200</span>
            </div>
            <div className="text-xs text-zinc-500">
              {underLimit ? "Fits within Instagram's limit." : "Over the limit — trim it down."}
            </div>
          </div>
          <CopyButton text={output} label="Copy optimized" />
        </div>
      </Card>
      <OutputArea value={output} label="Optimized caption" filename="instagram-caption.txt" rows={12} />
    </div>
  );
}

const EMOJI_GROUPS: Record<string, string[]> = {
  "Smileys": ["😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜", "🤔", "😎", "🥳", "😢", "😭", "😤", "😴", "🤗", "🙃", "😉", "🤩", "🥰", "😇", "🤪", "😅", "🤯", "😳", "🙄"],
  "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤙", "👏", "🙌", "🙏", "🤝", "💪", "👋", "🤘", "🖐️", "✋", "👊", "✊", "🤛", "🤜", "🫶"],
  "People": ["👦", "👧", "🧑", "👨", "👩", "🧔", "👵", "👴", "👶", "🧒", "👮", "🕵️", "💂", "👷", "🤴", "👸", "🧙", "🧚", "🧛", "🧟"],
  "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦄", "🐝", "🦋", "🐢", "🐙", "🦑", "🐬", "🐳"],
  "Food": ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥭", "🍍", "🥥", "🥑", "🍅", "🥕", "🍞", "🧀", "🍔", "🍟", "🍕", "🌮", "🌯", "🍜", "🍣", "🍩", "🍪", "🎂", "🍰", "☕", "🍺"],
  "Travel": ["✈️", "🚗", "🚕", "🚌", "🚲", "🏍️", "🚂", "🚀", "🚁", "⛵", "🚢", "🏔️", "🌋", "🏝️", "🏖️", "🏜️", "🌄", "🌅", "🌆", "🌃", "🗽", "🗼", "🏰", "🎡", "🎢"],
  "Activities": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏓", "⛳", "🎣", "🎮", "🎲", "🎯", "🎳", "🏆", "🥇", "🥈", "🥉", "🎧", "🎤", "🎸", "🎺", "🎻", "🎹", "🎬", "🎨"],
  "Objects": ["💡", "🔑", "🔒", "🔓", "🔔", "⏰", "📱", "💻", "🖥️", "⌨️", "🖱️", "📷", "🎥", "📞", "💾", "💿", "📀", "📚", "📖", "✏️", "📝", "✂️", "📌", "📎", "🔍"],
  "Symbols": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "💯", "🔥", "✨", "⭐", "🌟", "💫", "⚡", "💥", "💦", "🌈", "☀️", "🌙", "⭐", "❄️", "🎉", "🎊", "✔️", "❌"],
  "Flags": ["🏁", "🚩", "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷", "🇧🇷", "🇮🇳", "🇨🇳", "🇳🇱", "🇸🇪", "🇳🇴", "🇩🇰", "🇵🇹", "🇷🇺", "🇲🇽", "🇦🇷", "🇿🇦", "🇳🇬", "🇪🇬"],
};

export function EmojiPicker() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Smileys");
  const [copied, setCopied] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("ctk-recent-emojis");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function copy(emoji: string) {
    navigator.clipboard.writeText(emoji).catch(() => undefined);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1200);
    setRecent((prev) => {
      const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 12);
      try {
        localStorage.setItem("ctk-recent-emojis", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return Object.values(EMOJI_GROUPS)
      .flat()
      .filter((e) => e.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-6">
      <Field label="Search emojis">
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword or paste an emoji…"
        />
      </Field>

      {recent.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recently used
          </h3>
          <div className="mt-3 grid grid-cols-8 gap-1 sm:grid-cols-12">
            {recent.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => copy(e)}
                className="rounded-lg p-2 text-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Click to copy"
              >
                {e}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {Object.keys(EMOJI_GROUPS).map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActive(group)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active === group
                ? "border-pink-500 bg-pink-500 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            )}
          >
            {group}
          </button>
        ))}
      </div>

      {filtered ? (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Search results
          </h3>
          <div className="mt-3 grid grid-cols-6 gap-1 sm:grid-cols-10 lg:grid-cols-12">
            {filtered.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => copy(e)}
                className="rounded-lg p-2 text-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Click to copy"
              >
                {e}
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {active}
            </h3>
            {copied && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Copied {copied}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1 sm:grid-cols-10 lg:grid-cols-12">
            {EMOJI_GROUPS[active].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => copy(e)}
                className="rounded-lg p-2 text-xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Click to copy"
              >
                {e}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
