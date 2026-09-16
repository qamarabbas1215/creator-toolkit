"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Field,
  OptionRow,
  Select,
  Stat,
  StatGrid,
  TextInput,
  Textarea,
} from "@/components/ui";
import { CopyButton } from "@/components/ui/CopyButton";
import { OutputArea } from "@/components/ui/OutputArea";
import { analyzeText, readingLevelLabel, splitSentences, splitWords } from "@/lib/text";
import { formatNumber } from "@/lib/utils";

export function TextStatistics() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  const summary = useMemo(
    () =>
      [
        `Characters: ${stats.characters}`,
        `Characters (no spaces): ${stats.charactersNoSpaces}`,
        `Words: ${stats.words}`,
        `Unique words: ${stats.uniqueWords}`,
        `Sentences: ${stats.sentences}`,
        `Paragraphs: ${stats.paragraphs}`,
        `Lines: ${stats.lines}`,
        `Long words (7+): ${stats.longWords}`,
        `Syllables: ${stats.syllables}`,
        `Average word length: ${stats.averageWordLength.toFixed(1)}`,
        `Average words per sentence: ${stats.averageWordsPerSentence.toFixed(1)}`,
        `Reading ease: ${stats.readingEase.toFixed(1)} (${readingLevelLabel(stats.readingEase)})`,
        `Grade level: ${stats.gradeLevel.toFixed(1)}`,
      ].join("\n"),
    [stats]
  );

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste or type text for a full statistical breakdown…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={summary} label="Copy all stats" />
      </div>
      <StatGrid>
        <Stat label="Characters" value={formatNumber(stats.characters)} accent="#3b82f6" />
        <Stat label="Characters (no spaces)" value={formatNumber(stats.charactersNoSpaces)} />
        <Stat label="Words" value={formatNumber(stats.words)} />
        <Stat label="Unique words" value={formatNumber(stats.uniqueWords)} />
        <Stat label="Sentences" value={formatNumber(stats.sentences)} />
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs)} />
        <Stat label="Lines" value={formatNumber(stats.lines)} />
        <Stat label="Long words (7+)" value={formatNumber(stats.longWords)} />
        <Stat label="Syllables" value={formatNumber(stats.syllables)} />
        <Stat label="Avg word length" value={stats.averageWordLength.toFixed(1)} />
        <Stat label="Avg words / sentence" value={stats.averageWordsPerSentence.toFixed(1)} />
        <Stat label="Grade level" value={stats.gradeLevel.toFixed(1)} />
      </StatGrid>
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Reading ease
            </div>
            <div className="text-xs text-zinc-500">Flesch score</div>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold tabular-nums ${
                stats.readingEase >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : stats.readingEase >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {stats.readingEase.toFixed(1)}
            </div>
            <div className="text-xs text-zinc-500">{readingLevelLabel(stats.readingEase)}</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
            style={{ width: `${Math.min(100, Math.max(0, stats.readingEase))}%` }}
          />
        </div>
      </Card>
    </div>
  );
}

const COMMON_MISTAKES: Record<string, string> = {
  teh: "the",
  recieve: "receive",
  seperate: "separate",
  occured: "occurred",
  definately: "definitely",
  untill: "until",
  wich: "which",
  becuase: "because",
  adress: "address",
  begining: "beginning",
  neccessary: "necessary",
  goverment: "government",
  freind: "friend",
  beleive: "believe",
  thier: "their",
  calender: "calendar",
  alot: "a lot",
  accomodate: "accommodate",
  publically: "publicly",
  judgement: "judgment",
  arguement: "argument",
  foriegn: "foreign",
  reciept: "receipt",
  seperated: "separated",
  tommorow: "tomorrow",
  wierd: "weird",
  "suprise": "surprise",
  "occurence": "occurrence",
};

interface GrammarIssue {
  from: string;
  to: string;
  reason: string;
}

function checkGrammar(text: string): {
  issues: GrammarIssue[];
  corrected: string;
} {
  const issues: GrammarIssue[] = [];
  let corrected = text;

  corrected = corrected.replace(/\s{2,}/g, (m) => {
    issues.push({ from: m, to: " ", reason: "Multiple spaces collapsed to one." });
    return " ";
  });

  corrected = corrected.replace(/\s+([,.;:!?])/g, (_m, p: string) => {
    issues.push({ from: ` ${p}`, to: p, reason: "No space before punctuation." });
    return p;
  });

  corrected = corrected.replace(/\b(\w+) \1\b/gi, (_m, w: string) => {
    issues.push({ from: `${w} ${w}`, to: w, reason: `Repeated word “${w}”.` });
    return w;
  });

  corrected = corrected.replace(/([.!?])\s+([a-z])/g, (m, p: string, l: string) => {
    issues.push({
      from: `${p} ${l}`,
      to: `${p} ${l.toUpperCase()}`,
      reason: "Sentence should start with a capital letter.",
    });
    return `${p} ${l.toUpperCase()}`;
  });

  for (const [wrong, right] of Object.entries(COMMON_MISTAKES)) {
    const re = new RegExp(`\\b${wrong}\\b`, "gi");
    if (re.test(corrected)) {
      corrected = corrected.replace(re, (m) =>
        m[0] === m[0].toUpperCase()
          ? right.charAt(0).toUpperCase() + right.slice(1)
          : right
      );
      issues.push({ from: wrong, to: right, reason: `“${wrong}” is commonly misspelled as “${right}”.` });
    }
  }

  return { issues, corrected };
}

export function GrammarChecker() {
  const [text, setText] = useState("");
  const result = useMemo(() => checkGrammar(text), [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste text to check for common grammar and spelling issues…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        hint="Checks for common misspellings, repeated words, spacing and capitalization."
      />
      <Card>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {result.issues.length}
          </span>{" "}
          potential issue{result.issues.length === 1 ? "" : "s"} found.
        </p>
      </Card>
      {result.issues.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Issues detected
          </h3>
          <ul className="mt-3 space-y-2">
            {result.issues.map((issue, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm dark:border-amber-500/30 dark:bg-amber-500/10"
              >
                <div>
                  <span className="font-mono text-amber-700 line-through dark:text-amber-300">
                    {issue.from}
                  </span>
                  <span className="mx-2 text-amber-400">→</span>
                  <span className="font-mono font-medium text-emerald-700 dark:text-emerald-300">
                    {issue.to}
                  </span>
                  <p className="mt-0.5 text-xs text-zinc-500">{issue.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <OutputArea
        value={result.corrected}
        label="Corrected text"
        filename="corrected.txt"
        rows={8}
      />
    </div>
  );
}

const SYNONYMS: Record<string, string[]> = {
  good: ["excellent", "outstanding", "great"],
  bad: ["poor", "unfavorable", "below par"],
  big: ["large", "massive", "enormous"],
  small: ["tiny", "compact", "minor"],
  important: ["crucial", "essential", "vital"],
  fast: ["quick", "rapid", "swift"],
  slow: ["sluggish", "gradual", "leisurely"],
  easy: ["simple", "effortless", "straightforward"],
  hard: ["challenging", "difficult", "demanding"],
  help: ["assist", "support", "aid"],
  make: ["create", "produce", "build"],
  use: ["utilize", "employ", "leverage"],
  get: ["obtain", "acquire", "gain"],
  need: ["require", "demand", "necessitate"],
  show: ["demonstrate", "illustrate", "reveal"],
  think: ["believe", "consider", "reckon"],
  start: ["begin", "initiate", "commence"],
  end: ["finish", "conclude", "wrap up"],
  also: ["additionally", "moreover", "furthermore"],
  but: ["however", "yet", "still"],
  so: ["therefore", "thus", "consequently"],
  very: ["extremely", "incredibly", "remarkably"],
  really: ["genuinely", "truly", "undeniably"],
  always: ["invariably", "constantly", "consistently"],
  sometimes: ["occasionally", "at times", "from time to time"],
};

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

function capWord(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function swapSynonyms(text: string): string {
  return text.replace(/\b[a-z]+\b/g, (w) => {
    const opts = SYNONYMS[w.toLowerCase()];
    if (!opts) return w;
    const swap = pick(opts);
    return w[0] === w[0].toUpperCase() ? capWord(swap) : swap;
  });
}

const PHRASE_ALTERS: [RegExp, string][] = [
  [/\bIt is important to note that\b/gi, "Note that"],
  [/\bIn order to\b/gi, "To"],
  [/\bDue to the fact that\b/gi, "Because"],
  [/\bAt the end of the day\b/gi, "Ultimately"],
  [/\bIn today's world\b/gi, "Today"],
  [/\bAs a matter of fact\b/gi, "In fact"],
  [/\bIt goes without saying that\b/gi, ""],
  [/\bFor the purpose of\b/gi, "For"],
  [/\bIn the event that\b/gi, "If"],
  [/\bWith regard to\b/gi, "Regarding"],
];

function restructure(text: string): string {
  let out = text;
  for (const [re, sub] of PHRASE_ALTERS) out = out.replace(re, sub);
  return out;
}

function recast(text: string): string {
  return text
    .replace(/\bYou should\b/gi, "It's worth")
    .replace(/\bI think that\b/gi, "In my view,")
    .replace(/\bThere are a lot of\b/gi, "There are plenty of")
    .replace(/\bA lot of\b/gi, "Many")
    .replace(/\bLots of\b/gi, "Plenty of")
    .replace(/\bIn order for\b/gi, "So that");
}

export function RewriteTool() {
  const [text, setText] = useState("");
  const [variations, setVariations] = useState<string[]>([]);

  function generate() {
    if (!text.trim()) return;
    const base = text.trim();
    setVariations([
      swapSynonyms(base),
      restructure(base),
      recast(base),
      restructure(swapSynonyms(base)),
    ]);
  }

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste a paragraph to rewrite…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={generate} disabled={!text.trim()}>
          Rewrite
        </Button>
        {variations.length > 0 && (
          <CopyButton text={variations.join("\n\n---\n\n")} label="Copy all variations" />
        )}
      </div>
      {variations.length > 0 && (
        <div className="space-y-3">
          {variations.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Variation {i + 1}
                </span>
                <CopyButton text={v} />
              </div>
              <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
  "isn't", "aren't", "wasn't", "weren't", "it's", "don't", "doesn't", "can't",
]);

function summarizeText(text: string, ratio: number): {
  summary: string;
  kept: number;
  total: number;
} {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return { summary: "", kept: 0, total: 0 };

  const freq = new Map<string, number>();
  for (const s of sentences) {
    for (const w of splitWords(s)) {
      const key = w.toLowerCase();
      if (key.length < 3 || STOPWORDS.has(key)) continue;
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
  }

  const scored = sentences.map((s, i) => {
    const words = splitWords(s);
    let score = 0;
    for (const w of words) {
      const key = w.toLowerCase();
      if (freq.has(key)) score += 1 / (freq.get(key) ?? 1);
    }
    return { s, i, score: words.length ? score / words.length : 0 };
  });

  const keepCount = Math.max(1, Math.round(sentences.length * ratio));
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, keepCount)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s);

  return { summary: top.join(" "), kept: top.length, total: sentences.length };
}

export function Summarizer() {
  const [text, setText] = useState("");
  const [length, setLength] = useState(0.3);

  const result = useMemo(() => summarizeText(text, length), [text, length]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste an article or paragraph to summarize…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      <OptionRow>
        <Field label="Summary length">
          <Select value={length} onChange={(e) => setLength(Number(e.target.value))}>
            <option value={0.2}>Short · 20%</option>
            <option value={0.3}>Medium · 30%</option>
            <option value={0.5}>Long · 50%</option>
          </Select>
        </Field>
        <div className="flex items-end gap-4">
          <Stat label="Kept sentences" value={`${result.kept} / ${result.total}`} />
          <Stat
            label="Original words"
            value={formatNumber(splitWords(text).length)}
          />
          <Stat label="Summary words" value={formatNumber(splitWords(result.summary).length)} />
        </div>
      </OptionRow>
      <OutputArea
        value={result.summary}
        label="Summary"
        filename="summary.txt"
        rows={8}
        placeholder="Summary appears here…"
      />
    </div>
  );
}

const CONTRACTIONS: Record<string, string> = {
  "can't": "cannot",
  "won't": "will not",
  "shan't": "shall not",
  "ain't": "am not",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "shouldn't": "should not",
  "couldn't": "could not",
  "wouldn't": "would not",
  "mustn't": "must not",
  "let's": "let us",
  "'re": " are",
  "'ll": " will",
  "'ve": " have",
  "'m": " am",
  "'d": " would",
  "'s": " is",
};

function expandContractions(text: string): string {
  let out = text;
  for (const [k, v] of Object.entries(CONTRACTIONS)) {
    out = out.replace(new RegExp(`\\b${k}`, "gi"), (m) => {
      const isUpper = /[A-Z]/.test(m[0]);
      const suffix = v;
      return `${isUpper ? suffix.charAt(0).toUpperCase() + suffix.slice(1) : suffix} `;
    });
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

const ABBREVIATIONS: Record<string, string> = {
  "e.g.": "for example",
  "i.e.": "that is",
  "etc.": "and so on",
  "vs.": "versus",
  "etc": "and so on",
  "approx.": "approximately",
  "approx": "approximately",
  "info": "information",
  "dept.": "department",
  "govt.": "government",
  "hrs": "hours",
  "mins": "minutes",
  "btw": "by the way",
  "asap": "as soon as possible",
  "imo": "in my opinion",
  "wrt": "with respect to",
  "u": "you",
  "ur": "your",
  "pls": "please",
  "thx": "thanks",
  "r": "are",
  "cuz": "because",
  "bc": "because",
};

export function ExpandText() {
  const [text, setText] = useState("");
  const [expandAbbreviations, setExpandAbbreviations] = useState(false);

  const output = useMemo(() => {
    let out = expandContractions(text);
    if (expandAbbreviations) {
      for (const [k, v] of Object.entries(ABBREVIATIONS)) {
        out = out.replace(new RegExp(`\\b${k}\\b`, "gi"), (m) =>
          m[0] === m[0].toUpperCase() ? capWord(v) : v
        );
      }
    }
    return out;
  }, [text, expandAbbreviations]);

  const before = splitWords(text).length;
  const after = splitWords(output).length;

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste text containing contractions like don't, it's, we're…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={expandAbbreviations}
          onChange={(e) => setExpandAbbreviations(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
        />
        Also expand abbreviations (e.g., info → information)
      </label>
      <StatGrid>
        <Stat label="Words before" value={before} />
        <Stat label="Words after" value={after} accent="#3b82f6" />
      </StatGrid>
      <OutputArea value={output} label="Expanded text" filename="expanded.txt" rows={8} />
    </div>
  );
}

const FILLER_WORDS = [
  "actually",
  "basically",
  "really",
  "very",
  "quite",
  "just",
  "simply",
  "literally",
  "totally",
  "absolutely",
  "definitely",
  "extremely",
  "pretty",
  "super",
  "honestly",
  "frankly",
  "obviously",
  "clearly",
];

const WORDY_PHRASES: [RegExp, string][] = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bwith the exception of\b/gi, "except"],
  [/\bin spite of the fact that\b/gi, "although"],
  [/\bthere is no doubt that\b/gi, "undoubtedly"],
  [/\ba majority of\b/gi, "most"],
  [/\bin the event that\b/gi, "if"],
  [/\bin the process of\b/gi, "during"],
  [/\bthe reason why is because\b/gi, "because"],
  [/\bhaving said that\b/gi, "however"],
  [/\bin order for\b/gi, "so"],
  [/\bas a general rule\b/gi, "generally"],
];

export function ShortenText() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    let out = text;
    let removals = 0;
    for (const [re, sub] of WORDY_PHRASES) out = out.replace(re, sub);
    for (const w of FILLER_WORDS) {
      const re = new RegExp(`\\s\\b${w}\\b\\s?`, "gi");
      out = out.replace(re, (m) => {
        removals += 1;
        return m.endsWith(" ") ? " " : " ";
      });
    }
    out = out.replace(/\s{2,}/g, " ").trim();
    return { out, removals };
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your text"
        placeholder="Paste wordy text to tighten it up…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <StatGrid>
        <Stat label="Words before" value={formatNumber(splitWords(text).length)} />
        <Stat label="Words after" value={formatNumber(splitWords(result.out).length)} accent="#3b82f6" />
        <Stat label="Chars saved" value={formatNumber(Math.max(0, text.length - result.out.length))} />
      </StatGrid>
      <OutputArea value={result.out} label="Shortened text" filename="shortened.txt" rows={8} />
    </div>
  );
}

const OUTLINE_STRUCTURES = {
  blog: {
    label: "Blog post",
    sections: (t: string) => [
      { title: "Introduction", points: [`Hook readers with a compelling question or stat about ${t}.`, `Explain why ${t} matters right now.`] },
      { title: `What Is ${capWord(t)}?`, points: [`Define ${t} in simple, clear terms.`, `Give a quick example readers can relate to.`] },
      { title: `Why ${capWord(t)} Matters`, points: [`Share 2–3 concrete benefits.`, `Add a short anecdote or data point.`] },
      { title: `How to Get Started with ${capWord(t)}`, points: [`List the essential first steps.`, `Mention tools and resources to use.`, `Add a common pitfall to avoid.`] },
      { title: "Pro Tips", points: [`Include advanced techniques.`, `Give one insider shortcut.`] },
      { title: "Conclusion", points: [`Recap the key takeaways.`, `Include a call-to-action (comment, share, subscribe).`] },
    ],
  },
  video: {
    label: "YouTube video",
    sections: (t: string) => [
      { title: "Hook (0:00–0:30)", points: [`Open with the biggest outcome of this ${t} video.`, `Promise what viewers will learn.`] },
      { title: "Intro & Context (0:30–1:00)", points: [`Introduce yourself and why you made this.`, `Briefly frame the problem around ${t}.`] },
      { title: `Core Content: ${capWord(t)} Explained`, points: [`Break ${t} into 3–5 key points.`, `Show real examples on screen.`] },
      { title: "Common Mistakes", points: [`What not to do with ${t}.`, `Quick fixes viewers can apply immediately.`] },
      { title: "Recap", points: [`Summarize the main points.`, `Reinforce the single most important takeaway.`] },
      { title: "CTA (End screen)", points: [`Ask viewers to like and subscribe.`, `Suggest the next video to watch.`] },
    ],
  },
  essay: {
    label: "Essay / article",
    sections: (t: string) => [
      { title: "Thesis statement", points: [`State the central argument about ${t}.`, `Outline the 3 supporting ideas.`] },
      { title: "Body point 1", points: [`First supporting argument with evidence.`, `Connect back to the thesis.`] },
      { title: "Body point 2", points: [`Second supporting argument with evidence.`, `Address a counterpoint briefly.`] },
      { title: "Body point 3", points: [`Third supporting argument with evidence.`, `Synthesize with points 1 and 2.`] },
      { title: "Conclusion", points: [`Restate the thesis in fresh words.`, `Leave the reader with a thought-provoking closing line.`] },
    ],
  },
  presentation: {
    label: "Presentation / pitch",
    sections: (t: string) => [
      { title: "Opening", points: [`Attention-grabbing opening statement on ${t}.`, `Set expectations for the audience.`] },
      { title: "The Problem", points: [`Define the problem ${t} solves.`, `Quantify its impact.`] },
      { title: "The Solution", points: [`Present ${t} as the answer.`, `Use 1–2 compelling examples or demos.`] },
      { title: "Key Benefits", points: [`List the top 3–5 benefits.`, `Compare with alternatives.`] },
      { title: "Call to Action", points: [`Tell the audience exactly what to do next.`, `Provide next-step details (pricing, link, contact).`] },
    ],
  },
};

export function OutlineGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<keyof typeof OUTLINE_STRUCTURES>("blog");
  const [outline, setOutline] = useState<{ title: string; points: string[] }[]>([]);

  function generate() {
    const t = topic.trim();
    if (!t) return;
    setOutline(OUTLINE_STRUCTURES[type].sections(t));
  }

  const textOutput = useMemo(
    () =>
      outline
        .map((s, i) => `${i + 1}. ${s.title}\n${s.points.map((p) => `   • ${p}`).join("\n")}`)
        .join("\n\n"),
    [outline]
  );

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Topic" className="min-w-48 flex-1">
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. starting a newsletter"
          />
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as keyof typeof OUTLINE_STRUCTURES)}>
            {Object.entries(OUTLINE_STRUCTURES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={generate} disabled={!topic.trim()} className="h-9">
          Generate outline
        </Button>
      </OptionRow>

      {outline.length > 0 && (
        <>
          <CopyButton text={textOutput} label="Copy outline" />
          <div className="space-y-3">
            {outline.map((section, i) => (
              <Card key={i}>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {i + 1}. {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-0.5 text-zinc-400">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
