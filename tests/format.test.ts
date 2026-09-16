import { describe, expect, it } from "vitest";
import { convertCase } from "@/lib/case";
import { base64Decode, base64Encode, formatJSON, jsonError, minifyJSON, urlDecode, urlEncode } from "@/lib/format";
import { slugify } from "@/lib/utils";

describe("case converter", () => {
  it("converts between cases", () => {
    expect(convertCase("hello world", "upper")).toBe("HELLO WORLD");
    expect(convertCase("Hello World", "snake")).toBe("hello_world");
    expect(convertCase("hello world", "camel")).toBe("helloWorld");
    expect(convertCase("hello world", "pascal")).toBe("HelloWorld");
    expect(convertCase("hello world", "kebab")).toBe("hello-world");
  });

  it("handles empty input", () => {
    expect(convertCase("", "title")).toBe("");
  });
});

describe("json helpers", () => {
  const json = '{"a":1,"b":[1,2]}';

  it("formats JSON with indentation", () => {
    expect(formatJSON(json, 2)).toContain('\n  "a": 1');
  });

  it("minifies JSON", () => {
    expect(minifyJSON('{ "a" : 1 }')).toBe('{"a":1}');
  });

  it("reports invalid JSON", () => {
    expect(jsonError("{bad")).not.toBeNull();
    expect(jsonError('{"ok":1}')).toBeNull();
  });
});

describe("base64 helpers", () => {
  it("round trips text", () => {
    const text = "Hello, 世界!";
    expect(base64Decode(base64Encode(text))).toBe(text);
  });
});

describe("url encoding helpers", () => {
  it("encodes and decodes", () => {
    expect(urlEncode("a b&c")).toBe("a%20b%26c");
    expect(urlDecode("a%20b%26c")).toBe("a b&c");
  });
});

describe("slugify", () => {
  it("creates url-safe slugs", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
    expect(slugify("---Already---A---Slug---")).toBe("already-a-slug");
  });
});