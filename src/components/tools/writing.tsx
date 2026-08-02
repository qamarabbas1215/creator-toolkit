"use client";

import { useMemo, useState } from "react";
import { Card, Field, Select, Stat, StatGrid, Textarea } from "@/components/ui";
import { CopyButton } from "@/components/ui/CopyButton";
import { DownloadButton } from "@/components/ui/DownloadButton";
import {
  analyzeText,
  keywordFrequency,
  readingLevelLabel,
} from "@/lib/text";
import { formatDurationLong, formatNumber } from "@/lib/utils";

export function CharacterCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        hint="Counts update live as you type."
      />
      <StatGrid>
        <Stat label="Characters" value={formatNumber(stats.characters)} />
        <Stat
          label="Characters (no spaces)"
          value={formatNumber(stats.charactersNoSpaces)}
        />
        <Stat label="Words" value={formatNumber(stats.words)} />
        <Stat label="Sentences" value={formatNumber(stats.sentences)} />
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs)} />
        <Stat label="Lines" value={formatNumber(stats.lines)} />
      </StatGrid>
    </div>
  );
}

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);
  const keywords = useMemo(() => keywordFrequency(text, 10), [text]);

  const summary = useMemo(() => {
    return [
      `Words: ${stats.words}`,
      `Characters: ${stats.characters}`,
      `Characters (no spaces): ${stats.charactersNoSpaces}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Unique words: ${stats.uniqueWords}`,
      `Average word length: ${stats.averageWordLength.toFixed(1)}`,
      `Average words per sentence: ${stats.averageWordsPerSentence.toFixed(1)}`,
      `Reading time: ${formatDurationLong(stats.readingTimeMinutes)}`,
      `Speaking time: ${formatDurationLong(stats.speakingTimeMinutes)}`,
    ].join("\n");
  }, [stats]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste your article, essay, or script…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={summary} label="Copy summary" />
        <DownloadButton text={summary} filename="word-count.txt" />
      </div>
      <StatGrid>
        <Stat label="Words" value={formatNumber(stats.words)} accent="#8b5cf6" />
        <Stat label="Unique words" value={formatNumber(stats.uniqueWords)} />
        <Stat label="Characters" value={formatNumber(stats.characters)} />
        <Stat
          label="Avg word length"
          value={stats.averageWordLength.toFixed(1)}
        />
        <Stat
          label="Words / sentence"
          value={stats.averageWordsPerSentence.toFixed(1)}
        />
        <Stat label="Long words (7+)" value={formatNumber(stats.longWords)} />
        <Stat label="Reading time" value={formatDurationLong(stats.readingTimeMinutes)} />
        <Stat label="Speaking time" value={formatDurationLong(stats.speakingTimeMinutes)} />
        <Stat
          label="Reading level"
          value={readingLevelLabel(stats.readingEase)}
        />
        <Stat label="Grade level" value={stats.gradeLevel.toFixed(1)} />
      </StatGrid>

      {keywords.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Top keywords
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k.word}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
              >
                {k.word} × {k.count}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function SentenceCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  const sentences = useMemo(
    () =>
      text
        .split(/(?<=[.!?…])\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [text]
  );
  const longest = sentences.length
    ? Math.max(...sentences.map((s) => s.split(/\s+/).length))
    : 0;
  const shortest = sentences.length
    ? Math.min(...sentences.map((s) => s.split(/\s+/).filter(Boolean).length))
    : 0;

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <StatGrid>
        <Stat label="Sentences" value={formatNumber(stats.sentences)} accent="#3b82f6" />
        <Stat
          label="Avg words / sentence"
          value={stats.averageWordsPerSentence.toFixed(1)}
        />
        <Stat label="Longest sentence" value={`${longest} words`} />
        <Stat label="Shortest sentence" value={`${shortest} words`} />
      </StatGrid>
    </div>
  );
}

export function ParagraphCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <StatGrid>
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs)} accent="#3b82f6" />
        <Stat label="Lines" value={formatNumber(stats.lines)} />
        <Stat label="Words" value={formatNumber(stats.words)} />
        <Stat
          label="Avg words / paragraph"
          value={
            stats.paragraphs
              ? (stats.words / stats.paragraphs).toFixed(1)
              : "0"
          }
        />
      </StatGrid>
    </div>
  );
}

const READING_SPEEDS = [
  { label: "Slow reader · 150 wpm", value: 150 },
  { label: "Average · 200 wpm", value: 200 },
  { label: "Fast reader · 250 wpm", value: 250 },
  { label: "Skimming · 300 wpm", value: 300 },
];

export function ReadingTime() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);
  const words = useMemo(() => analyzeText(text).words, [text]);

  const times = [
    { label: "150 wpm", minutes: words / 150 },
    { label: "200 wpm", minutes: words / 200 },
    { label: "250 wpm", minutes: words / 250 },
    { label: "300 wpm", minutes: words / 300 },
  ];

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste your article, blog post, or newsletter…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <Field label="Reading speed">
        <Select value={wpm} onChange={(e) => setWpm(Number(e.target.value))}>
          {READING_SPEEDS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>
      <Card>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatNumber(words)} words at {wpm} wpm
        </div>
        <div className="mt-1 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatDurationLong(words / wpm)}
        </div>
      </Card>
      <StatGrid>
        {times.map((t) => (
          <Stat
            key={t.label}
            label={`at ${t.label}`}
            value={formatDurationLong(t.minutes)}
          />
        ))}
      </StatGrid>
    </div>
  );
}

const SPEAKING_SPEEDS = [
  { label: "Slow & clear · 100 wpm", value: 100 },
  { label: "Conversational · 130 wpm", value: 130 },
  { label: "Enthusiastic · 160 wpm", value: 160 },
  { label: "Fast / energetic · 190 wpm", value: 190 },
];

export function SpeakingTime() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(130);
  const words = useMemo(() => analyzeText(text).words, [text]);

  const minutes = words / wpm;

  const label =
    minutes < 1
      ? "Perfect for Shorts / Reels"
      : minutes <= 5
        ? "Short-form video"
        : minutes <= 15
          ? "Standard YouTube video"
          : minutes <= 45
            ? "Long-form video / podcast"
            : "Documentary / course";

  return (
    <div className="space-y-6">
      <Textarea
        label="Your script"
        placeholder="Paste your script to estimate speaking time…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <Field label="Speaking speed">
        <Select value={wpm} onChange={(e) => setWpm(Number(e.target.value))}>
          {SPEAKING_SPEEDS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>
      <Card>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatNumber(words)} words at {wpm} wpm
        </div>
        <div className="mt-1 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatDurationLong(minutes)}
        </div>
        <div className="mt-2 inline-block rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-medium text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
          {label}
        </div>
      </Card>
      <StatGrid>
        <Stat label="at 100 wpm" value={formatDurationLong(words / 100)} />
        <Stat label="at 130 wpm" value={formatDurationLong(words / 130)} />
        <Stat label="at 160 wpm" value={formatDurationLong(words / 160)} />
        <Stat label="at 190 wpm" value={formatDurationLong(words / 190)} />
      </StatGrid>
    </div>
  );
}
