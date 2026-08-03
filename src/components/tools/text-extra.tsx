"use client";

import { useMemo, useState } from "react";
import { Card, Stat, StatGrid, Textarea } from "@/components/ui";
import { OutputArea } from "@/components/ui/OutputArea";
import { formatNumber } from "@/lib/utils";

const EMOJI_REGEX =
  /(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base})[\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]*(?:\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base})[\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]*)*/gu;

export function RemoveEmojis() {
  const [text, setText] = useState("");

  const output = useMemo(() => text.replace(EMOJI_REGEX, ""), [text]);

  const removed = useMemo(() => {
    const matches = text.match(EMOJI_REGEX);
    return matches ? matches.length : 0;
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste text with emojis to strip them out…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        hint="Removes emojis and decorative characters while keeping text and punctuation."
      />
      <Stat label="Emojis removed" value={formatNumber(removed)} accent="#06b6d4" />
      <OutputArea value={output} label="Cleaned text" filename="no-emojis.txt" rows={8} />
    </div>
  );
}

export function RemoveSpecialCharacters() {
  const [text, setText] = useState("");
  const [keepSpaces, setKeepSpaces] = useState(true);
  const [keepPunctuation, setKeepPunctuation] = useState(false);

  const output = useMemo(() => {
    let pattern: RegExp;
    if (keepPunctuation) {
      pattern = keepSpaces
        ? /[^\p{L}\p{N}\s.,!?;:'"-]/gu
        : /[^\p{L}\p{N}.,!?;:'"-]/gu;
    } else {
      pattern = keepSpaces ? /[^\p{L}\p{N}\s]/gu : /[^\p{L}\p{N}]/gu;
    }
    return text.replace(pattern, "");
  }, [text, keepSpaces, keepPunctuation]);

  const removed = useMemo(() => text.length - output.length, [text, output]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste text with symbols, $, @, #, %, etc…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        hint="Keeps letters (including accented), digits and whitespace."
      />
      <Card className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={keepSpaces}
            onChange={(e) => setKeepSpaces(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Keep spaces and line breaks
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={keepPunctuation}
            onChange={(e) => setKeepPunctuation(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Keep basic punctuation (. , ! ? ; : &apos; &quot; -)
        </label>
      </Card>
      <StatGrid>
        <Stat label="Chars before" value={formatNumber(text.length)} />
        <Stat label="Chars after" value={formatNumber(output.length)} />
        <Stat label="Chars removed" value={formatNumber(removed)} accent="#06b6d4" />
      </StatGrid>
      <OutputArea value={output} label="Cleaned text" filename="cleaned.txt" rows={8} />
    </div>
  );
}
