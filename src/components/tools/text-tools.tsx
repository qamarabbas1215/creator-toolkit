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
import { OutputArea } from "@/components/ui/OutputArea";
import { Button } from "@/components/ui/Button";
import { CASE_TYPES, convertCase, type CaseType } from "@/lib/case";
import { cn } from "@/lib/utils";
import { extractEmails, extractNumbers, extractUrls } from "@/lib/text";

export function CaseConverter() {
  const [text, setText] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("title");

  const output = useMemo(
    () => convertCase(text, activeCase),
    [text, activeCase]
  );

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste text to convert…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {CASE_TYPES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCase(c.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              activeCase === c.id
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <OutputArea value={output} filename="converted-text.txt" rows={8} />
    </div>
  );
}

export function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = useMemo(() => {
    if (!find) return text;
    if (caseSensitive) return text.split(find).join(replace);
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(escaped, "gi"), replace);
  }, [text, find, replace, caseSensitive]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Input text"
        placeholder="Paste the text you want to modify…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <OptionRow>
        <Field label="Find" className="min-w-48 flex-1">
          <TextInput
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Text to find"
          />
        </Field>
        <Field label="Replace with" className="min-w-48 flex-1">
          <TextInput
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="Replacement text"
          />
        </Field>
        <label className="flex h-9 cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          Case sensitive
        </label>
      </OptionRow>
      <OutputArea value={output} filename="find-replaced.txt" rows={8} />
    </div>
  );
}

export function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [keepFirst, setKeepFirst] = useState(true);

  const { output, removed } = useMemo(() => {
    const lines = text.split("\n");
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    const result: string[] = [];
    const seen = new Set<string>();
    if (keepFirst) {
      for (const line of lines) {
        const key = line.trim().toLowerCase();
        if (key === "" || seen.has(key)) continue;
        seen.add(key);
        result.push(line);
      }
    } else {
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const key = line.trim().toLowerCase();
        if (key === "" || seen.has(key)) continue;
        seen.add(key);
        result.unshift(line);
      }
    }
    return { output: result.join("\n"), removed: nonEmpty.length - seen.size };
  }, [text, keepFirst]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Input lines"
        placeholder="Paste lines with duplicates…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <StatGrid>
        <Stat label="Original lines" value={text ? text.split("\n").filter((l) => l.trim() !== "").length : 0} />
        <Stat label="Unique lines" value={output ? output.split("\n").length : 0} />
        <Stat label="Duplicates removed" value={removed} accent="#06b6d4" />
      </StatGrid>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={keepFirst}
          onChange={(e) => setKeepFirst(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Keep first occurrence
      </label>
      <OutputArea value={output} filename="deduplicated.txt" rows={8} />
    </div>
  );
}

export function RemoveEmptyLines() {
  const [text, setText] = useState("");
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const output = useMemo(() => {
    let lines = text.split("\n");
    if (trimWhitespace) lines = lines.map((l) => l.trim());
    return lines.filter((l) => l !== "").join("\n");
  }, [text, trimWhitespace]);

  const removed = useMemo(() => {
    const lines = text.split("\n");
    const kept = trimWhitespace
      ? lines.map((l) => l.trim()).filter((l) => l !== "")
      : lines.filter((l) => l !== "");
    return lines.length - kept.length;
  }, [text, trimWhitespace]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Input text"
        placeholder="Paste text with blank lines…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={trimWhitespace}
          onChange={(e) => setTrimWhitespace(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Also trim whitespace on each line
      </label>
      <Card>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Removed <span className="font-semibold text-zinc-900 dark:text-zinc-100">{removed}</span>{" "}
          empty line{removed === 1 ? "" : "s"}.
        </p>
      </Card>
      <OutputArea value={output} filename="cleaned.txt" rows={8} />
    </div>
  );
}

const SORT_MODES = [
  { id: "alpha-asc", label: "Alphabetical (A → Z)" },
  { id: "alpha-desc", label: "Alphabetical (Z → A)" },
  { id: "length-asc", label: "Shortest first" },
  { id: "length-desc", label: "Longest first" },
  { id: "natural", label: "Natural / numeric" },
  { id: "reverse", label: "Reverse order" },
  { id: "shuffle", label: "Shuffle randomly" },
];

export function LineSorter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("alpha-asc");
  const [shuffled, setShuffled] = useState<string[]>([]);

  const sorted = useMemo(() => {
    const lines = text.split("\n");
    switch (mode) {
      case "alpha-asc":
        return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
      case "alpha-desc":
        return [...lines].sort((a, b) => b.localeCompare(a)).join("\n");
      case "length-asc":
        return [...lines].sort((a, b) => a.length - b.length).join("\n");
      case "length-desc":
        return [...lines].sort((a, b) => b.length - a.length).join("\n");
      case "natural":
        return [...lines]
          .sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
          )
          .join("\n");
      case "reverse":
        return [...lines].reverse().join("\n");
      default:
        return text;
    }
  }, [text, mode]);

  const output = mode === "shuffle" ? shuffled.join("\n") : sorted;

  function reshuffle() {
    setShuffled(
      text
        .split("\n")
        .map((l) => ({ l, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map((o) => o.l)
    );
  }

  function handleTextChange(value: string) {
    setText(value);
    if (mode === "shuffle") reshuffle();
  }

  function handleModeChange(value: string) {
    setMode(value);
    if (value === "shuffle") reshuffle();
  }

  return (
    <div className="space-y-6">
      <Textarea
        label="Input lines"
        placeholder="Paste lines to sort…"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={8}
      />
      <OptionRow>
        <Field label="Sort mode" className="min-w-56 flex-1">
          <Select value={mode} onChange={(e) => handleModeChange(e.target.value)}>
            {SORT_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
        {mode === "shuffle" && (
          <Button onClick={reshuffle} className="h-9 self-end">
            Shuffle again
          </Button>
        )}
      </OptionRow>
      <OutputArea value={output} filename="sorted.txt" rows={8} />
    </div>
  );
}

export function PrefixSuffix() {
  const [text, setText] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const output = useMemo(
    () =>
      text
        .split("\n")
        .map((l) => `${prefix}${l}${suffix}`)
        .join("\n"),
    [text, prefix, suffix]
  );

  return (
    <div className="space-y-6">
      <Textarea
        label="Input lines"
        placeholder="Paste lines to modify…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <OptionRow>
        <Field label="Prefix" className="min-w-40 flex-1">
          <TextInput
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g. - ["
          />
        </Field>
        <Field label="Suffix" className="min-w-40 flex-1">
          <TextInput
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="e.g. ] -"
          />
        </Field>
      </OptionRow>
      <OutputArea value={output} filename="prefixed.txt" rows={8} />
    </div>
  );
}

const REVERSE_MODES = [
  { id: "chars", label: "Reverse characters" },
  { id: "words", label: "Reverse word order" },
  { id: "chars-per-word", label: "Reverse letters in each word" },
  { id: "lines", label: "Reverse line order" },
  { id: "invert-case", label: "Invert case (a→A, A→a)" },
];

export function ReverseText() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("chars");

  const output = useMemo(() => {
    switch (mode) {
      case "chars":
        return [...text].reverse().join("");
      case "words":
        return text.split(/\s+/).reverse().join(" ");
      case "chars-per-word":
        return text
          .split(/\s+/)
          .map((w) => [...w].reverse().join(""))
          .join(" ");
      case "lines":
        return text.split("\n").reverse().join("\n");
      case "invert-case":
        return [...text]
          .map((c) =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
          )
          .join("");
      default:
        return text;
    }
  }, [text, mode]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Type or paste text to reverse…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <Field label="Mode">
        <Select value={mode} onChange={(e) => setMode(e.target.value)}>
          {REVERSE_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </Select>
      </Field>
      <OutputArea value={output} filename="reversed.txt" rows={8} />
    </div>
  );
}

export function ExtractUrls() {
  const [text, setText] = useState("");
  const urls = useMemo(() => extractUrls(text), [text]);
  const output = urls.join("\n");

  return (
    <div className="space-y-6">
      <Textarea
        label="Source text"
        placeholder="Paste text containing links…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <Stat label="URLs found" value={urls.length} accent="#06b6d4" />
      <OutputArea value={output} filename="urls.txt" rows={8} />
    </div>
  );
}

export function ExtractEmails() {
  const [text, setText] = useState("");
  const emails = useMemo(() => extractEmails(text), [text]);
  const output = emails.join("\n");

  return (
    <div className="space-y-6">
      <Textarea
        label="Source text"
        placeholder="Paste text containing email addresses…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <Stat label="Emails found" value={emails.length} accent="#06b6d4" />
      <OutputArea value={output} filename="emails.txt" rows={8} />
    </div>
  );
}

export function ExtractNumbers() {
  const [text, setText] = useState("");
  const numbers = useMemo(() => extractNumbers(text), [text]);
  const output = numbers.join("\n");

  return (
    <div className="space-y-6">
      <Textarea
        label="Source text"
        placeholder="Paste text containing numbers…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <StatGrid>
        <Stat label="Numbers found" value={numbers.length} accent="#06b6d4" />
        <Stat
          label="Sum"
          value={formatSum(numbers)}
        />
      </StatGrid>
      <OutputArea value={output} filename="numbers.txt" rows={8} />
    </div>
  );
}

function formatSum(numbers: string[]): string {
  const total = numbers.reduce(
    (acc, n) => acc + (Number(n.replace(",", ".")) || 0),
    0
  );
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(total);
}
