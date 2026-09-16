import { describe, expect, it } from "vitest";
import { apiToolHandlers, isApiTool } from "@/lib/api-tools";
import { getTool, tools } from "@/data/tools";

const CLIENT_ONLY = new Set([
  // File / media processing (browser File API)
  "audio-converter",
  "video-converter",
  "image-converter",
  "file-compressor",
  "zip-compressor",
  "zip-extractor",
  "bulk-renamer",
  // PDF tools (browser pdf-lib / blob download)
  "ocr",
  "pdf-compress",
  "pdf-merge",
  "pdf-split",
  "pdf-to-word",
  "image-to-pdf",
  "word-to-pdf",
  // Local-storage / interactive tools
  "prompt-history",
  "prompt-library",
  "prompt-style-library",
  "emoji-picker",
]);

// Tools whose client code was ported but might legitimately not ship
// (verified against src/data/tools.ts registration).
const EXPORTED = tools;

describe("API tool coverage", () => {
  it("registers handlers for all deterministic tools", () => {
    const slugs = EXPORTED.map((t) => t.slug).filter((s) => !CLIENT_ONLY.has(s));
    const missing = slugs.filter((s) => !isApiTool(s));
    expect(missing).toEqual([]);
  });
});

describe("apiToolHandlers basics", () => {
  it("exposes existing base handlers", () => {
    for (const slug of ["json-formatter", "base64-encoder", "case-converter", "sha256-generator", "uuid-generator"]) {
      expect(isApiTool(slug)).toBe(true);
    }
  });

  it("runs json-formatter", () => {
    const result = apiToolHandlers["json-formatter"]({ input: '{"a":1}' });
    expect(result).toContain('"a": 1');
  });

  it("runs word-counter", () => {
    const result = apiToolHandlers["word-counter"]({ input: "one two three" });
    expect(result).toBeTruthy();
    if (result && typeof result === "object") {
      expect((result as Record<string, unknown>).words).toBe(3);
    }
  });

  it("runs base64-encoder encode", () => {
    const result = apiToolHandlers["base64-encoder"]({ input: "hello", mode: "encode" });
    expect(result).toBe("aGVsbG8=");
  });

  it("runs uuid-generator with count clamp", () => {
    const result = apiToolHandlers["uuid-generator"]({ count: 150 }) as string[];
    expect(result.length).toBe(100);
  });

  it("runs lorem-ipsum-generator", () => {
    const result = apiToolHandlers["lorem-ipsum-generator"]({ paragraphs: 2, sentences: 3 }) as string;
    expect(result.split("\n\n").length).toBe(2);
  });

  it("throws readable errors for missing required input", () => {
    expect(() => apiToolHandlers["json-formatter"]({})).toThrow(/input is required/);
  });

  it("runs text-tools port", () => {
    expect(apiToolHandlers["remove-duplicate-lines"]({ input: "a\na\nb" })).toBe("a\nb");
    expect(apiToolHandlers["reverse-text"]({ input: "abc" })).toBe("cba");
    expect(apiToolHandlers["line-sorter"]({ input: "b\na", order: "asc" })).toBe("a\nb");
  });

  it("runs a selection of extra ported handlers", () => {
    expect(apiToolHandlers["slug-generator"]({ input: "Hello World" })).toBe("hello-world");
    expect(apiToolHandlers["meta-title-generator"]({ keyword: "best shoes" })).toBeTruthy();
    expect(apiToolHandlers["hashtag-generator"]({ topic: "coffee" })).toBeTruthy();
    expect(apiToolHandlers["morse-code-converter"]({ input: "SOS" })).toBeTruthy();
    expect(apiToolHandlers["palindrome-checker"]({ input: "racecar" })).toBeTruthy();
    expect(apiToolHandlers["ai-token-calculator"]({ input: "hello world" })).toBeTruthy();
  });
});