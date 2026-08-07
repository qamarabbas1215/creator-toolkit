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
import { OutputArea } from "@/components/ui/OutputArea";
import { splitWords } from "@/lib/text";
import { cn } from "@/lib/utils";
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LOREM_WORDS = LOREM.split(/\s+/);

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

export function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [perParagraph, setPerParagraph] = useState(4);
  const [output, setOutput] = useState("");

  function generate() {
    const p = Math.max(1, Math.min(20, paragraphs));
    const s = Math.max(1, Math.min(12, perParagraph));
    const lines = Array.from({ length: p }, (_, pi) => {
      const words = Array.from(
        { length: s },
        (_, wi) => pick(LOREM_WORDS, pi * 7919 + wi * 104729)
      ).join(" ");
      return words.charAt(0).toUpperCase() + words.slice(1) + ".";
    });
    setOutput(lines.join("\n\n"));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Paragraphs (1–20)">
          <TextInput
            type="number"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value) || 1)}
            className="w-24"
          />
        </Field>
        <Field label="Sentences per paragraph (1–12)">
          <TextInput
            type="number"
            min={1}
            max={12}
            value={perParagraph}
            onChange={(e) => setPerParagraph(Number(e.target.value) || 1)}
            className="w-28"
          />
        </Field>
        <Button onClick={generate}>Generate</Button>
      </OptionRow>
      <OutputArea value={output} onChange={setOutput} label="Lorem ipsum" filename="lorem-ipsum.txt" rows={10} />
    </div>
  );
}

export function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState("newline");

  const output = useMemo(() => {
    const n = Math.max(0, Math.min(1000, count));
    const sep = separator === "newline" ? "\n" : separator === "space" ? " " : "";
    return Array.from({ length: n }, () => text).join(sep);
  }, [text, count, separator]);

  return (
    <div className="space-y-6">
      <Textarea label="Text to repeat" value={text} onChange={(e) => setText(e.target.value)} rows={5} />
      <OptionRow>
        <Field label="Times (0–1000)">
          <TextInput type="number" min={0} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 0)} className="w-24" />
        </Field>
        <Field label="Separator">
          <Select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="newline">New line</option>
            <option value="space">Space</option>
            <option value="none">None</option>
          </Select>
        </Field>
      </OptionRow>
      <OutputArea value={output} filename="repeated.txt" rows={8} />
    </div>
  );
}

function csvEscape(cell: string): string {
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export function TextToCsv() {
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState("comma");

  const output = useMemo(() => {
    const split =
      delimiter === "tab"
        ? /\t/
        : delimiter === "pipe"
          ? /\|/
          : delimiter === "space"
            ? /\s+/
            : /,/;
    const rows = text
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0)
      .map((line) => line.split(split).map((c) => c.trim()).map(csvEscape).join(","));
    return rows.join("\n");
  }, [text, delimiter]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Text lines"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"Name, email, city\nJohn, john@example.com, Austin\n"}
      />
      <OptionRow>
        <Field label="Column delimiter">
          <Select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value="comma">Comma</option>
            <option value="tab">Tab</option>
            <option value="pipe">Pipe (|)</option>
            <option value="space">Whitespace</option>
          </Select>
        </Field>
      </OptionRow>
      <OutputArea value={output} label="CSV output" filename="data.csv" rows={10} />
    </div>
  );
}

export function ColumnAligner() {
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState("pipe");

  const output = useMemo(() => {
    const split =
      delimiter === "tab" ? /\t/ : delimiter === "space" ? /\s{2,}/ : /\s*\|\s*/;
    const rows = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const cells = rows.map((r) => r.split(split).map((c) => c.trim()));
    const widths = cells.reduce<number[]>((acc, row) => {
      row.forEach((c, i) => {
        acc[i] = Math.max(acc[i] ?? 0, c.length);
      });
      return acc;
    }, []);
    return cells
      .map((row) => row.map((c, i) => c.padEnd(widths[i] ?? c.length)).join("  ").trimEnd())
      .join("\n");
  }, [text, delimiter]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Rows (one per line)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"Name | Age | City\nAlice | 28 | Austin\nBob | 34 | Denver"}
      />
      <OptionRow>
        <Field label="Column separator">
          <Select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value="pipe">Pipe (|)</option>
            <option value="tab">Tab</option>
            <option value="space">Multiple spaces</option>
          </Select>
        </Field>
      </OptionRow>
      <OutputArea value={output} label="Aligned columns" filename="aligned.txt" rows={10} />
    </div>
  );
}

const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function threeDigits(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  const hundred = ONES[Math.floor(n / 100)];
  const rest = n % 100;
  return hundred + " hundred" + (rest ? " and " + threeDigits(rest) : "");
}

function numberToWords(n: number): string {
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 999_999_999_999) {
    return "Enter a whole number between 0 and 999,999,999,999";
  }
  if (n === 0) return "zero";
  const groups: [number, string][] = [
    [1_000_000_000, "billion"],
    [1_000_000, "million"],
    [1_000, "thousand"],
  ];
  let out = "";
  let rem = n;
  for (const [div, label] of groups) {
    const g = Math.floor(rem / div);
    if (g > 0) {
      out += (out ? " " : "") + threeDigits(g) + " " + label;
      rem -= g * div;
    }
  }
  if (rem > 0) out += (out ? " " : "") + threeDigits(rem);
  return out;
}

export function NumberToWords() {
  const [value, setValue] = useState("0");
  const output = useMemo(() => numberToWords(Number(value)), [value]);

  return (
    <div className="space-y-6">
      <Field label="Number (0 – 999,999,999,999)">
        <TextInput type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
      <OutputArea value={output} label="In words" filename="number-in-words.txt" rows={3} />
    </div>
  );
}

export function PalindromeChecker() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!clean) return null;
    const isPalindrome = clean === [...clean].reverse().join("");
    const reversed = [...text].reverse().join("");
    return { isPalindrome, reversed, length: clean.length };
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea label="Text" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      {result && (
        <Card
          className={cn(
            "border",
            result.isPalindrome
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
              : "border-zinc-200 dark:border-zinc-800"
          )}
        >
          <p className="text-sm font-semibold">
            {result.isPalindrome
              ? "🎉 Yes — this reads the same forwards and backwards."
              : "Not a palindrome."}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Reversed: <span className="break-all">{result.reversed}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Alphanumeric length: {result.length}</p>
        </Card>
      )}
    </div>
  );
}

export function AnagramFinder() {
  const [text, setText] = useState("");
  const [sortMode, setSortMode] = useState<"length" | "alpha">("length");

  const words = useMemo(() => {
    const list = splitWords(text.toLowerCase());
    const freq = new Map<string, { word: string; count: number }>();
    for (const w of list) {
      if (w.length < 2) continue;
      const key = [...w].sort().join("");
      const entry = freq.get(key);
      if (entry) entry.count += 1;
      else freq.set(key, { word: w, count: 1 });
    }
    const groups = [...freq.values()].filter((g) => g.count > 1);
    groups.sort((a, b) =>
      sortMode === "length" ? b.word.length - a.word.length : a.word.localeCompare(b.word)
    );
    return groups.map((g) => g.word);
  }, [text, sortMode]);

  return (
    <div className="space-y-6">
      <Textarea label="Text with potential anagrams" value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      <OptionRow>
        <Field label="Sort by">
          <Select value={sortMode} onChange={(e) => setSortMode(e.target.value as typeof sortMode)}>
            <option value="length">Longest first</option>
            <option value="alpha">Alphabetical</option>
          </Select>
        </Field>
      </OptionRow>
      {words.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {words.map((w) => (
            <span key={w} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              {w}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter text with repeated word spellings to find anagram matches.
        </p>
      )}
    </div>
  );
}

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
  h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
  o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
  v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "'": ".----.",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function MorseCodeConverter() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");

  const output = useMemo(() => {
    try {
      if (direction === "encode") {
        return text
          .toLowerCase()
          .split(" ")
          .map((word) =>
            [...word]
              .map((ch) => (MORSE[ch] ?? (ch === "" ? "" : "?")))
              .join(" ")
          )
          .join("   ");
      }
      return text
        .split(/\s{3,}|\s*\|\s*/)
        .map((word) =>
          word
            .trim()
            .split(/\s+/)
            .map((code) => MORSE_REVERSE[code] ?? "?")
            .join("")
        )
        .join(" ");
    } catch {
      return "";
    }
  }, [text, direction]);

  return (
    <div className="space-y-6">
      <Textarea
        label={direction === "encode" ? "Plain text" : "Morse code"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant={direction === "encode" ? "primary" : "secondary"} onClick={() => setDirection("encode")}>
          Encode to Morse
        </Button>
        <Button variant={direction === "decode" ? "primary" : "secondary"} onClick={() => setDirection("decode")}>
          Decode to text
        </Button>
      </div>
      <OutputArea value={output} label={direction === "encode" ? "Morse code" : "Decoded text"} filename="morse.txt" rows={5} />
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Words are separated by three spaces; letters by single spaces.
      </p>
    </div>
  );
}

function inlineMd(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let inList: "ul" | "ol" | null = null;
  const closeList = () => {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      closeList();
      html.push(`<h${h[1].length}>${inlineMd(h[2])}</h${h[1].length}>`);
      continue;
    }
    const ul = line.match(/^[-*]\s+(.*)/);
    if (ul) {
      if (inList !== "ul") {
        closeList();
        html.push("<ul>");
        inList = "ul";
      }
      html.push(`<li>${inlineMd(ul[1])}</li>`);
      continue;
    }
    const ol = line.match(/^\d+[.)]\s+(.*)/);
    if (ol) {
      if (inList !== "ol") {
        closeList();
        html.push("<ol>");
        inList = "ol";
      }
      html.push(`<li>${inlineMd(ol[1])}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${inlineMd(line)}</p>`);
  }
  closeList();
  return html.join("\n");
}

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState("# Hello\n\nWrite **markdown** on the left, preview here.");

  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  return (
    <div className="space-y-6">
      <Textarea label="Markdown" value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={10} className="font-mono" />
      <Card>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Preview</h3>
        <div
          className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_a]:text-violet-600"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Card>
    </div>
  );
}

const PASS_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const PASS_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [output, setOutput] = useState("");
  const [count, setCount] = useState(1);

  function generate() {
    const n = Math.max(4, Math.min(128, length));
    const c = Math.max(1, Math.min(50, count));
    let pool = PASS_CHARS;
    if (numbers) pool += "0123456789";
    if (symbols) pool += PASS_SYMBOLS;
    const rand = new Uint32Array(n);
    crypto.getRandomValues(rand);
    const list = Array.from({ length: c }, () =>
      Array.from({ length: n }, (_, i) => pool[rand[i] % pool.length]).join("")
    );
    setOutput(list.join("\n"));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label={`Length: ${length}`}>
          <input type="range" min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-48 accent-violet-600" />
        </Field>
        <Field label="Passwords (1–50)">
          <TextInput type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} className="w-24" />
        </Field>
        <Button onClick={generate}>Generate</Button>
      </OptionRow>
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Symbols
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Numbers
        </label>
      </div>
      <OutputArea value={output} onChange={setOutput} label="Generated passwords" filename="passwords.txt" rows={6} />
    </div>
  );
}

export function CharacterFrequencyCounter() {
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const rows = useMemo(() => {
    const map = new Map<string, number>();
    const source = caseSensitive ? text : text.toLowerCase();
    for (const ch of source) {
      if (ch.trim() === "") continue;
      map.set(ch, (map.get(ch) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
  }, [text, caseSensitive]);

  return (
    <div className="space-y-6">
      <Textarea label="Text" value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
        Case sensitive
      </label>
      {rows.length > 0 ? (
        <div className="space-y-1.5">
          {rows.map(([ch, count]) => (
            <div key={ch} className="flex items-center gap-3 text-sm">
              <span className="w-8 font-mono text-zinc-700 dark:text-zinc-300">{ch}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${(count / rows[0][1]) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-zinc-500">{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Type some text to see character frequency.</p>
      )}
    </div>
  );
}

export function WordFrequencyCounter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(20);

  const rows = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of splitWords(text)) {
      const key = w.toLowerCase();
      if (key.length < 2) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, Math.max(1, Math.min(100, limit)));
  }, [text, limit]);

  const max = rows.length ? rows[0][1] : 0;

  return (
    <div className="space-y-6">
      <Textarea label="Text" value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      <OptionRow>
        <Field label="Top words">
          <TextInput type="number" min={1} max={100} value={limit} onChange={(e) => setLimit(Number(e.target.value) || 1)} className="w-24" />
        </Field>
      </OptionRow>
      {rows.length > 0 ? (
        <div className="space-y-1.5">
          {rows.map(([word, count]) => (
            <div key={word} className="flex items-center gap-3 text-sm">
              <span className="w-40 truncate text-zinc-700 dark:text-zinc-300">{word}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-zinc-500">{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Type some text to see word frequency.</p>
      )}
    </div>
  );
}
