"use client";

import { useMemo, useState } from "react";
import {
  Field,
  OptionRow,
  Select,
  TextInput,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { base64Decode, base64Encode, minifyJSON } from "@/lib/format";
import { cn } from "@/lib/utils";

export function JsonFormatter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!text.trim()) return { ok: true, output: "", error: null };
    try {
      const parsed = JSON.parse(text);
      const output =
        mode === "format"
          ? JSON.stringify(parsed, null, indent)
          : minifyJSON(text);
      return { ok: true, output, error: null };
    } catch (err) {
      return {
        ok: false,
        output: "",
        error: err instanceof Error ? err.message : "Invalid JSON",
      };
    }
  }, [text, mode, indent]);

  return (
    <div className="space-y-6">
      <Textarea
        label="JSON input"
        placeholder='{"hello": "world", "tools": 300}'
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <OptionRow>
        <Field label="Mode">
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value as "format" | "minify")}
          >
            <option value="format">Format (pretty print)</option>
            <option value="minify">Minify (compact)</option>
          </Select>
        </Field>
        {mode === "format" && (
          <Field label="Indent">
            <Select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
              <option value={0}>Tab</option>
            </Select>
          </Field>
        )}
        <div className="flex h-9 items-center gap-2">
          {text.trim() && (
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
      </OptionRow>

      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {result.error}
        </div>
      )}

      <OutputArea value={result.output} filename="formatted.json" rows={10} />
    </div>
  );
}

export function Base64Encoder() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (!text) return { ok: true, output: "", error: null };
    try {
      const output =
        direction === "encode" ? base64Encode(text) : base64Decode(text);
      return { ok: true, output, error: null };
    } catch {
      return {
        ok: false,
        output: "",
        error:
          direction === "decode"
            ? "Invalid Base64 string — check your input."
            : "Unable to encode input.",
      };
    }
  }, [text, direction]);

  return (
    <div className="space-y-6">
      <Field label={direction === "encode" ? "Plain text" : "Base64 input"}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={
            direction === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"
          }
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={direction === "encode" ? "primary" : "secondary"}
          onClick={() => setDirection("encode")}
        >
          Encode
        </Button>
        <Button
          variant={direction === "decode" ? "primary" : "secondary"}
          onClick={() => setDirection("decode")}
        >
          Decode
        </Button>
      </div>
      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {result.error}
        </div>
      )}
      <OutputArea value={result.output} filename="base64.txt" rows={8} />
    </div>
  );
}

export function UrlEncoder() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (!text) return { ok: true, output: "", error: null };
    try {
      const output =
        direction === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
      return { ok: true, output, error: null };
    } catch {
      return {
        ok: false,
        output: "",
        error: "Invalid input — could not decode.",
      };
    }
  }, [text, direction]);

  return (
    <div className="space-y-6">
      <Field label={direction === "encode" ? "URL / text" : "Encoded string"}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={
            direction === "encode"
              ? "https://example.com/search?q=creator tools&page=1"
              : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcreator%20tools"
          }
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={direction === "encode" ? "primary" : "secondary"}
          onClick={() => setDirection("encode")}
        >
          Encode
        </Button>
        <Button
          variant={direction === "decode" ? "primary" : "secondary"}
          onClick={() => setDirection("decode")}
        >
          Decode
        </Button>
      </div>
      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {result.error}
        </div>
      )}
      <OutputArea value={result.output} filename="url.txt" rows={6} />
    </div>
  );
}

function hex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

function uuidv7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const ts = Date.now();
  bytes[0] = (ts / 2 ** 40) & 0xff;
  bytes[1] = (ts / 2 ** 32) & 0xff;
  bytes[2] = (ts / 2 ** 24) & 0xff;
  bytes[3] = (ts / 2 ** 16) & 0xff;
  bytes[4] = (ts / 2 ** 8) & 0xff;
  bytes[5] = ts & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = hex(bytes);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(
    16,
    20
  )}-${h.slice(20)}`;
}

export function UuidGenerator() {
  const [count, setCount] = useState(10);
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [uppercase, setUppercase] = useState(false);
  const [compact, setCompact] = useState(false);
  const [braces, setBraces] = useState(false);
  const [output, setOutput] = useState("");

  function format(uuid: string): string {
    let out = uuid;
    if (compact) out = out.replace(/-/g, "");
    if (braces) out = `{${out}}`;
    if (uppercase) out = out.toUpperCase();
    return out;
  }

  function generate() {
    const n = Math.max(1, Math.min(100, count));
    const list = Array.from({ length: n }, () =>
      format(version === "v4" ? crypto.randomUUID() : uuidv7())
    );
    setOutput(list.join("\n"));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Count (1–100)">
          <TextInput
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-24"
          />
        </Field>
        <Field label="Version">
          <Select value={version} onChange={(e) => setVersion(e.target.value as "v4" | "v7")}>
            <option value="v4">UUID v4 (random)</option>
            <option value="v7">UUID v7 (time-based)</option>
          </Select>
        </Field>
        <Button onClick={generate}>Generate</Button>
      </OptionRow>
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Uppercase
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          No hyphens
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-violet-600" />
          Braces {`{ }`}
        </label>
      </div>
      <OutputArea
        value={output}
        onChange={setOutput}
        label="Generated UUIDs"
        filename="uuids.txt"
        rows={10}
      />
    </div>
  );
}
