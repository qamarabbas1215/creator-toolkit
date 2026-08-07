import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import {
  analyzeText,
  countSyllables,
  extractEmails,
  extractUrls,
  keywordFrequency,
  readingLevelLabel,
  splitLines,
  splitWords,
} from "@/lib/text";
import {
  base64Decode,
  base64Encode,
  formatJSON,
  jsonError,
  minifyJSON,
  urlDecode,
  urlEncode,
} from "@/lib/format";
import { convertCase } from "@/lib/case";
import { slugify } from "@/lib/utils";

export type ToolHandler = (params: Record<string, unknown>) => unknown;

export const apiToolHandlers: Record<string, ToolHandler> = {};

function getString(params: Record<string, unknown>, key: string, fallback = ""): string {
  const v = params[key];
  return typeof v === "string" ? v : fallback;
}

function getNumber(params: Record<string, unknown>, key: string, fallback: number): number {
  const v = params[key];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function requireString(params: Record<string, unknown>, key: string, label: string): string {
  const v = getString(params, key);
  if (!v) throw new Error(`${label} is required.`);
  return v;
}

export function registerHandler(slug: string, handler: ToolHandler): void {
  apiToolHandlers[slug] = handler;
}

registerHandler("json-formatter", (p) => {
  const input = requireString(p, "input", "input");
  const indent = Math.max(0, Math.min(8, Math.round(getNumber(p, "indent", 2))));
  return formatJSON(input, indent);
});

registerHandler("json-minify", (p) => {
  const input = requireString(p, "input", "input");
  return minifyJSON(input);
});

registerHandler("json-validator", (p) => {
  const input = requireString(p, "input", "input");
  const error = jsonError(input);
  if (error) return { valid: false, error };
  return { valid: true };
});

registerHandler("base64-encoder", (p) => {
  const input = requireString(p, "input", "input");
  const mode = getString(p, "mode", "encode");
  if (mode === "decode") return base64Decode(input);
  return base64Encode(input);
});

registerHandler("url-encoder", (p) => {
  const input = requireString(p, "input", "input");
  const mode = getString(p, "mode", "encode");
  if (mode === "decode") return urlDecode(input);
  return urlEncode(input);
});

registerHandler("case-converter", (p) => {
  const input = requireString(p, "input", "input");
  const type = getString(p, "case", "lower");
  const valid: string[] = [
    "upper", "lower", "title", "sentence", "camel", "pascal", "snake", "kebab", "alternating", "reverse", "inverse",
  ];
  if (!valid.includes(type)) throw new Error(`Unsupported case type: ${type}`);
  return convertCase(input, type as Parameters<typeof convertCase>[1]);
});

registerHandler("slug-generator", (p) => {
  const input = requireString(p, "input", "input");
  return slugify(input);
});

registerHandler("uuid-generator", (p) => {
  const count = Math.max(1, Math.min(100, Math.round(getNumber(p, "count", 1))));
  return Array.from({ length: count }, () => randomUUID());
});

registerHandler("word-counter", (p) => {
  const input = requireString(p, "input", "input");
  return analyzeText(input);
});

registerHandler("character-counter", (p) => {
  const input = requireString(p, "input", "input");
  return analyzeText(input);
});

registerHandler("sha256-generator", (p) => {
  const input = requireString(p, "input", "input");
  return createHash("sha256").update(input).digest("hex");
});

registerHandler("reverse-text", (p) => {
  const input = requireString(p, "input", "input");
  return [...input].reverse().join("");
});

registerHandler("remove-duplicate-lines", (p) => {
  const input = requireString(p, "input", "input");
  return [...new Set(splitLines(input).map((l) => l.trimEnd()))].join("\n");
});

registerHandler("remove-empty-lines", (p) => {
  const input = requireString(p, "input", "input");
  return splitLines(input).filter((l) => l.trim() !== "").join("\n");
});

registerHandler("line-sorter", (p) => {
  const input = requireString(p, "input", "input");
  const order = getString(p, "order", "asc");
  const lines = splitLines(input);
  lines.sort((a, b) => (order === "desc" ? b.localeCompare(a) : a.localeCompare(b)));
  return lines.join("\n");
});

registerHandler("extract-urls", (p) => {
  const input = requireString(p, "input", "input");
  return extractUrls(input);
});

registerHandler("extract-emails", (p) => {
  const input = requireString(p, "input", "input");
  return extractEmails(input);
});

registerHandler("number-to-words", (p) => {
  const n = getNumber(p, "number", Number.NaN);
  if (!Number.isInteger(n) || n < 0 || n > 999_999_999_999) {
    throw new Error("number must be a whole number between 0 and 999,999,999,999.");
  }
  return numberToWords(n);
});

registerHandler("regex-escape", (p) => {
  const input = requireString(p, "input", "input");
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
});

registerHandler("html-entity-encoder", (p) => {
  const input = requireString(p, "input", "input");
  const mode = getString(p, "mode", "encode");
  if (mode === "decode") {
    return input
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'");
  }
  return input.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" };
    return map[c];
  });
});

const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

registerHandler("lorem-ipsum-generator", (p) => {
  const paragraphs = Math.max(1, Math.min(20, Math.round(getNumber(p, "paragraphs", 3))));
  const sentences = Math.max(1, Math.min(12, Math.round(getNumber(p, "sentences", 4))));
  const lines = Array.from({ length: paragraphs }, (_, pi) => {
    const words = Array.from(
      { length: sentences },
      (_, si) => LOREM_WORDS[(pi * 7919 + si * 104729) % LOREM_WORDS.length]
    ).join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1) + ".";
  });
  return lines.join("\n\n");
});

registerHandler("password-generator", (p) => {
  const length = Math.max(4, Math.min(128, Math.round(getNumber(p, "length", 16))));
  const count = Math.max(1, Math.min(50, Math.round(getNumber(p, "count", 1))));
  const symbols = getString(p, "symbols", "true") !== "false";
  const numbers = getString(p, "numbers", "true") !== "false";
  let pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) pool += "0123456789";
  if (symbols) pool += "!@#$%^&*()-_=+[]{};:,.<>?/";
  return Array.from({ length: count }, () => {
    const bytes = randomBytes(length);
    return [...bytes].map((b) => pool[b % pool.length]).join("");
  });
});

registerHandler("random-number-generator", (p) => {
  const min = Math.round(getNumber(p, "min", 1));
  const max = Math.round(getNumber(p, "max", 100));
  const count = Math.max(1, Math.min(1000, Math.round(getNumber(p, "count", 1))));
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Array.from({ length: count }, () => randomInt(lo, hi + 1));
});

registerHandler("readability-checker", (p) => {
  const input = requireString(p, "input", "input");
  const stats = analyzeText(input);
  const ease = stats.readingEase;
  return {
    ease: Number(ease.toFixed(1)),
    label: readingLevelLabel(ease),
    syllables: stats.syllables,
    words: stats.words,
    sentences: stats.sentences,
  };
});

registerHandler("syllable-counter", (p) => {
  const input = requireString(p, "input", "input");
  return {
    total: countSyllables(input),
    perWord: [...new Set(splitWords(input).map((w) => w.toLowerCase()))]
      .slice(0, 50)
      .map((w) => ({ word: w, syllables: countSyllables(w) })),
  };
});

registerHandler("keyword-density", (p) => {
  const input = requireString(p, "input", "input");
  return keywordFrequency(input, 20);
});

registerHandler("markdown-preview", (p) => {
  const input = requireString(p, "input", "input");
  return markdownToHtml(input);
});

registerHandler("text-diff", (p) => {
  const oldText = requireString(p, "oldText", "oldText");
  const newText = requireString(p, "newText", "newText");
  const rows = lineDiff(oldText, newText);
  return {
    additions: rows.filter((r) => r.type === "added").length,
    removals: rows.filter((r) => r.type === "removed").length,
    rows,
  };
});

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

export const API_TOOL_SLUGS = Object.keys(apiToolHandlers).sort();

export function isApiTool(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(apiToolHandlers, slug);
}
