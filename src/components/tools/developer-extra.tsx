"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  OptionRow,
  Stat,
  StatGrid,
  TextInput,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";
import { jsonError } from "@/lib/format";

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return typeof value;
}

function jsonDepth(value: unknown): number {
  if (value === null || typeof value !== "object") return 0;
  const entries = Array.isArray(value) ? value : Object.values(value);
  if (entries.length === 0) return 1;
  return 1 + Math.max(...entries.map((v) => jsonDepth(v)));
}

function countKeys(value: unknown): number {
  if (value === null || typeof value !== "object") return 0;
  if (Array.isArray(value)) {
    return value.reduce((acc, v) => acc + countKeys(v), 0);
  }
  const entries = Object.entries(value as Record<string, unknown>);
  return entries.length + entries.reduce((acc, [, v]) => acc + countKeys(v), 0);
}

function errorPosition(message: string): { line: number; col: number } | null {
  const m = message.match(/position (\d+)/);
  if (!m) return null;
  return { line: 0, col: Number(m[1]) };
}

export function JsonValidator() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const error = jsonError(text);
    if (error) {
      return { ok: false, error, parsed: null };
    }
    const parsed = JSON.parse(text);
    return {
      ok: true,
      error: null,
      parsed,
      type: jsonType(parsed),
      depth: jsonDepth(parsed),
      keys: countKeys(parsed),
      topKeys: Array.isArray(parsed)
        ? parsed.length
        : parsed && typeof parsed === "object"
          ? Object.keys(parsed).length
          : 0,
    };
  }, [text]);

  const pos = result && !result.ok ? errorPosition(result.error ?? "") : null;

  return (
    <div className="space-y-6">
      <Textarea
        label="JSON input"
        placeholder='{"users": [{"id": 1}]}'
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <OptionRow>
        <div className="flex h-9 items-center gap-2">
          {text.trim() && result && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                result.ok
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  result.ok ? "bg-emerald-500" : "bg-red-500"
                )}
              />
              {result.ok ? "Valid JSON" : "Invalid JSON"}
            </span>
          )}
        </div>
        {result?.ok && result.parsed !== null && (
          <StatGrid className="flex-1">
            <Stat label="Root type" value={result.type} />
            <Stat label="Depth" value={result.depth} />
            <Stat label="Total keys" value={result.keys} />
            <Stat label="Top-level" value={result.topKeys} />
          </StatGrid>
        )}
      </OptionRow>

      {result && !result.ok && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <p className="font-medium">{result.error}</p>
          {pos && pos.col > 0 && (
            <p className="mt-1 text-xs opacity-80">
              Error near character {pos.col}
            </p>
          )}
        </div>
      )}

      {result?.ok && (
        <OutputArea
          value={JSON.stringify(result.parsed, null, 2)}
          label="Formatted JSON"
          filename="validated.json"
          rows={10}
        />
      )}
    </div>
  );
}

function flatten(obj: unknown, path = ""): Map<string, string> {
  const result = new Map<string, string>();
  const walk = (value: unknown, p: string) => {
    if (value === null || typeof value !== "object") {
      result.set(p || "(root)", JSON.stringify(value));
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        result.set(p || "(root)", "[]");
        return;
      }
      value.forEach((v, i) => walk(v, `${p}[${i}]`));
    } else {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        result.set(p || "(root)", "{}");
        return;
      }
      for (const [k, v] of entries) walk(v, p ? `${p}.${k}` : k);
    }
  };
  walk(obj, path);
  return result;
}

export function JsonCompare() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [ran, setRan] = useState(false);

  const report = useMemo(() => {
    if (!ran) return null;
    const errA = jsonError(a);
    const errB = jsonError(b);
    if (errA || errB) {
      return { error: errA ?? errB, onlyA: [], onlyB: [], changed: [], equal: 0 };
    }
    const flatA = flatten(JSON.parse(a));
    const flatB = flatten(JSON.parse(b));
    const onlyA: string[] = [];
    const onlyB: string[] = [];
    const changed: { path: string; a: string; b: string }[] = [];
    let equal = 0;
    for (const [k, v] of flatA) {
      if (!flatB.has(k)) onlyA.push(k);
      else if (flatB.get(k) !== v) changed.push({ path: k, a: v, b: flatB.get(k) ?? "" });
      else equal += 1;
    }
    for (const [k] of flatB) {
      if (!flatA.has(k)) onlyB.push(k);
    }
    return { error: null, onlyA, onlyB, changed, equal };
  }, [a, b, ran]);

  const output = useMemo(() => {
    if (!report) return "";
    if (report.error) return `Invalid JSON: ${report.error}`;
    const lines: string[] = [`JSON Compare Report`, ``];
    if (report.equal > 0) lines.push(`${report.equal} matching path${report.equal === 1 ? "" : "s"}`);
    if (report.onlyA.length) {
      lines.push(``, `Only in A (${report.onlyA.length}):`);
      lines.push(...report.onlyA.map((k) => `  - ${k}`));
    }
    if (report.onlyB.length) {
      lines.push(``, `Only in B (${report.onlyB.length}):`);
      lines.push(...report.onlyB.map((k) => `  + ${k}`));
    }
    if (report.changed.length) {
      lines.push(``, `Different values (${report.changed.length}):`);
      lines.push(
        ...report.changed.map(
          (c) => `  ~ ${c.path}\n      A: ${c.a}\n      B: ${c.b}`
        )
      );
    }
    if (!report.onlyA.length && !report.onlyB.length && !report.changed.length) {
      lines.push(``, "The two JSON structures are identical.");
    }
    return lines.join("\n");
  }, [report]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="JSON A">
          <Textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={10}
            placeholder={'{"name": "Ada", "age": 36}'}
          />
        </Field>
        <Field label="JSON B">
          <Textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            rows={10}
            placeholder={'{"name": "Grace", "age": 85}'}
          />
        </Field>
      </div>
      <Button onClick={() => setRan(true)} disabled={!a.trim() || !b.trim()}>
        Compare
      </Button>

      {report && report.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {report.error}
        </div>
      )}

      {report && !report.error && (
        <StatGrid>
          <Stat label="Matching paths" value={report.equal} />
          <Stat label="Only in A" value={report.onlyA.length} accent="#6366f1" />
          <Stat label="Only in B" value={report.onlyB.length} accent="#ec4899" />
          <Stat label="Changed values" value={report.changed.length} accent="#f59e0b" />
        </StatGrid>
      )}

      {report && !report.error && report.changed.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Changed values
          </h3>
          <div className="mt-3 space-y-2">
            {report.changed.map((c) => (
              <div
                key={c.path}
                className="rounded-lg border border-zinc-200 p-3 font-mono text-xs dark:border-zinc-800"
              >
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">{c.path}</div>
                <div className="mt-1 text-red-500 line-through">{c.a}</div>
                <div className="text-emerald-600 dark:text-emerald-400">{c.b}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <OutputArea value={output} label="Comparison report" filename="json-diff.txt" rows={10} />
    </div>
  );
}

interface XToken {
  type:
    | "open"
    | "close"
    | "self"
    | "comment"
    | "cdata"
    | "doctype"
    | "pi"
    | "text";
  raw: string;
  name: string;
}

function tokenizeMarkup(input: string): XToken[] {
  const tokens: XToken[] = [];
  let i = 0;
  const n = input.length;
  while (i < n) {
    if (input[i] === "<") {
      const end = input.indexOf(">", i);
      if (end === -1) {
        tokens.push({ type: "text", raw: input.slice(i), name: "" });
        break;
      }
      const inner = input.slice(i + 1, end).trim();
      const raw = input.slice(i, end + 1);
      if (inner.startsWith("!--")) {
        const cend = input.indexOf("-->", i);
        if (cend !== -1) {
          tokens.push({ type: "comment", raw: input.slice(i, cend + 3), name: "" });
          i = cend + 3;
        } else {
          tokens.push({ type: "text", raw, name: "" });
          i = end + 1;
        }
        continue;
      }
      if (inner.startsWith("![CDATA[")) {
        const cend = input.indexOf("]]>", i);
        if (cend !== -1) {
          tokens.push({ type: "cdata", raw: input.slice(i, cend + 3), name: "" });
          i = cend + 3;
        } else {
          tokens.push({ type: "text", raw, name: "" });
          i = end + 1;
        }
        continue;
      }
      if (inner.startsWith("!")) {
        tokens.push({ type: "doctype", raw, name: "" });
      } else if (inner.startsWith("?")) {
        tokens.push({ type: "pi", raw, name: "" });
      } else if (inner.startsWith("/")) {
        tokens.push({ type: "close", raw, name: inner.slice(1).trim().split(/\s+/)[0] });
      } else if (inner.endsWith("/")) {
        tokens.push({
          type: "self",
          raw,
          name: inner.slice(0, -1).trim().split(/\s+/)[0],
        });
      } else {
        tokens.push({ type: "open", raw, name: inner.split(/\s+/)[0] });
      }
      i = end + 1;
    } else {
      const next = input.indexOf("<", i);
      const textEnd = next === -1 ? n : next;
      const text = input.slice(i, textEnd);
      if (text.trim()) tokens.push({ type: "text", raw: text, name: "" });
      i = textEnd;
    }
  }
  return tokens;
}

function formatMarkup(tokens: XToken[], isHtml: boolean): { out: string; error: string | null } {
  const VOID = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);
  const lines: string[] = [];
  const stack: string[] = [];
  let depth = 0;
  const indent = () => "  ".repeat(depth);

  for (const t of tokens) {
    switch (t.type) {
      case "comment":
      case "cdata":
      case "doctype":
      case "pi":
        lines.push(indent() + t.raw);
        break;
      case "open": {
        lines.push(indent() + t.raw);
        if (!isHtml || !VOID.has(t.name.toLowerCase())) {
          stack.push(t.name);
          depth += 1;
        }
        break;
      }
      case "self":
        lines.push(indent() + t.raw);
        break;
      case "close": {
        const top = stack[stack.length - 1];
        if (top && top.toLowerCase() === t.name.toLowerCase()) {
          stack.pop();
          depth = Math.max(0, depth - 1);
          lines.push(indent() + t.raw);
        } else if (isHtml) {
          depth = Math.max(0, depth - 1);
          lines.push(indent() + t.raw);
        } else {
          return {
            out: lines.join("\n"),
            error: `Mismatched closing tag </${t.name}> (expected </${top ?? "…"}>)`,
          };
        }
        break;
      }
      case "text": {
        const text = t.raw.replace(/\s+/g, " ").trim();
        if (text) lines.push(indent() + text);
        break;
      }
    }
  }

  if (!isHtml && stack.length > 0) {
    return {
      out: lines.join("\n"),
      error: `Unclosed tag <${stack[stack.length - 1]}>`,
    };
  }
  return { out: lines.join("\n"), error: null };
}

export function XmlFormatter() {
  const [text, setText] = useState("");
  const result = useMemo(() => formatMarkup(tokenizeMarkup(text), false), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="XML input"
        placeholder={'<note>\n  <to>User</to>\n  <body>Hello</body>\n</note>'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {result.error}
        </div>
      )}
      <OutputArea value={result.out} label="Formatted XML" filename="formatted.xml" rows={12} />
    </div>
  );
}

export function HtmlFormatter() {
  const [text, setText] = useState("");
  const result = useMemo(() => formatMarkup(tokenizeMarkup(text), true), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="HTML input"
        placeholder={"<!doctype html>\n<html>\n<body>\n<p>Hello</p>\n</body>\n</html>"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <OutputArea value={result.out} label="Formatted HTML" filename="formatted.html" rows={12} />
    </div>
  );
}

function formatCSS(css: string): string {
  const lines: string[] = [];
  let depth = 0;
  let i = 0;
  const n = css.length;
  let buffer = "";
  while (i < n) {
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      const endIdx = end === -1 ? n : end + 2;
      lines.push("  ".repeat(depth) + css.slice(i, endIdx));
      i = endIdx;
      continue;
    }
    const c = css[i];
    if (c === "{") {
      const trimmed = buffer.trim().replace(/\s+/g, " ");
      lines.push("  ".repeat(depth) + trimmed + " {");
      depth += 1;
      buffer = "";
      i += 1;
      continue;
    }
    if (c === "}") {
      if (buffer.trim()) {
        lines.push("  ".repeat(depth) + buffer.trim().replace(/\s+/g, " ") + ";");
        buffer = "";
      }
      depth = Math.max(0, depth - 1);
      lines.push("  ".repeat(depth) + "}");
      i += 1;
      continue;
    }
    if (c === ";") {
      lines.push("  ".repeat(depth) + buffer.trim().replace(/\s+/g, " ") + ";");
      buffer = "";
      i += 1;
      continue;
    }
    buffer += c;
    i += 1;
  }
  if (buffer.trim()) lines.push(buffer.trim().replace(/\s+/g, " "));
  return lines.join("\n");
}

export function CssBeautifier() {
  const [text, setText] = useState("");
  const output = useMemo(() => formatCSS(text), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="CSS input"
        placeholder={".card{color:#333;margin:0 auto;padding:1rem}"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <OutputArea value={output} label="Formatted CSS" filename="beautified.css" rows={12} />
    </div>
  );
}

const SQL_TOP = new Set([
  "select", "from", "where", "group by", "order by", "having", "limit",
  "offset", "union", "insert into", "values", "update", "set", "delete from",
  "case", "end",
]);
const SQL_SUB = new Set([
  "and", "or", "on", "join", "inner join", "left join", "right join",
  "full join", "when",
]);

function formatSQL(sql: string, upper: boolean): string {
  const tokens = sql.match(/[\w$]+|'[^']*'(?:'[^']*')*|"[^"]*"|`[^`]*`|\s+|./g) ?? [];
  const out: string[] = [];
  let line = "";
  let depth = 0;
  let i = 0;
  const kw = (w: string) => (upper ? w.toUpperCase() : w);

  const flush = () => {
    if (line.trim()) out.push("  ".repeat(depth) + line.trim().replace(/\s+/g, " "));
    line = "";
  };

  while (i < tokens.length) {
    const t = tokens[i];
    if (/^\s+$/.test(t)) {
      i += 1;
      continue;
    }
    const low = t.toLowerCase();
    const peek = () => {
      let j = i + 1;
      while (j < tokens.length && /^\s+$/.test(tokens[j])) j += 1;
      return j < tokens.length ? tokens[j].toLowerCase() : "";
    };
    let clause = "";
    if ((low === "order" || low === "group") && peek() === "by") {
      clause = `${low} by`;
      i += 1;
    } else if (low === "insert" && peek() === "into") {
      clause = "insert into";
      i += 1;
    } else if (low === "delete" && peek() === "from") {
      clause = "delete from";
      i += 1;
    } else if (
      (low === "inner" || low === "left" || low === "right" || low === "full") &&
      peek() === "join"
    ) {
      clause = `${low} join`;
      i += 1;
    } else if (SQL_TOP.has(low)) {
      clause = low;
    } else if (SQL_SUB.has(low)) {
      clause = low;
    }

    if (clause) {
      flush();
      if (SQL_SUB.has(clause)) {
        depth = 1;
        line = kw(clause);
      } else {
        depth = 0;
        line = kw(clause);
      }
    } else {
      line += (line ? " " : "") + t;
    }
    i += 1;
  }
  flush();
  return out.join("\n");
}

export function SqlFormatter() {
  const [text, setText] = useState("");
  const [uppercase, setUppercase] = useState(true);

  const output = useMemo(() => formatSQL(text, uppercase), [text, uppercase]);

  return (
    <div className="space-y-6">
      <Textarea
        label="SQL input"
        placeholder={"select u.id,u.name from users u where u.active=true order by u.name asc"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={uppercase}
          onChange={(e) => setUppercase(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Uppercase keywords
      </label>
      <OutputArea value={output} label="Formatted SQL" filename="formatted.sql" rows={12} />
    </div>
  );
}

interface RegexMatch {
  full: string;
  index: number;
  groups: string[];
}

function runRegex(pattern: string, flags: string, text: string): {
  matches: RegexMatch[];
  error: string | null;
} {
  if (!pattern) return { matches: [], error: null };
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const matches: RegexMatch[] = [];
    for (const m of text.matchAll(re)) {
      matches.push({
        full: m[0],
        index: m.index ?? 0,
        groups: Array.from(m).slice(1),
      });
    }
    return { matches, error: null };
  } catch (err) {
    return { matches: [], error: err instanceof Error ? err.message : "Invalid regex" };
  }
}

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [test, setTest] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { matches, error } = useMemo(
    () => runRegex(pattern, flagString, test),
    [pattern, flagString, test]
  );

  const segments = useMemo(() => {
    if (error || !pattern) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index > last) parts.push({ text: test.slice(last, m.index), match: false });
      parts.push({ text: m.full, match: true });
      last = m.index + m.full.length;
    }
    if (last < test.length) parts.push({ text: test.slice(last), match: false });
    return parts;
  }, [test, matches, error, pattern]);

  const output = matches.map((m) => m.full).join("\n");
  const details = matches
    .map((m, i) => {
      const groups =
        m.groups.length > 1
          ? ` · groups: ${m.groups.map((g) => g ?? "(none)").join(", ")}`
          : "";
      return `${i + 1}. ${m.full} @ ${m.index}${groups}`;
    })
    .join("\n");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Pattern" className="min-w-48 flex-1">
          <TextInput
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \\d{3}-\\d{4}"
            className="font-mono"
          />
        </Field>
        <div className="flex h-9 flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          {(["g", "i", "m", "s"] as const).map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={flags[f]}
                onChange={(e) => setFlags((prev) => ({ ...prev, [f]: e.target.checked }))}
                className="h-4 w-4 rounded border-zinc-300 text-violet-600"
              />
              {f}
            </label>
          ))}
        </div>
      </OptionRow>

      <Textarea
        label="Test string"
        placeholder="Paste the text to search…"
        value={test}
        onChange={(e) => setTest(e.target.value)}
        rows={6}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <StatGrid>
        <Stat label="Matches" value={matches.length} accent="#6366f1" />
        <Stat label="Pattern length" value={pattern.length} />
      </StatGrid>

      {segments && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Matches highlighted
          </h3>
          <div className="mt-3 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm leading-6 dark:border-zinc-800 dark:bg-zinc-950">
            {segments.length === 0 ? (
              <span className="text-zinc-400">No matches.</span>
            ) : (
              segments.map((seg, i) =>
                seg.match ? (
                  <mark
                    key={i}
                    className="rounded bg-violet-200 px-0.5 text-zinc-900 dark:bg-violet-500/40 dark:text-zinc-100"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i} className="text-zinc-800 dark:text-zinc-200">
                    {seg.text}
                  </span>
                )
              )
            )}
          </div>
        </Card>
      )}

      {matches.length > 0 && (
        <>
          <OutputArea
            value={output}
            label="Full matches"
            filename="matches.txt"
            rows={4}
          />
          <OutputArea
            value={details}
            label="Match details"
            filename="match-details.txt"
            rows={6}
          />
        </>
      )}
    </div>
  );
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function formatClaim(value: unknown): string {
  if (typeof value === "number" && value > 1e8) {
    try {
      return `${new Date(value * 1000).toUTCString()} (${value})`;
    } catch {
      return String(value);
    }
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) {
      return { error: "Not a JWT — expected header.payload.signature.", header: null, payload: null, claims: [] };
    }
    try {
      const headerRaw = base64UrlDecode(parts[0]);
      const payloadRaw = base64UrlDecode(parts[1]);
      const header = JSON.parse(headerRaw);
      const payload = JSON.parse(payloadRaw);
      const claims = Object.entries(payload as Record<string, unknown>).map(([k, v]) => ({
        key: k,
        value: formatClaim(v),
      }));
      return {
        error: null,
        header,
        payload,
        claims,
        signature: parts[2] ?? null,
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Could not decode JWT.",
        header: null,
        payload: null,
        claims: [],
      };
    }
  }, [token]);

  const output = result?.payload
    ? `HEADER:\n${JSON.stringify(result.header, null, 2)}\n\nPAYLOAD:\n${JSON.stringify(result.payload, null, 2)}`
    : "";

  return (
    <div className="space-y-6">
      <Textarea
        label="JWT token"
        placeholder="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={4}
        className="break-all text-xs"
      />
      {result?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {result.error}
        </div>
      )}

      {result?.payload && (
        <>
          {result.signature ? (
            <Stat label="Signature" value={`present (${result.signature.length} chars)`} accent="#10b981" />
          ) : (
            <Stat label="Signature" value="missing" accent="#f59e0b" />
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Header</h3>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs leading-5 text-emerald-400 dark:bg-black/40">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Payload claims</h3>
              <div className="mt-2 space-y-2">
                {result.claims.map((c) => (
                  <div key={c.key} className="text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{c.key}</span>
                    <span className="block break-all text-zinc-500 dark:text-zinc-400">{c.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <OutputArea value={output} label="Decoded token" filename="decoded-jwt.txt" rows={10} />
        </>
      )}
    </div>
  );
}
