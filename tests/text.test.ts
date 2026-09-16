import { describe, expect, it } from "vitest";
import {
  analyzeText,
  countSyllables,
  extractEmails,
  extractNumbers,
  extractUrls,
  keywordFrequency,
  readingLevelLabel,
  splitLines,
  splitParagraphs,
  splitSentences,
} from "@/lib/text";

describe("text helpers", () => {
  it("analyzes character and word counts", () => {
    const stats = analyzeText("Hello world! This is a test.");
    expect(stats.characters).toBe(27);
    expect(stats.charactersNoSpaces).toBe(22);
    expect(stats.words).toBe(6);
    expect(stats.sentences).toBe(2);
    expect(stats.paragraphs).toBe(1);
    expect(stats.uniqueWords).toBe(6);
  });

  it("counts empty text", () => {
    const stats = analyzeText("");
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.lines).toBe(0);
  });

  it("splits paragraphs on blank lines", () => {
    expect(splitParagraphs("One\n\ntwo\n\nthree")).toEqual(["One", "two", "three"]);
  });

  it("splits sentences", () => {
    const sentences = splitSentences("First sentence. Second! Third?");
    expect(sentences.length).toBe(3);
  });

  it("splits lines", () => {
    expect(splitLines("a\nb\nc")).toEqual(["a", "b", "c"]);
  });
});

describe("syllables", () => {
  it("counts common words", () => {
    expect(countSyllables("hello")).toBe(2);
    expect(countSyllables("world")).toBe(1);
    expect(countSyllables("amazing")).toBe(3);
    expect(countSyllables("")).toBe(0);
  });
});

describe("reading level labels", () => {
  it("maps scores to labels", () => {
    expect(readingLevelLabel(95)).toBe("Very Easy");
    expect(readingLevelLabel(65)).toBe("Standard");
    expect(readingLevelLabel(10)).toBe("Very Confusing");
  });
});

describe("extractors", () => {
  it("extracts URLs", () => {
    const urls = extractUrls("Visit https://example.com and www.foo.org now!");
    expect(urls).toContain("https://example.com");
    expect(urls).toContain("www.foo.org");
  });

  it("extracts emails", () => {
    const emails = extractEmails("Contact a@b.com or c.d@example.co.uk today");
    expect(emails).toEqual(["a@b.com", "c.d@example.co.uk"]);
  });

  it("extracts numbers", () => {
    expect(extractNumbers("42 apples, -7, 3.14")).toEqual(["42", "-7", "3.14"]);
  });
});

describe("keyword frequency", () => {
  it("filters stopwords and sorts by count", () => {
    const freq = keywordFrequency("the cat and the dog and the bird", 10);
    expect(freq[0].word).toBe("the");
    expect(freq[0].count).toBe(3);
  });
});