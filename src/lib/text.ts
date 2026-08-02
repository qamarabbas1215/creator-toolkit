export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  uniqueWords: number;
  longWords: number;
  syllables: number;
  averageWordLength: number;
  averageWordsPerSentence: number;
  readingEase: number;
  gradeLevel: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function splitWords(text: string): string[] {
  return text.match(/[A-Za-z0-9'’-]+/g) ?? [];
}

export function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?…]+[.!?…]*[\s]*/g) ?? [];
  return matches.map((s) => s.trim()).filter(Boolean);
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function splitLines(text: string): string[] {
  return text.split("\n");
}

export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  const vowelGroups = clean.match(/[aeiouy]+/g) ?? [];
  let count = vowelGroups.length;
  if (
    clean.endsWith("e") &&
    !clean.endsWith("le") &&
    !clean.endsWith("ed") &&
    count > 1
  ) {
    count -= 1;
  }
  return Math.max(1, count);
}

export function readingEaseScore(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 0;
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

export function gradeLevelScore(
  words: number,
  sentences: number,
  syllables: number
): number {
  if (words === 0 || sentences === 0) return 0;
  return 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
}

export function readingLevelLabel(score: number): string {
  if (score >= 90) return "Very Easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly Difficult";
  if (score >= 30) return "Difficult";
  return "Very Confusing";
}

export function analyzeText(text: string): TextStats {
  const words = splitWords(text);
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);
  const lines = splitLines(text);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const totalWordLength = words.reduce((acc, w) => acc + w.length, 0);
  const longWords = words.filter((w) => w.length > 6).length;
  const averageWordLength = words.length ? totalWordLength / words.length : 0;
  const averageWordsPerSentence = sentences.length
    ? words.length / sentences.length
    : 0;
  return {
    characters,
    charactersNoSpaces,
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines: text ? lines.length : 0,
    uniqueWords,
    longWords,
    syllables,
    averageWordLength,
    averageWordsPerSentence,
    readingEase: readingEaseScore(words.length, sentences.length, syllables),
    gradeLevel: gradeLevelScore(words.length, sentences.length, syllables),
    readingTimeMinutes: readingTimeMinutes(words.length),
    speakingTimeMinutes: speakingTimeMinutes(words.length),
  };
}

export function readingTimeMinutes(words: number, wpm = 200): number {
  return words / wpm;
}

export function speakingTimeMinutes(words: number, wpm = 130): number {
  return words / wpm;
}

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
  "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was",
  "were", "will", "with", "i", "you", "your", "we", "our", "they", "their",
  "this", "these", "those", "but", "not", "or", "so", "if", "then", "than",
  "too", "very", "can", "just", "have", "had", "do", "does", "did", "been",
  "am", "what", "which", "who", "whom", "when", "where", "how", "all", "any",
  "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "only", "own", "same", "s", "t", "don", "now", "get", "go", "make", "like",
  "one", "would", "could", "should", "may", "might", "must", "about", "into",
  "over", "up", "down", "out", "off", "again", "there", "here", "because",
  "until", "while", "above", "below", "between", "after", "before", "during",
]);

export function keywordFrequency(
  text: string,
  limit = 30
): { word: string; count: number }[] {
  const words = splitWords(text)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function extractUrls(text: string): string[] {
  const matches =
    text.match(
      /(?:https?:\/\/|www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s"'<>]*)?/g
    ) ?? [];
  return [...new Set(matches)];
}

export function extractEmails(text: string): string[] {
  const matches =
    text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?/g
    ) ?? [];
  return [...new Set(matches)];
}

export function extractNumbers(text: string): string[] {
  const matches = text.match(/-?\d+(?:[.,]\d+)?/g) ?? [];
  return matches;
}
