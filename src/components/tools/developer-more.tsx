"use client";

import { useMemo, useState } from "react";
import { Card, Field, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function TimestampConverter() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const raw = input.trim();
    if (!raw) return null;
    const numeric = Number(raw);
    let date: Date | null = null;
    if (!Number.isNaN(numeric)) {
      const ms = numeric > 1e12 ? numeric : numeric * 1000;
      date = new Date(ms);
    } else {
      const parsed = new Date(raw);
      date = Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    if (!date) return null;
    return {
      utc: date.toISOString(),
      local: date.toLocaleString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      iso: date.toISOString().replace("T", " ").slice(0, 19) + "Z",
    };
  }, [input]);

  const output = useMemo(
    () =>
      result
        ? [
            `Unix timestamp (seconds): ${result.unixSeconds}`,
            `Unix timestamp (milliseconds): ${result.unixMs}`,
            `ISO 8601: ${result.utc}`,
            `UTC: ${result.utc}`,
            `Local: ${result.local}`,
          ].join("\n")
        : "",
    [result]
  );

  return (
    <div className="space-y-6">
      <Field label="Timestamp or date">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1754411234 or 2026-08-07T10:00:00Z"
          className={INPUT_CLS}
        />
      </Field>
      {!result && input && (
        <p className="text-sm text-red-500">Could not parse that as a timestamp or date.</p>
      )}
      <OutputArea value={output} label="Converted timestamps" filename="timestamps.txt" rows={5} />
    </div>
  );
}

const HEX_RE = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;
const RGB_RE = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/i;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  const max = Math.max(rs, gs, bs);
  const min = Math.min(rs, gs, bs);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rs) h = (gs - bs) / d + (gs < bs ? 6 : 0);
    else if (max === gs) h = (bs - rs) / d + 2;
    else h = (rs - gs) / d + 4;
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function ColorConverter() {
  const [input, setInput] = useState("#8b5cf6");

  const result = useMemo(() => {
    const raw = input.trim();
    let rgb: { r: number; g: number; b: number } | null = null;
    if (HEX_RE.test(raw)) {
      rgb = hexToRgb(raw);
    } else {
      const m = raw.match(RGB_RE);
      if (m) rgb = { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
    }
    if (!rgb) return null;
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
      css: `rgb(${rgb.r} ${rgb.g} ${rgb.b})`,
    };
  }, [input]);

  return (
    <div className="space-y-6">
      <Field label="HEX or RGB color">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#8b5cf6 or rgb(139, 92, 246)"
          className={INPUT_CLS}
        />
      </Field>
      {!result && input && <p className="text-sm text-red-500">Invalid color format.</p>}
      {result && (
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="h-16 w-16 rounded-xl border border-zinc-200 dark:border-zinc-700"
              style={{ backgroundColor: result.hex }}
            />
            <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              <p className="font-mono">{result.hex}</p>
              <p className="font-mono">{result.rgb}</p>
              <p className="font-mono">{result.hsl}</p>
              <p className="font-mono">{result.css}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export function JsonToCsv() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) return { output: "", error: null };
      const objects = arr.filter((x) => x !== null && typeof x === "object");
      if (objects.length === 0) return { output: "", error: "JSON must contain objects." };
      const keys = [...new Set(objects.flatMap((o) => Object.keys(o)))];
      const esc = (v: unknown) => {
        const s = v === null || v === undefined ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      return {
        output: [keys.join(","), ...objects.map((o) => keys.map((k) => esc(o[k])).join(","))].join("\n"),
        error: null,
      };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <Textarea label="JSON array or object" value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" placeholder={JSON.stringify([{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }], null, 2)} />
      {error && input && <p className="text-sm text-red-500">Error: {error}</p>}
      <OutputArea value={output} label="CSV output" filename="output.csv" rows={10} />
    </div>
  );
}

export function CsvToJson() {
  const [input, setInput] = useState("");
  const [hasHeader, setHasHeader] = useState(true);

  const { output, error } = useMemo(() => {
    try {
      const lines = input.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length === 0) return { output: "", error: null };
      const parseRow = (line: string): string[] => {
        const cells: string[] = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (inQuotes) {
            if (ch === '"') {
              if (line[i + 1] === '"') {
                cur += '"';
                i++;
              } else inQuotes = false;
            } else cur += ch;
          } else if (ch === '"') inQuotes = true;
          else if (ch === ",") {
            cells.push(cur);
            cur = "";
          } else cur += ch;
        }
        cells.push(cur);
        return cells;
      };
      const rows = lines.map(parseRow);
      const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
      const data = hasHeader ? rows.slice(1) : rows;
      const json = data.map((row) =>
        Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
      );
      return { output: JSON.stringify(json, null, 2), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Failed to parse CSV" };
    }
  }, [input, hasHeader]);

  return (
    <div className="space-y-6">
      <Textarea label="CSV" value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="font-mono" placeholder={"name,email,city\nAda,ada@example.com,London"} />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
        First row is a header
      </label>
      {error && input && <p className="text-sm text-red-500">Error: {error}</p>}
      <OutputArea value={output} label="JSON output" filename="output.json" rows={10} />
    </div>
  );
}

export function JsonToYaml() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    try {
      const value = JSON.parse(input);
      const lines: string[] = [];
      const scalar = (v: unknown) =>
        typeof v === "string" ? (needsQuote(v) ? JSON.stringify(v) : v) : String(v);
      const needsQuote = (s: string) =>
        /^[\s-]|[:#\[\]{},&*!|>'"%@`]|:\s/.test(s) || s === "";
      const walk = (v: unknown, indent: string, key?: string) => {
        if (v === null || v === undefined) {
          lines.push(`${indent}${key ? key + ": " : ""}null`);
        } else if (typeof v === "object") {
          if (Array.isArray(v)) {
            if (key) lines.push(`${indent}${key}:`);
            const childIndent = key ? indent + "  " : indent;
            for (const item of v) {
              if (item !== null && typeof item === "object") {
                lines.push(`${childIndent}-`);
                walk(item, childIndent + "  ");
              } else {
                lines.push(`${childIndent}- ${scalar(item)}`);
              }
            }
          } else {
            const entries = Object.entries(v as Record<string, unknown>);
            if (entries.length === 0) {
              lines.push(`${indent}${key ? key + ": " : ""}{}`);
            } else if (key) {
              lines.push(`${indent}${key}:`);
              for (const [k, val] of entries) walk(val, indent + "  ", k);
            } else {
              for (const [k, val] of entries) walk(val, indent, k);
            }
          }
        } else {
          lines.push(`${indent}${key ? key + ": " : ""}${scalar(v)}`);
        }
      };
      walk(value, "");
      return { output: lines.join("\n"), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <Textarea label="JSON" value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono" placeholder={JSON.stringify({ name: "Creator Toolkit", features: ["tools", "api"], count: 150 }, null, 2)} />
      {error && input && <p className="text-sm text-red-500">Error: {error}</p>}
      <OutputArea value={output} label="YAML output" filename="output.yaml" rows={12} />
    </div>
  );
}

export function HtmlToMarkdown() {
  const [html, setHtml] = useState("");

  const { output, error } = useMemo(() => {
    try {
      if (!html.trim()) return { output: "", error: null };
      const doc = new DOMParser().parseFromString(html, "text/html");
      const walk = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent ?? "").replace(/\s+/g, " ").trim();
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        const el = node as Element;
        const tag = el.tagName.toLowerCase();
        const children = [...el.childNodes].map(walk).filter(Boolean).join(" ");
        switch (tag) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
            return `\n\n${"#".repeat(Number(tag[1]))} ${children}\n`;
          case "p":
            return `\n\n${children}`;
          case "br":
            return "  \n";
          case "strong":
          case "b":
            return `**${children}**`;
          case "em":
          case "i":
            return `*${children}*`;
          case "code":
            return `\`${children}\``;
          case "a":
            return `[${children}](${el.getAttribute("href") ?? ""})`;
          case "li": {
            const parent = el.parentElement?.tagName.toLowerCase();
            const bullet = parent === "ol" ? "1." : "-";
            return `\n${bullet} ${children}`;
          }
          case "ul":
          case "ol":
            return `\n${children}`;
          case "blockquote":
            return `\n\n> ${children}\n`;
          case "img":
            return `![${el.getAttribute("alt") ?? ""}](${el.getAttribute("src") ?? ""})`;
          case "pre":
            return `\n\n\`\`\`\n${el.textContent ?? ""}\n\`\`\`\n`;
          default:
            return children;
        }
      };
      return { output: walk(doc.body).replace(/\n{3,}/g, "\n\n").trim(), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Failed to parse HTML" };
    }
  }, [html]);

  return (
    <div className="space-y-6">
      <Textarea label="HTML" value={html} onChange={(e) => setHtml(e.target.value)} rows={8} className="font-mono" placeholder={"<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>"} />
      {error && html && <p className="text-sm text-red-500">Error: {error}</p>}
      <OutputArea value={output} label="Markdown output" filename="output.md" rows={10} />
    </div>
  );
}

const ESCAPED: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
};

export function HtmlEntityEncoder() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = useMemo(() => {
    if (mode === "encode") return text.replace(/[<>&"']/g, (c) => ESCAPED[c]);
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'");
  }, [text, mode]);

  return (
    <div className="space-y-6">
      <Textarea label={mode === "encode" ? "Plain text" : "HTML entities"} value={text} onChange={(e) => setText(e.target.value)} rows={6} className="font-mono" />
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "encode" ? "primary" : "secondary"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "primary" : "secondary"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <OutputArea value={output} label="Result" filename="encoded.txt" rows={6} />
    </div>
  );
}

export function RegexEscape() {
  const [text, setText] = useState("");

  const output = useMemo(() => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), [text]);

  return (
    <div className="space-y-6">
      <Textarea label="Literal text" value={text} onChange={(e) => setText(e.target.value)} rows={5} className="font-mono" placeholder="e.g. 2.50 (USD) [2026]" />
      <OutputArea value={output} label="Escaped pattern" filename="regex-pattern.txt" rows={5} />
    </div>
  );
}

export function Sha256HashGenerator() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);

  async function compute() {
    setBusy(true);
    try {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", data);
      setHash([...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join(""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Textarea label="Input" value={text} onChange={(e) => setText(e.target.value)} rows={4} className="font-mono" />
      <Button onClick={compute} disabled={busy}>{busy ? "Hashing…" : "Compute SHA-256"}</Button>
      <OutputArea value={hash} label="SHA-256 hash" filename="sha256.txt" rows={4} />
    </div>
  );
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState("");

  function generate() {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.max(1, Math.min(1000, count));
    const arr = new Uint32Array(n);
    crypto.getRandomValues(arr);
    const range = hi - lo + 1;
    const list = [...arr].map((v) => (v % range) + lo);
    setOutput(list.join(", "));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Min">
          <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value) || 0)} className={INPUT_CLS} />
        </Field>
        <Field label="Max">
          <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value) || 0)} className={INPUT_CLS} />
        </Field>
        <Field label="Count (1–1000)">
          <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} className={INPUT_CLS} />
        </Field>
      </div>
      <Button onClick={generate}>Generate</Button>
      <OutputArea value={output} label="Random numbers" filename="random-numbers.txt" rows={4} />
    </div>
  );
}

function scorePassword(password: string): { score: number; label: string; checks: string[] } {
  const checks: string[] = [];
  let score = 0;
  if (password.length >= 8) {
    score += 2;
    checks.push("At least 8 characters");
  } else {
    checks.push("Add at least 8 characters");
  }
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 2;
    checks.push("Mix of upper and lowercase");
  } else {
    checks.push("Mix upper and lowercase");
  }
  if (/\d/.test(password)) {
    score += 1;
    checks.push("Includes numbers");
  } else {
    checks.push("Add numbers");
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 2;
    checks.push("Includes symbols");
  } else {
    checks.push("Add symbols (!@#$%^&*)");
  }
  if (!/(.)\1{3}/.test(password)) {
    score += 1;
    checks.push("No long repeated characters");
  } else {
    checks.push("Avoid repeated characters");
  }
  score = Math.min(10, score);
  const label = score >= 8 ? "Strong" : score >= 5 ? "Medium" : score >= 3 ? "Weak" : "Very weak";
  return { score, label, checks };
}

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const result = useMemo(() => (password ? scorePassword(password) : null), [password]);

  const color = result
    ? result.score >= 8
      ? "bg-emerald-500"
      : result.score >= 5
        ? "bg-amber-500"
        : "bg-red-500"
    : "bg-zinc-200";

  return (
    <div className="space-y-6">
      <Field label="Password">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to score it"
          className={INPUT_CLS}
        />
      </Field>
      {result && (
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tabular-nums">{result.score}/10</span>
            <span className="text-sm font-medium">{result.label}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${result.score * 10}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
            {result.checks.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function lineDiff(a: string, b: string) {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const n = linesA.length;
  const m = linesB.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: { type: "same" | "removed" | "added"; text: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      rows.push({ type: "same", text: linesA[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "removed", text: linesA[i] });
      i++;
    } else {
      rows.push({ type: "added", text: linesB[j] });
      j++;
    }
  }
  while (i < n) {
    rows.push({ type: "removed", text: linesA[i] });
    i++;
  }
  while (j < m) {
    rows.push({ type: "added", text: linesB[j] });
    j++;
  }
  return rows;
}

export function TextDiff() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");

  const rows = useMemo(() => lineDiff(oldText, newText), [oldText, newText]);
  const additions = rows.filter((r) => r.type === "added").length;
  const removals = rows.filter((r) => r.type === "removed").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Textarea label="Original" value={oldText} onChange={(e) => setOldText(e.target.value)} rows={8} className="font-mono" />
        <Textarea label="New" value={newText} onChange={(e) => setNewText(e.target.value)} rows={8} className="font-mono" />
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{additions}</span> additions ·{" "}
        <span className="font-semibold text-red-600 dark:text-red-400">-{removals}</span> removals
      </p>
      <div className="max-h-96 overflow-auto rounded-lg border border-zinc-200 font-mono text-sm dark:border-zinc-800">
        {rows.map((r, i) => (
          <pre
            key={i}
            className={cn(
              "whitespace-pre-wrap px-3 py-0.5 leading-6",
              r.type === "added" && "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
              r.type === "removed" && "bg-red-50 text-red-800 line-through dark:bg-red-500/10 dark:text-red-300",
              r.type === "same" && "text-zinc-700 dark:text-zinc-300"
            )}
          >
            {r.text === "" ? " " : r.text}
          </pre>
        ))}
      </div>
    </div>
  );
}
