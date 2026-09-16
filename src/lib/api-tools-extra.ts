import {
  analyzeText,
  extractNumbers,
  readingLevelLabel,
  splitSentences,
  splitWords,
} from "@/lib/text";
import { formatJSON, jsonError } from "@/lib/format";
import { estimateCost, estimateTokens, TOKEN_MODELS } from "@/lib/tokens";
import { formatDurationLong, formatNumber, wordCount } from "@/lib/utils";
import type { ToolHandler } from "./api-tools";

const extraHandlers: Record<string, ToolHandler> = {};

export const apiToolExtraHandlers: Readonly<Record<string, ToolHandler>> = extraHandlers;

function getString(params: Record<string, unknown>, key: string, fallback = ""): string {
  const v = params[key];
  return typeof v === "string" ? v : fallback;
}

function getNumber(params: Record<string, unknown>, key: string, fallback: number): number {
  const v = params[key];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getBool(params: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const v = params[key];
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v !== "false" && v !== "0";
  return fallback;
}

function requireString(params: Record<string, unknown>, key: string, label: string): string {
  const v = getString(params, key);
  if (!v) throw new Error(`${label} is required.`);
  return v;
}

function registerHandler(slug: string, handler: ToolHandler): void {
  extraHandlers[slug] = handler;
}

function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = Math.abs(seed) || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cleanTag(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

registerHandler("sentence-counter", (p) => {
  const input = requireString(p, "input", "input");
  const stats = analyzeText(input);
  const sentences = splitSentences(input);
  const longest = sentences.length ? Math.max(...sentences.map((s) => s.split(/\s+/).length)) : 0;
  const shortest = sentences.length ? Math.min(...sentences.map((s) => s.split(/\s+/).filter(Boolean).length)) : 0;
  return {
    sentences: stats.sentences,
    averageWordsPerSentence: stats.averageWordsPerSentence,
    longest,
    shortest,
  };
});

registerHandler("paragraph-counter", (p) => {
  const input = requireString(p, "input", "input");
  const stats = analyzeText(input);
  return {
    paragraphs: stats.paragraphs,
    lines: stats.lines,
    words: stats.words,
    averageWordsPerParagraph: stats.paragraphs ? Number((stats.words / stats.paragraphs).toFixed(1)) : 0,
  };
});

registerHandler("reading-time", (p) => {
  const input = requireString(p, "input", "input");
  const wpm = getNumber(p, "wpm", 200);
  const words = analyzeText(input).words;
  const times = [
    { label: "150 wpm", minutes: words / 150 },
    { label: "200 wpm", minutes: words / 200 },
    { label: "250 wpm", minutes: words / 250 },
    { label: "300 wpm", minutes: words / 300 },
  ];
  return {
    words,
    wpm,
    selected: formatDurationLong(words / wpm),
    times: times.map((t) => ({ ...t, duration: formatDurationLong(t.minutes) })),
  };
});

registerHandler("speaking-time", (p) => {
  const input = requireString(p, "input", "input");
  const wpm = getNumber(p, "wpm", 130);
  const words = analyzeText(input).words;
  const minutes = words / wpm;
  const label =
    minutes < 1
      ? "Perfect for Shorts / Reels"
      : minutes <= 5
        ? "Short-form video"
        : minutes <= 15
          ? "Standard YouTube video"
          : minutes <= 45
            ? "Long-form video / podcast"
            : "Documentary / course";
  const times = [
    { label: "at 100 wpm", minutes: words / 100 },
    { label: "at 130 wpm", minutes: words / 130 },
    { label: "at 160 wpm", minutes: words / 160 },
    { label: "at 190 wpm", minutes: words / 190 },
  ];
  return {
    words,
    wpm,
    minutes,
    label,
    duration: formatDurationLong(minutes),
    times: times.map((t) => ({ label: t.label, duration: formatDurationLong(t.minutes) })),
  };
});

registerHandler("text-statistics", (p) => {
  const input = requireString(p, "input", "input");
  const stats = analyzeText(input);
  const summary = [
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
  ].join("\n");
  return { stats, summary };
});

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
  suprise: "surprise",
  occurence: "occurrence",
};

registerHandler("grammar-checker", (p) => {
  const input = requireString(p, "input", "input");
  const issues: { from: string; to: string; reason: string }[] = [];
  let corrected = input;

  corrected = corrected.replace(/\s{2,}/g, (m) => {
    issues.push({ from: m, to: " ", reason: "Multiple spaces collapsed to one." });
    return " ";
  });

  corrected = corrected.replace(/\s+([,.;:!?])/g, (_m, pp: string) => {
    issues.push({ from: ` ${pp}`, to: pp, reason: "No space before punctuation." });
    return pp;
  });

  corrected = corrected.replace(/\b(\w+) \1\b/gi, (_m, w: string) => {
    issues.push({ from: `${w} ${w}`, to: w, reason: `Repeated word “${w}”.` });
    return w;
  });

  corrected = corrected.replace(/([.!?])\s+([a-z])/g, (m, pp: string, l: string) => {
    issues.push({
      from: `${pp} ${l}`,
      to: `${pp} ${l.toUpperCase()}`,
      reason: "Sentence should start with a capital letter.",
    });
    return `${pp} ${l.toUpperCase()}`;
  });

  for (const [wrong, right] of Object.entries(COMMON_MISTAKES)) {
    const re = new RegExp(`\\b${wrong}\\b`, "gi");
    if (re.test(corrected)) {
      corrected = corrected.replace(re, (m) =>
        m[0] === m[0].toUpperCase() ? right.charAt(0).toUpperCase() + right.slice(1) : right
      );
      issues.push({ from: wrong, to: right, reason: `“${wrong}” is commonly misspelled as “${right}”.` });
    }
  }

  return { issues, corrected };
});

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

function swapSynonyms(text: string): string {
  return text.replace(/\b[a-z]+\b/g, (w) => {
    const opts = SYNONYMS[w.toLowerCase()];
    if (!opts) return w;
    const swap = opts[Math.floor(Math.random() * opts.length)];
    return w[0] === w[0].toUpperCase() ? capFirst(swap) : swap;
  });
}

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

registerHandler("rewrite-tool", (p) => {
  const input = requireString(p, "input", "input");
  const base = input.trim();
  const variations = [
    swapSynonyms(base),
    restructure(base),
    recast(base),
    restructure(swapSynonyms(base)),
  ];
  return { variations, all: variations.join("\n\n---\n\n") };
});

const SUM_STOPWORDS = new Set([
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

registerHandler("summarizer", (p) => {
  const input = requireString(p, "input", "input");
  let ratio = getNumber(p, "ratio", 0.3);
  if (ratio <= 0 || ratio > 1) ratio = 0.3;
  const sentences = splitSentences(input);
  if (sentences.length === 0) return { summary: "", kept: 0, total: 0 };

  const freq = new Map<string, number>();
  for (const s of sentences) {
    for (const w of splitWords(s)) {
      const key = w.toLowerCase();
      if (key.length < 3 || SUM_STOPWORDS.has(key)) continue;
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

  const summary = top.join(" ");
  return {
    summary,
    kept: top.length,
    total: sentences.length,
    originalWords: splitWords(input).length,
    summaryWords: splitWords(summary).length,
  };
});

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

registerHandler("expand-text", (p) => {
  const input = requireString(p, "input", "input");
  const expandAbbreviations = getBool(p, "expandAbbreviations", false);
  let out = expandContractions(input);
  if (expandAbbreviations) {
    for (const [k, v] of Object.entries(ABBREVIATIONS)) {
      out = out.replace(new RegExp(`\\b${k}\\b`, "gi"), (m) =>
        m[0] === m[0].toUpperCase() ? capFirst(v) : v
      );
    }
  }
  return { output: out, wordsBefore: splitWords(input).length, wordsAfter: splitWords(out).length };
});

const FILLER_WORDS = [
  "actually", "basically", "really", "very", "quite", "just", "simply",
  "literally", "totally", "absolutely", "definitely", "extremely", "pretty",
  "super", "honestly", "frankly", "obviously", "clearly",
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

registerHandler("shorten-text", (p) => {
  const input = requireString(p, "input", "input");
  let out = input;
  let removals = 0;
  for (const [re, sub] of WORDY_PHRASES) out = out.replace(re, sub);
  for (const w of FILLER_WORDS) {
    out = out.replace(new RegExp(`\\s\\b${w}\\b\\s?`, "gi"), () => {
      removals += 1;
      return " ";
    });
  }
  out = out.replace(/\s{2,}/g, " ").trim();
  return {
    output: out,
    removals,
    wordsBefore: splitWords(input).length,
    wordsAfter: splitWords(out).length,
    charsSaved: Math.max(0, input.length - out.length),
  };
});

const OUTLINE_STRUCTURES = {
  blog: {
    label: "Blog post",
    sections: (t: string) => [
      { title: "Introduction", points: [`Hook readers with a compelling question or stat about ${t}.`, `Explain why ${t} matters right now.`] },
      { title: `What Is ${capFirst(t)}?`, points: [`Define ${t} in simple, clear terms.`, `Give a quick example readers can relate to.`] },
      { title: `Why ${capFirst(t)} Matters`, points: [`Share 2–3 concrete benefits.`, `Add a short anecdote or data point.`] },
      { title: `How to Get Started with ${capFirst(t)}`, points: [`List the essential first steps.`, `Mention tools and resources to use.`, `Add a common pitfall to avoid.`] },
      { title: "Pro Tips", points: [`Include advanced techniques.`, `Give one insider shortcut.`] },
      { title: "Conclusion", points: [`Recap the key takeaways.`, `Include a call-to-action (comment, share, subscribe).`] },
    ],
  },
  video: {
    label: "YouTube video",
    sections: (t: string) => [
      { title: "Hook (0:00–0:30)", points: [`Open with the biggest outcome of this ${t} video.`, `Promise what viewers will learn.`] },
      { title: "Intro & Context (0:30–1:00)", points: [`Introduce yourself and why you made this.`, `Briefly frame the problem around ${t}.`] },
      { title: `Core Content: ${capFirst(t)} Explained`, points: [`Break ${t} into 3–5 key points.`, `Show real examples on screen.`] },
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

registerHandler("outline-generator", (p) => {
  const topic = requireString(p, "topic", "topic");
  const type = getString(p, "type", "blog") as keyof typeof OUTLINE_STRUCTURES;
  const structure = OUTLINE_STRUCTURES[type] ?? OUTLINE_STRUCTURES.blog;
  const outline = structure.sections(topic.trim());
  const text = outline
    .map((s, i) => `${i + 1}. ${s.title}\n${s.points.map((pp) => `   • ${pp}`).join("\n")}`)
    .join("\n\n");
  return { outline, text };
});

registerHandler("headline-analyzer", (p) => {
  const text = requireString(p, "headline", "headline").trim();
  const stats = analyzeText(text);
  const words = stats.words;
  const lengthScore = words >= 6 && words <= 12 ? 10 : words < 6 ? 7 : 6;
  const powerWords = ["secret", "proven", "powerful", "essential", "amazing", "ultimate", "free", "easy", "now", "new", "instant", "boost"];
  const powerHits = powerWords.filter((w) => text.toLowerCase().includes(w)).length;
  const powerScore = Math.min(10, 4 + powerHits * 2);
  const numberScore = /\d/.test(text) ? 9 : 6;
  const questionScore = /[?]/.test(text) ? 8 : 7;
  const punctuationScore = /[!.?]/.test(text) ? 9 : 6;
  const score = Math.round((lengthScore + powerScore + numberScore + questionScore + punctuationScore) / 5);
  return { text, words, score, powerHits, lengthScore, powerScore, numberScore, questionScore, punctuationScore };
});

const BLOG_TOPICS = [
  "10 Proven Ways to Grow Your Email List This Year",
  "How to Write Blog Posts That Actually Get Read",
  "The Beginner's Guide to Starting a Side Hustle",
  "Why Your Content Isn't Converting (and How to Fix It)",
  "7 Tools Every Creative Professional Needs in 2026",
  "How We Grew Our Audience 3x in Six Months",
  "The Complete Checklist for Launching a Product",
  "What Nobody Tells You About Working From Home",
  "5 Mistakes to Avoid When Building a Personal Brand",
  "How to Repurpose One Idea Into 30 Pieces of Content",
];

const BLOG_FORMATS = [
  "Ultimate Guide to {topic}",
  "{topic}: Everything You Need to Know",
  "How to {topic} in {number} Easy Steps",
  "The {number} Best {topic} Strategies",
  "Why {topic} Matters More Than Ever",
  "Common {topic} Mistakes to Avoid",
  "A Simple Plan for {topic}",
  "The Future of {topic}: What's Next",
];

registerHandler("blog-title-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  let titles: string[];
  if (topic.trim().length > 1) {
    const base = topic.trim().toLowerCase().replace(/[.!,]$/, "");
    titles = shuffle(
      BLOG_FORMATS.map((f) =>
        f.replace("{topic}", base).replace("{number}", String(2 + (Math.abs(seed) % 7)))
      ),
      seed
    ).slice(0, 5);
  } else {
    titles = shuffle(BLOG_TOPICS, seed).slice(0, 5);
  }
  return titles;
});

const ESSAY_TEMPLATES = [
  "{topic}: A {type} Perspective",
  "The Case For and Against {topic}",
  "How {topic} Shapes Our Everyday Lives",
  "Understanding {topic} Through a {type} Lens",
  "Five Key Arguments About {topic}",
  "Why {topic} Matters in the Modern World",
];

registerHandler("essay-title-generator", (p) => {
  const topic = getString(p, "topic", "");
  const type = getString(p, "type", "argumentative");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "Technology";
  return shuffle(
    ESSAY_TEMPLATES.map((t) => t.replace("{topic}", base).replace("{type}", type)),
    seed
  ).slice(0, 5);
});

const RHYME_WORDS: Record<string, string[]> = {
  cat: ["bat", "hat", "mat", "pat", "rat", "sat", "flat", "chat", "that"],
  day: ["way", "say", "may", "play", "stay", "today", "away", "grey", "display"],
  light: ["night", "right", "sight", "bright", "white", "height", "kite", "might"],
  run: ["sun", "fun", "done", "one", "begun", "outdone", "overrun", "gun"],
  song: ["long", "strong", "wrong", "throng", "belong", "along", "drawn"],
  blue: ["true", "new", "few", "through", "grew", "view", "knew", "due"],
  time: ["rhyme", "climb", "prime", "sublime", "chime", "mime", "crime"],
  bright: ["night", "light", "right", "sight", "height", "mite", "white"],
  know: ["go", "so", "show", "grow", "flow", "slow", "glow", "below"],
  heart: ["start", "art", "part", "chart", "smart", "apart", "depart"],
};

const RHYME_FALLBACK = ["try adding a different word — rhymes depend on sound, not spelling"];

registerHandler("rhyme-finder", (p) => {
  const word = requireString(p, "word", "word");
  const key = word.trim().toLowerCase();
  if (!key) return [];
  return RHYME_WORDS[key] ?? RHYME_FALLBACK;
});

const HAIKU_LINES = [
  ["cold winter morning", "a blanket of fresh white snow", "birds find breakfast now"],
  ["an old silent pond", "a frog jumps into the pond", "splash! silence again"],
  ["the light of a candle", "is transferred to another", "springtime of wisdom"],
  ["over the winter", "the snow has finally melted", "cherry blossoms bloom"],
  ["gentle autumn wind", "leaves dance down to the wet ground", "the season turns gold"],
  ["warm summer evening", "cicadas sing through the dusk", "stars begin to wake"],
  ["quiet mountain trail", "a fox crosses the soft path", "morning mist lingers"],
  ["the moon glows above", "waves whisper against the shore", "a lone boat drifts on"],
  ["first morning coffee", "steam rises into cool air", "day begins slowly"],
  ["empty city streets", "one lamp post hums in the rain", "footsteps echo soft"],
];

registerHandler("haiku-generator", (p) => {
  const seed = getNumber(p, "seed", 1);
  const haiku = pick(HAIKU_LINES, seed);
  return { output: haiku.join("\n"), lines: haiku };
});

const ACRONYM_PATTERNS = [
  "{w1} {w2} {w3}",
  "{w1}-{w2}",
  "{w1} & {w2}",
  "{w1} {w2} {w3} System",
  "The {w1} {w2} Framework",
  "{w1} {w2} {w3} {w4}",
];

registerHandler("acronym-generator", (p) => {
  const phrase = requireString(p, "phrase", "phrase");
  const seed = getNumber(p, "seed", 1);
  const words = phrase
    .split(/\s+/)
    .filter((w) => /^[a-z]/i.test(w))
    .map((w) => w.replace(/[^a-zA-Z]/g, ""));
  if (words.length < 2) throw new Error("Add at least two words to build an acronym.");
  const letters = words.map((w) => w[0].toUpperCase()).join("");
  const spellings = words.map((w) => `${w[0].toUpperCase()}.`).join(" ");
  const w1 = letters[0];
  const w2 = letters[1] ?? "";
  const w3 = letters[2] ?? "";
  const w4 = letters[3] ?? "";
  const variants = shuffle(ACRONYM_PATTERNS, seed)
    .slice(0, 5)
    .map((pat) => pat.replace("{w1}", w1).replace("{w2}", w2).replace("{w3}", w3).replace("{w4}", w4));
  return { letters, spellings, count: words.length, variants, output: variants.join("\n") };
});

const RESIGNATION_TEMPLATE = (
  "Dear {manager},\n" +
  "\n" +
  "Please accept this letter as formal notification that I am resigning from my position as {role} at {company}, effective {weeks} weeks from today, {date}.\n" +
  "\n" +
  "I want to thank you for the opportunities I've had during my time at {company}. I have learned a great deal and genuinely appreciate the support and guidance I've received.\n" +
  "\n" +
  "I'll do everything I can to ensure a smooth handover of my responsibilities before my departure. Please let me know how I can help during this transition.\n" +
  "\n" +
  "Thank you again for everything. I wish {company} continued success.\n" +
  "\n" +
  "Sincerely,\n" +
  "{name}"
);

registerHandler("resignation-letter-generator", (p) => {
  const manager = getString(p, "manager", "");
  const role = getString(p, "role", "");
  const company = getString(p, "company", "");
  const weeks = getNumber(p, "weeks", 2);
  const date = getString(p, "date", "");
  const name = getString(p, "name", "");
  return RESIGNATION_TEMPLATE
    .replaceAll("{manager}", manager || "[Manager's name]")
    .replaceAll("{role}", role || "[Your role]")
    .replaceAll("{company}", company || "[Company]")
    .replaceAll("{weeks}", String(weeks))
    .replaceAll("{date}", date || "[Date]")
    .replaceAll("{name}", name || "[Your name]");
});

const COLD_EMAIL_OPENERS = [
  "I came across {company} while researching {industry} and was impressed by {detail}.",
  "I've been following {company}'s work in {industry} and noticed {detail}.",
  "Hi {name}, I have a quick idea that could help {company} with {detail}.",
];

const COLD_EMAIL_CLOSERS = [
  "Would you be open to a 10-minute call this week?",
  "Is this something worth exploring together? Happy to share more.",
  "If it's helpful, I can send over a short one-pager.",
];

registerHandler("cold-email-generator", (p) => {
  const name = getString(p, "name", "");
  const company = getString(p, "company", "");
  const industry = getString(p, "industry", "");
  const detail = getString(p, "detail", "");
  const offer = getString(p, "offer", "");
  const seed = getNumber(p, "seed", 1);
  const opener = pick(COLD_EMAIL_OPENERS, seed)
    .replaceAll("{name}", name || "[First name]")
    .replaceAll("{company}", company || "[Company]")
    .replaceAll("{industry}", industry || "[Industry]")
    .replaceAll("{detail}", detail || "[a specific observation]");
  const closer = pick(COLD_EMAIL_CLOSERS, seed + 1);
  return `Subject: Quick idea for ${company || "[Company]"}\n\nHi ${name || "[First name]"},\n\n${opener}\n\n${offer || "[Your offer or value proposition]"}\n\n${closer}\n\nBest,\n[Your name]\n[Your title]`;
});

const EMAIL_SUBJECT_STYLES: Record<string, string[]> = {
  curiosity: ["{topic}? Not what you'd expect", "The {topic} secret few people know", "What I learned about {topic}"],
  direct: ["{topic}: next steps", "Your {topic} plan", "Quick question about {topic}"],
  numbers: ["5 {topic} tips", "3 mistakes with {topic}", "10 {topic} ideas"],
  urgency: ["Last chance: {topic}", "Closing soon: {topic}", "Don't miss this {topic} update"],
  personal: ["A note about {topic}", "Wanted to share this on {topic}", "Thinking of you + {topic}"],
};

registerHandler("email-subject-generator", (p) => {
  const topic = getString(p, "topic", "");
  const style = getString(p, "style", "curiosity");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "your project";
  const list = EMAIL_SUBJECT_STYLES[style] ?? EMAIL_SUBJECT_STYLES.curiosity;
  return shuffle(list, seed)
    .slice(0, 5)
    .map((t) => t.replaceAll("{topic}", base));
});

const THANKYOU_OCCASIONS: Record<string, { opener: string; body: string; closer: string }> = {
  interview: {
    opener: "Thank you so much for taking the time to meet with me today.",
    body: "I really appreciated learning more about {company} and the {role} role. Our conversation reinforced my interest in the position — I was especially excited about the team's work on {detail}.",
    closer: "I look forward to hearing about the next steps. Please don't hesitate to reach out if I can provide anything else.",
  },
  gift: {
    opener: "Thank you so much for the wonderful gift!",
    body: "It was incredibly thoughtful of you. I already {detail} — it honestly made my day. Your generosity means a lot to me.",
    closer: "Thank you again for your kindness. I can't wait to see you soon!",
  },
  boss: {
    opener: "I wanted to take a moment to thank you for your support and guidance.",
    body: "Your feedback on {detail} genuinely helped me grow. Working with someone so {quality} makes all the difference, and I'm grateful for the mentorship.",
    closer: "Thank you for everything you do. It doesn't go unnoticed.",
  },
  client: {
    opener: "Thank you for your continued trust in us.",
    body: "We truly appreciate the opportunity to work with you on {detail}. Your feedback helps us improve, and we're proud of what we've accomplished together.",
    closer: "Looking forward to our next project together!",
  },
};

registerHandler("thank-you-note-generator", (p) => {
  const occasion = getString(p, "occasion", "interview");
  const company = getString(p, "company", "");
  const role = getString(p, "role", "");
  const detail = getString(p, "detail", "");
  const quality = getString(p, "quality", "");
  const name = getString(p, "name", "");
  const t = THANKYOU_OCCASIONS[occasion] ?? THANKYOU_OCCASIONS.interview;
  const body = t.body
    .replaceAll("{company}", company || "[Company]")
    .replaceAll("{role}", role || "[Role]")
    .replaceAll("{detail}", detail || "[the specific thing]")
    .replaceAll("{quality}", quality || "[quality]");
  return `${t.opener}\n\n${body}\n\n${t.closer}\n\nBest,\n${name || "[Your name]"}`;
});

const CONCLUSION_OPENERS = [
  "In conclusion, {topic} is far more than a passing trend — it shapes how we work and create.",
  "To wrap up, the evidence around {topic} is clear: it pays to pay attention.",
  "Ultimately, {topic} comes down to one thing: consistent, intentional action.",
  "So, what does all of this mean for {topic}? Quite a lot, actually.",
];

const CONCLUSION_MIDDLES = [
  "By focusing on the core principles we've covered — {points} — anyone can make steady progress.",
  "The key takeaway is that {points} are within reach for anyone willing to start small.",
  "Whether you're just beginning or already deep in the journey, applying {points} will move the needle.",
];

const CONCLUSION_CLOSERS = [
  "The next step is yours to take. Start today, and let the results speak for themselves.",
  "Start with one small change, and build from there — consistency beats intensity.",
  "Now it's time to act. Pick one idea, try it, and adjust as you go.",
];

registerHandler("conclusion-generator", (p) => {
  const topic = getString(p, "topic", "");
  const points = getString(p, "points", "");
  const tone = getString(p, "tone", "neutral");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "this topic";
  const list = points.trim() || "the strategies above";
  let opener = pick(CONCLUSION_OPENERS, seed).replaceAll("{topic}", base);
  const middle = pick(CONCLUSION_MIDDLES, seed + 1).replaceAll("{points}", list);
  let closer = pick(CONCLUSION_CLOSERS, seed + 2);
  if (tone === "inspirational") {
    opener = opener.replace("consistent, intentional action", "vision, grit, and consistency");
    closer = "You have everything you need to begin. Take the first step today.";
  }
  return `${opener}\n\n${middle}\n\n${closer}`;
});

registerHandler("find-and-replace", (p) => {
  const input = requireString(p, "input", "input");
  const find = getString(p, "find", "");
  const replace = getString(p, "replace", "");
  const caseSensitive = getBool(p, "caseSensitive", false);
  if (!find) return input;
  if (caseSensitive) return input.split(find).join(replace);
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return input.replace(new RegExp(escaped, "gi"), replace);
});

registerHandler("prefix-suffix", (p) => {
  const input = requireString(p, "input", "input");
  const prefix = getString(p, "prefix", "");
  const suffix = getString(p, "suffix", "");
  return input
    .split("\n")
    .map((l) => `${prefix}${l}${suffix}`)
    .join("\n");
});

registerHandler("extract-numbers", (p) => {
  const input = requireString(p, "input", "input");
  const numbers = extractNumbers(input);
  const total = numbers.reduce((acc, n) => acc + (Number(n.replace(",", ".")) || 0), 0);
  const sum = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(total);
  return { numbers, count: numbers.length, sum };
});

const EMOJI_REGEX =
  /(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base})[\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]*(?:\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base})[\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]*)*/gu;

registerHandler("remove-emojis", (p) => {
  const input = requireString(p, "input", "input");
  const output = input.replace(EMOJI_REGEX, "");
  const matches = input.match(EMOJI_REGEX);
  return { output, removed: matches ? matches.length : 0 };
});

registerHandler("remove-special-characters", (p) => {
  const input = requireString(p, "input", "input");
  const keepSpaces = getBool(p, "keepSpaces", true);
  const keepPunctuation = getBool(p, "keepPunctuation", false);
  let pattern: RegExp;
  if (keepPunctuation) {
    pattern = keepSpaces ? /[^\p{L}\p{N}\s.,!?;:'"-]/gu : /[^\p{L}\p{N}.,!?;:'"-]/gu;
  } else {
    pattern = keepSpaces ? /[^\p{L}\p{N}\s]/gu : /[^\p{L}\p{N}]/gu;
  }
  const output = input.replace(pattern, "");
  return {
    output,
    charactersBefore: input.length,
    charactersAfter: output.length,
    removed: input.length - output.length,
  };
});

registerHandler("text-repeater", (p) => {
  const text = requireString(p, "text", "text");
  const count = Math.max(0, Math.min(1000, Math.round(getNumber(p, "count", 3))));
  const separator = getString(p, "separator", "newline");
  const sep = separator === "newline" ? "\n" : separator === "space" ? " " : "";
  return Array.from({ length: count }, () => text).join(sep);
});

function csvEscape(cell: string): string {
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

registerHandler("text-to-csv", (p) => {
  const input = requireString(p, "input", "input");
  const delimiter = getString(p, "delimiter", "comma");
  const split =
    delimiter === "tab"
      ? /\t/
      : delimiter === "pipe"
        ? /\|/
        : delimiter === "space"
          ? /\s+/
          : /,/;
  return input
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .map((line) => line.split(split).map((c) => c.trim()).map(csvEscape).join(","))
    .join("\n");
});

registerHandler("column-aligner", (p) => {
  const input = requireString(p, "input", "input");
  const delimiter = getString(p, "delimiter", "pipe");
  const split = delimiter === "tab" ? /\t/ : delimiter === "space" ? /\s{2,}/ : /\s*\|\s*/;
  const rows = input.split(/\r?\n/).filter((l) => l.trim().length > 0);
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
});

registerHandler("palindrome-checker", (p) => {
  const text = requireString(p, "input", "input");
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!clean) return { isPalindrome: null, reversed: "", length: 0 };
  const isPalindrome = clean === [...clean].reverse().join("");
  const reversed = [...text].reverse().join("");
  return { isPalindrome, reversed, length: clean.length };
});

registerHandler("anagram-finder", (p) => {
  const input = requireString(p, "input", "input");
  const sortMode = getString(p, "sortMode", "length");
  const list = splitWords(input.toLowerCase());
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
});

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

registerHandler("morse-code-converter", (p) => {
  const input = requireString(p, "input", "input");
  const direction = getString(p, "direction", "encode");
  if (direction === "encode") {
    return input
      .toLowerCase()
      .split(" ")
      .map((word) =>
        [...word].map((ch) => (MORSE[ch] ?? (ch === "" ? "" : "?"))).join(" ")
      )
      .join("   ");
  }
  return input
    .split(/\s{3,}|\s*\|\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_REVERSE[code] ?? "?")
        .join("")
    )
    .join(" ");
});

registerHandler("character-frequency-counter", (p) => {
  const input = requireString(p, "input", "input");
  const caseSensitive = getBool(p, "caseSensitive", false);
  const map = new Map<string, number>();
  const source = caseSensitive ? input : input.toLowerCase();
  for (const ch of source) {
    if (ch.trim() === "") continue;
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
});

registerHandler("word-frequency-counter", (p) => {
  const input = requireString(p, "input", "input");
  const limit = Math.max(1, Math.min(100, Math.round(getNumber(p, "limit", 20))));
  const map = new Map<string, number>();
  for (const w of splitWords(input)) {
    const key = w.toLowerCase();
    if (key.length < 2) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
});

const POWER_WORDS = [
  "Ultimate", "Secret", "Crazy", "Simple", "Powerful", "Shocking",
  "Proven", "Beginner-Friendly", "Complete", "Mind-Blowing",
];

const TITLE_OUTCOMES = [
  "Step-by-Step Guide", "What Nobody Tells You", "For Beginners", "In 2026",
  "Full Tutorial", "Pro Tips That Work",
];

function generateTitles(topic: string, outcome: string): string[] {
  const t = capFirst(topic.trim());
  if (!t) return [];
  const pw = POWER_WORDS[Math.floor(Math.random() * POWER_WORDS.length)];
  const outcomes = [outcome, ...TITLE_OUTCOMES.filter((o) => o !== outcome)];
  return [
    `${pw} ${t} — ${outcomes[0]}`,
    `How to Master ${t} (${outcomes[1]})`,
    `I Tried ${t} For 30 Days — Here's What Happened`,
    `The Truth About ${t} Nobody Talks About`,
    `5 ${t} Mistakes You're Making Right Now`,
    `${t} Explained in 10 Minutes`,
    `Stop Doing ${t} The WRONG Way`,
    `The ${t} Blueprint for Absolute Beginners`,
    `${t}: What I Wish I Knew Before Starting`,
    `Why Everyone's Talking About ${t} Right Now`,
    `${pw} ${t} Tips That Actually Work in 2026`,
    `${t} From Zero to Pro — The Complete ${outcomes[0]}`,
  ];
}

function titleScore(title: string): number {
  let score = 50;
  const len = title.length;
  if (len <= 60) score += 20;
  else if (len <= 70) score += 12;
  else score -= 10;
  if (/\d/.test(title)) score += 10;
  if (/\b(how|why|what|stop|mistakes|truth|secret|guide|tutorial)\b/i.test(title)) score += 10;
  if (POWER_WORDS.some((w) => title.includes(w))) score += 5;
  if (/['"…]/.test(title)) score += 5;
  return Math.min(100, Math.max(0, score));
}

registerHandler("youtube-title-generator", (p) => {
  const topic = getString(p, "topic", "");
  const outcome = getString(p, "outcome", TITLE_OUTCOMES[0]);
  const titles = generateTitles(topic, outcome);
  return titles.map((title) => ({ title, score: titleScore(title), length: title.length }));
});

function tagVariants(keyword: string): string[] {
  const k = keyword.trim().toLowerCase();
  if (!k) return [];
  return [
    k, `${k} tips`, `how to ${k}`, `best ${k}`, `${k} tutorial`,
    `${k} for beginners`, `${k} 2026`, `${k} ideas`, `${k} guide`,
    `${k} explained`, `${k} tutorial for beginners`, `top ${k}`,
  ];
}

registerHandler("youtube-tag-generator", (p) => {
  const keywords = getString(p, "keywords", "");
  const base = keywords
    .split(/[\n,]/)
    .map((k) => k.trim())
    .filter(Boolean);
  const all = base.flatMap(tagVariants);
  const defaults = [
    "content creator", "youtube tips", "creator tips", "viral", "shorts",
    "tutorial", "how to",
  ];
  const pool = [...new Set([...all, ...defaults])];
  const tags = pool.slice(0, 60);
  return {
    tags,
    comma: tags.join(", "),
    hashtags: tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" "),
  };
});

function isQuestionTopic(topic: string): boolean {
  return (
    /\?$/.test(topic.trim()) ||
    /^(what|why|how|does|do|can|could|should|will|would|when|who|is|are|if)\b/i.test(topic.trim())
  );
}

function generateHooks(topic: string): string[] {
  const raw = topic.trim();
  if (!raw) return [];
  if (isQuestionTopic(raw)) {
    const t = raw.replace(/[?.\s]+$/, "");
    return [
      `Everyone's asking “${t}?” — I found the answer.`,
      `You keep wondering “${t}?” — this is what I discovered.`,
      `“${t}?” Watch this before you decide.`,
      `I finally cracked the question: “${t}?”`,
      `The truth nobody tells you about “${t}?”`,
      `Stop googling “${t}” — here's the real answer.`,
      `Why “${t}?” matters more than you think.`,
      `I was wrong about “${t}?” — here's why.`,
      `3 answers to “${t}?” you need to hear.`,
      `The uncomfortable truth behind “${t}?”`,
    ];
  }
  const t = capFirst(raw);
  return [
    `Stop scrolling — ${t} is about to change everything.`,
    `Nobody tells you this about ${t}…`,
    `I was completely wrong about ${t}.`,
    `This ${t} secret saved me 10 hours a week.`,
    `If you're doing ${t}, you're doing it wrong.`,
    `The ${t} secret that took me years to learn.`,
    `Don't start ${t} until you watch this.`,
    `How I mastered ${t} in just 30 days.`,
    `3 things I wish I knew before starting ${t}.`,
    `The uncomfortable truth about ${t} in 2026.`,
  ];
}

registerHandler("youtube-hook-generator", (p) => {
  const topic = getString(p, "topic", "");
  return generateHooks(topic);
});

const THUMBNAIL_PRESETS = [
  { label: "16:9 · 1280×720", w: 1280, h: 720 },
  { label: "16:9 · 1920×1080", w: 1920, h: 1080 },
  { label: "9:16 · 720×1280 (Shorts)", w: 720, h: 1280 },
  { label: "1:1 · 1080×1080", w: 1080, h: 1080 },
];

registerHandler("thumbnail-text-checker", (p) => {
  const text = getString(p, "text", "");
  const preset = Math.max(0, Math.min(THUMBNAIL_PRESETS.length - 1, Math.round(getNumber(p, "preset", 0))));
  const fontSize = getNumber(p, "fontSize", 140);
  const width = THUMBNAIL_PRESETS[preset].w;
  const warnings: string[] = [];
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  let score = 50;

  if (wordCount <= 6) score += 25;
  else if (wordCount <= 8) score += 10;
  else {
    score -= 20;
    warnings.push("Too many words — aim for 6 or fewer for maximum impact.");
  }

  const relativeSize = (fontSize / width) * 100;
  if (relativeSize >= 9) score += 20;
  else if (relativeSize >= 6) score += 8;
  else {
    score -= 10;
    warnings.push("Text may be too small on mobile — increase the font size.");
  }

  if (text.length <= 40) score += 5;
  else warnings.push("Keep the text short — it should be a headline, not a paragraph.");

  if (wordCount >= 2 && wordCount <= 5) score += 10;

  if (score < 40) warnings.push("Low impact — add emotional words or a clear benefit.");
  else if (score >= 80) warnings.push("Great thumbnail text — clear, readable, and punchy.");

  return {
    score: Math.min(100, Math.max(0, score)),
    warnings,
    wordCount,
    characters: text.length,
    preset: THUMBNAIL_PRESETS[preset],
  };
});

registerHandler("youtube-description-generator", (p) => {
  const topic = getString(p, "topic", "");
  const keywords = getString(p, "keywords", "");
  const withHashtags = getBool(p, "withHashtags", true);
  const socials = getString(p, "socials", "");
  const t = capFirst(topic.trim());
  if (!t) return "";
  const kws = keywords
    .split(/[\n,]/)
    .map((k) => k.trim())
    .filter(Boolean);

  const lines: string[] = [
    `${t} — everything you need to know in one video.`,
    "",
    "In this video you'll learn:",
    ...kws.map((k) => `📌 ${k}`),
    "",
    "⏱️ Timestamps:",
    "00:00 Intro",
    "01:00 Main content",
    "",
    "👍 If this helped you, hit LIKE and SUBSCRIBE for more.",
    "",
  ];
  if (socials.trim()) {
    lines.push("🔗 Connect with me:");
    lines.push(...socials.split("\n").map((s) => s.trim()).filter(Boolean));
    lines.push("");
  }
  if (withHashtags) {
    const tags = kws.slice(0, 5).map((k) => `#${k.replace(/\s+/g, "").toLowerCase()}`);
    lines.push(tags.join(" "));
  }
  return lines.join("\n");
});

function ctrScore(title: string): {
  score: number;
  bars: { label: string; value: number; max: number }[];
  tips: string[];
} {
  const tips: string[] = [];
  let score = 40;
  const bars: { label: string; value: number; max: number }[] = [];

  const len = title.length;
  if (len <= 60 && len >= 20) score += 20;
  else if (len > 60 && len <= 70) {
    score += 10;
    tips.push("Title is a bit long — aim for under 60 characters.");
  } else if (len < 20) tips.push("Title is very short — add a specific benefit or outcome.");
  else tips.push("Title is too long — most of it will be cut off.");
  bars.push({ label: "Length", value: len <= 60 ? 100 : len <= 70 ? 70 : 30, max: 100 });

  if (/\d/.test(title)) score += 15;
  else tips.push("Add a number to make the benefit concrete (e.g. 5 ways…).");
  bars.push({ label: "Numbers", value: /\d/.test(title) ? 100 : 20, max: 100 });

  const power = ["secret", "ultimate", "crazy", "shocking", "proven", "mistakes", "truth", "easy", "fast", "best", "never", "stop", "wrong", "blueprint"];
  const powerHits = power.filter((w) => title.toLowerCase().includes(w)).length;
  if (powerHits > 0) score += Math.min(15, powerHits * 5);
  else tips.push("Add an emotional or curiosity-driven power word.");
  bars.push({ label: "Power words", value: powerHits * 34, max: 100 });

  const brackets = /[([{]/.test(title) && /[)\]}»]/.test(title);
  if (brackets) score += 10;
  else tips.push("Try a bracket detail, e.g. (takes 10 minutes).");
  bars.push({ label: "Brackets", value: brackets ? 100 : 20, max: 100 });

  if (/[?]/.test(title)) score += 10;
  bars.push({ label: "Question", value: /[?]/.test(title) ? 100 : 30, max: 100 });

  if (/\p{Extended_Pictographic}/u.test(title)) {
    score += 5;
    bars.push({ label: "Emoji", value: 100, max: 100 });
  } else {
    bars.push({ label: "Emoji", value: 20, max: 100 });
  }

  const firstWord = title.trim().split(/\s+/)[0] ?? "";
  if (/[a-z]/.test(firstWord)) tips.push("Capitalize each key word — it reads more clickable.");

  score = Math.min(100, Math.max(0, score));
  return { score, bars, tips };
}

registerHandler("ctr-analyzer", (p) => {
  const title = requireString(p, "title", "title");
  return ctrScore(title);
});

function formatMinutes(mins: number): string {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function parseScript(text: string, wpm: number): { heading: string; words: number; minutes: number }[] {
  const lines = text.split("\n");
  const sections: { heading: string; words: number; minutes: number }[] = [];
  let current = { heading: "Intro", words: 0 };
  let buffer: string[] = [];

  function flush() {
    const words = buffer.join(" ").match(/[A-Za-z0-9'’-]+/g)?.length ?? 0;
    if (words > 0 || sections.length === 0) {
      sections.push({ heading: current.heading, words, minutes: words / wpm });
    }
    buffer = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(##|###|--)\s*/.test(trimmed) || /^\[.*\]$/.test(trimmed)) {
      flush();
      current = { heading: trimmed.replace(/^[#-]+\s*/, "").replace(/[\[\]]/g, "").trim() || "Section", words: 0 };
    } else if (/^\d{1,2}:\d{2}/.test(trimmed)) {
      flush();
      current = { heading: trimmed.replace(/^\d{1,2}:\d{2}\s*/, "") || "Section", words: 0 };
    } else {
      buffer.push(trimmed);
    }
  }
  flush();
  return sections.filter((s) => s.words > 0 || s.heading === "Intro");
}

registerHandler("script-timer", (p) => {
  const input = requireString(p, "input", "input");
  const wpm = getNumber(p, "wpm", 140);
  const sections = parseScript(input, wpm);
  const totalMinutes = sections.reduce((a, s) => a + s.minutes, 0);
  const output = [
    `Total speaking time: ${formatMinutes(totalMinutes)}`,
    "",
    ...sections.map((s) => `${s.heading}: ${formatMinutes(s.minutes)} (${s.words} words)`),
  ].join("\n");
  return { sections, totalMinutes, duration: formatMinutes(totalMinutes), output };
});

const SHORT_FORMATS = ["Tutorial", "Challenge", "Story", "Fact", "Listicle", "POV", "Reaction", "FAQ"];
const SHORT_HOOKS = [
  (t: string) => `The ${t} secret nobody talks about…`,
  (t: string) => `Stop doing ${t} wrong — do this instead.`,
  (t: string) => `3 ${t} mistakes you're making right now.`,
  (t: string) => `I tried ${t} for 30 days. Here's what happened.`,
  (t: string) => `This ${t} hack will save you hours.`,
  (t: string) => `How I mastered ${t} in just 7 days.`,
  (t: string) => `The truth about ${t} in 2026.`,
  (t: string) => `You're probably doing ${t} all wrong.`,
  (t: string) => `The fastest way to learn ${t}.`,
  (t: string) => `${t} explained in 60 seconds.`,
];

function genShortsIdea(niche: string): string {
  const t = niche.trim();
  const hook = SHORT_HOOKS[Math.floor(Math.random() * SHORT_HOOKS.length)](t);
  const fmt = SHORT_FORMATS[Math.floor(Math.random() * SHORT_FORMATS.length)];
  const cta = [
    "Save this for later — you'll need it.",
    "Follow for more daily tips.",
    "Comment 'YES' if you agree.",
    "Share this with someone who needs it.",
  ];
  return `${hook}\n\nFormat: ${fmt}\n\n${cta[Math.floor(Math.random() * cta.length)]}`;
}

registerHandler("shorts-idea-generator", (p) => {
  const niche = requireString(p, "niche", "niche");
  const ideas = Array.from({ length: 6 }, () => genShortsIdea(niche));
  return ideas;
});

const CTA_GOALS = {
  subscribe: ["Don't forget to subscribe", "Sub for weekly videos", "Hit subscribe — it's free", "Join 50K+ subscribers"],
  like: ["If this helped, give it a like", "Smash that like button", "A like helps more creators find this"],
  comment: ["What did I miss? Drop it below", "Comment your biggest question", "Tell me your take below"],
  share: ["Share this with a friend", "Send this to someone who needs it", "Save & share for later"],
  signup: ["Join my free newsletter", "Grab the free checklist (link in bio)", "Get the template — link below"],
};

registerHandler("cta-generator", (p) => {
  const goal = getString(p, "goal", "subscribe");
  const extra = getString(p, "extra", "");
  const base = CTA_GOALS[(goal as keyof typeof CTA_GOALS)] ?? CTA_GOALS.subscribe;
  const extraCTA = extra.trim() ? [`${extra.trim()} — link in description.`] : [];
  return { ctas: [...base, ...extraCTA], output: [...base, ...extraCTA].join("\n") };
});

function normalizeTime(token: string): string {
  const parts = token.split(":").map((pp) => pp.trim());
  const seconds = parts.length === 1 ? Number(parts[0]) || 0 : Number(parts[1]) || 0;
  const minutes = parts.length >= 2 ? Number(parts[0]) || 0 : 0;
  const hours = parts.length === 3 ? Number(parts[0]) || 0 : 0;
  const mm = hours * 60 + minutes;
  const hh = Math.floor(mm / 60);
  const m = mm % 60;
  if (hh > 0) return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

registerHandler("chapter-generator", (p) => {
  const input = requireString(p, "input", "input");
  const chapters = input
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:[-–—]\s*)?(.*)$/);
      if (m) return { time: normalizeTime(m[1]), title: m[2].trim() || "Chapter" };
      return null;
    })
    .filter((c): c is { time: string; title: string } => c !== null);
  return { chapters, output: chapters.map((c) => `${c.time} ${c.title}`).join("\n") };
});

const KEYWORD_PREFIXES = [
  "how to", "best", "top", "what is", "why", "tutorial", "for beginners", "vs",
  "tips", "ideas", "guide", "review", "2026", "examples", "step by step",
];

function keywordVariants(seed: string): string[] {
  const s = seed.trim().toLowerCase();
  if (!s) return [];
  return KEYWORD_PREFIXES.map((prefix) =>
    prefix === "vs" ? `${s} vs alternatives` : `${prefix} ${s}`
  );
}

registerHandler("youtube-keyword-finder", (p) => {
  const seed = requireString(p, "seed", "seed");
  const keywords = keywordVariants(seed);
  return { keywords, output: keywords.join("\n") };
});

const VIDEO_FORMATS = [
  "Tutorial: How to {topic} from Scratch",
  "The TRUTH About {topic} (What Nobody Says)",
  "I Tried {topic} for 30 Days — Here's What Happened",
  "{topic}: The Complete Beginner's Guide",
  "5 Mistakes to Avoid When {topic}",
  "Why {topic} Is Blowing Up in 2026",
  "Reacting to {topic} Trends",
  "Vlog: A Day of {topic}",
  "Deep Dive: The Science of {topic}",
  "Comparing {topic} vs. {alternative}",
];

registerHandler("video-idea-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim().toLowerCase().replace(/[.!?]$/, "") || "content creation";
  return shuffle(
    VIDEO_FORMATS.map((f) =>
      f.replaceAll("{topic}", base).replaceAll("{alternative}", pick(["the old way", "paid tools", "free options"], seed))
    ),
    seed
  ).slice(0, 5);
});

const OUTLINE_HOOKS = [
  "00:00 Hook — the surprising reason this matters to you",
  "00:15 Intro — what we'll cover and what you'll get out of it",
];
const OUTLINE_MIDS = [
  "Key point 1: {point}",
  "Key point 2: {point}",
  "Common mistakes and how to avoid them",
  "Demonstration / walkthrough",
];
const OUTLINE_ENDS = [
  "Recap and main takeaways",
  "CTA — subscribe for more {topic} content",
];

registerHandler("video-outline-generator", (p) => {
  const topic = getString(p, "topic", "");
  const points = getString(p, "points", "");
  const base = topic.trim() || "your topic";
  const pointList = points
    .split(/[\n,]/)
    .map((pp) => pp.trim())
    .filter(Boolean);
  const mids = pointList.length >= 2 ? pointList.slice(0, 3) : OUTLINE_MIDS.map((m) => m.replaceAll("{point}", "expanded example"));
  const lines = [
    ...OUTLINE_HOOKS,
    ...mids.map((m, i) => `0${i + 3}:00 ${m.replaceAll("{point}", mids.length > i ? mids[i] : "example")}`),
    ...OUTLINE_ENDS.map((e) => e.replaceAll("{topic}", base)),
  ];
  return { lines, output: lines.join("\n") };
});

const POST_TEMPLATES = [
  "Question for you 👇\n\n{question}\n\nDrop your answer in the comments — I read every single one!",
  "Quick poll: {question}\n\nResults may surprise you…",
  "Behind the scenes 🎬\n\n{detail}\n\nWhat do you want to see next?",
  "Unpopular opinion: {opinion}\n\nAgree or disagree? Tell me why below.",
  "This week I learned {lesson}.\n\n{question}",
];

const POST_QUESTIONS = [
  "What's your biggest {topic} struggle right now?",
  "Which {topic} tip changed the game for you?",
  "What should I test in my next {topic} video?",
];

registerHandler("community-post-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "content";
  return pick(POST_TEMPLATES, seed)
    .replaceAll("{question}", pick(POST_QUESTIONS, seed + 1).replaceAll("{topic}", base))
    .replaceAll("{opinion}", `the best ${base} tools are usually the free ones`)
    .replaceAll("{detail}", "here's the setup I use to film every video")
    .replaceAll("{lesson}", `a tiny ${base} habit compounds fast`);
});

const THUMB_PATTERNS = [
  "You WON'T Believe This {topic} Tip",
  "The {topic} Method That WORKS",
  "{number} {topic} Hacks in 60 Seconds",
  "STOP Doing This If You Want {topic} Results",
  "This {topic} Secret Changed Everything",
  "I Tested Every {topic} Trick So You Don't Have To",
];

registerHandler("thumbnail-text-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "growth";
  return shuffle(
    THUMB_PATTERNS.map((pp) => pp.replaceAll("{topic}", base).replaceAll("{number}", String(3 + (Math.abs(seed) % 5)))),
    seed
  ).slice(0, 4);
});

const CHECKLIST = [
  "Hook in the first 15 seconds",
  "Clear title with a searchable keyword",
  "Compelling thumbnail (readable at small size)",
  "Audio levels consistent across the video",
  "Captions / subtitles added",
  "CTA to subscribe placed before the end",
  "End screen with links to 2 more videos",
  "Description with timestamps and keyword",
  "Tags / hashtags filled in",
  "Pinned comment asking a question",
];

registerHandler("video-checklist-generator", (p) => {
  const title = getString(p, "title", "");
  const extra = getString(p, "extra", "");
  const extras = extra
    .split("\n")
    .map((e) => e.trim())
    .filter(Boolean);
  return [
    title ? `Video: ${title}` : "Video checklist",
    "",
    ...CHECKLIST.map((c, i) => `${i + 1}. [ ] ${c}`),
    ...extras.map((e, i) => `${CHECKLIST.length + i + 1}. [ ] ${e}`),
  ].join("\n");
});

const SEO_STOPWORDS = new Set([
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

registerHandler("keyword-density", (p) => {
  const input = requireString(p, "input", "input");
  const includeStopwords = getBool(p, "includeStopwords", false);
  const stats = analyzeText(input);
  const freq = new Map<string, number>();
  const words = input
    .toLowerCase()
    .match(/[a-z0-9'’-]+/g)
    ?.filter((w) => includeStopwords || !SEO_STOPWORDS.has(w)) ?? [];
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const keywords = [...freq.entries()]
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({
      word,
      count,
      density: stats.words ? Number(((count / stats.words) * 100).toFixed(1)) : 0,
    }));
  return { keywords, totalWords: stats.words, uniqueWords: stats.uniqueWords };
});

function benefit(k: string): string {
  const nouns = k.split(" ").pop() ?? k;
  return `The Best ${capFirst(nouns)} Guide`;
}

const TITLE_TEMPLATES = [
  (k: string) => `${k}: ${benefit(k)}`,
  (k: string, b: string) => `${benefit(k)} — ${k} ${b ? `| ${b}` : ""}`.replace(/ \| $/, ""),
  (k: string) => `${capFirst(k)} in 2026: The Complete Guide`,
  (k: string, b: string) => `How to ${k} ${b ? `| ${b}` : ""}`.replace(/ \| $/, ""),
  (k: string) => `${capFirst(k)} Explained (Beginner to Pro)`,
  (k: string) => `The Ultimate ${capFirst(k)} Checklist for 2026`,
  (k: string) => `${capFirst(k)}: Everything You Need to Know`,
  (k: string) => `Top ${capFirst(k)} Tips You Can Use Today`,
];

registerHandler("meta-title-generator", (p) => {
  const keyword = requireString(p, "keyword", "keyword");
  const brand = getString(p, "brand", "");
  const url = getString(p, "url", "https://example.com/blog/");
  const titles = TITLE_TEMPLATES.map((tpl) => tpl(keyword.trim(), brand.trim()));
  return {
    titles,
    previewUrl: `${url}${keyword.trim().replace(/\s+/g, "-").toLowerCase()}`,
  };
});

const DESC_TEMPLATES = [
  (k: string) =>
    `Looking for the best ${k}? Our expert guide covers everything you need to know — features, pros and cons, and honest recommendations to help you choose with confidence.`,
  (k: string) =>
    `Discover the top ${k} in 2026. Compare prices, read expert reviews, and find the perfect option for your needs — no fluff, just what actually matters.`,
  (k: string) =>
    `Everything about ${k}, explained simply. Learn how it works, what to look for, and get practical tips from people who've done it before. Start reading now.`,
  (k: string) =>
    `Wondering what makes ${k} worth your time? This complete guide breaks it down step by step — from basics to pro tips — so you can get results fast.`,
];

registerHandler("meta-description-generator", (p) => {
  const keyword = requireString(p, "keyword", "keyword");
  const url = getString(p, "url", "https://example.com/blog/");
  const descriptions = DESC_TEMPLATES.map((tpl) => tpl(keyword.trim()));
  return {
    descriptions,
    previewTitle: `${capFirst(keyword.trim())} — The Complete Guide`,
    previewUrl: `${url}${keyword.trim().replace(/\s+/g, "-").toLowerCase()}`,
  };
});

registerHandler("robots-txt-generator", (p) => {
  const disallowAll = getBool(p, "disallowAll", false);
  const sitemap = getString(p, "sitemap", "");
  const disallow = getString(p, "disallow", "");
  const allow = getString(p, "allow", "");
  const customRules = getString(p, "customRules", "");
  const lines: string[] = ["User-agent: *"];
  if (disallowAll) {
    lines.push("Disallow: /");
  } else {
    const disallows = disallow.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const d of disallows) lines.push(`Disallow: ${d}`);
    const allows = allow.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const a of allows) lines.push(`Allow: ${a}`);
  }
  if (customRules.trim()) lines.push("", customRules.trim());
  if (sitemap.trim()) lines.push("", `Sitemap: ${sitemap.trim()}`);
  return lines.join("\n");
});

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

registerHandler("sitemap-generator", (p) => {
  const domain = getString(p, "domain", "https://example.com");
  const paths = getString(p, "paths", "/");
  const addLastmod = getBool(p, "addLastmod", true);
  const addPriority = getBool(p, "addPriority", true);
  const host = domain.trim().replace(/\/+$/, "");
  const items = paths
    .split("\n")
    .map((pp) => pp.trim())
    .filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);
  const body = items
    .map((pp, i) => {
      const loc = `${host}${pp.startsWith("/") ? pp : `/${pp}`}`;
      const lines = [`<url>`, `  <loc>${xmlEscape(loc)}</loc>`];
      if (addLastmod) lines.push(`  <lastmod>${today}</lastmod>`);
      if (addPriority) lines.push(`  <priority>${i === 0 ? "1.0" : "0.8"}</priority>`);
      lines.push(`</url>`);
      return lines.join("\n");
    })
    .join("\n");
  const output = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    body,
    `</urlset>`,
  ].join("\n");
  return { output, urlCount: items.length };
});

registerHandler("serp-preview", (p) => {
  const title = getString(p, "title", "");
  const description = getString(p, "description", "");
  const url = getString(p, "url", "https://example.com/blog/my-page");
  const titleLength = title.length || 0;
  const descLength = description.length || 0;
  const titleOk = titleLength <= 60;
  const descOk = descLength <= 160;
  const pixelTitle = Math.min(100, Math.round((titleLength / 60) * 100));
  const pixelDesc = Math.min(100, Math.round((descLength / 160) * 100));
  return { titleLength, descLength, titleOk, descOk, pixelTitle, pixelDesc, url };
});

function tokenize(content: string): string[] {
  return content.toLowerCase().match(/[a-z0-9'’-]+/g) ?? [];
}

const LINK_STOPWORDS = new Set(["the", "a", "an", "and", "or", "for", "of", "to", "in", "on", "with"]);

registerHandler("internal-link-suggestions", (p) => {
  const content = getString(p, "content", "");
  const links = getString(p, "links", "");
  const contentTokens = new Set(tokenize(content));
  const candidates = links
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      const tokens = tokenize(label);
      const matched = tokens.filter((t) => t.length > 2 && !LINK_STOPWORDS.has(t) && contentTokens.has(t));
      const score = matched.length / Math.max(1, tokens.length);
      return { label: label || url || "", url: url || "", matched, score };
    })
    .sort((a, b) => b.score - a.score);
  const output = candidates
    .map((c) => {
      const anchor = c.matched[0] ? c.matched[0] : c.label;
      const strength = c.score > 0.5 ? "strong" : c.score > 0 ? "possible" : "weak";
      return `[${anchor}](${c.url}) — ${strength} (${Math.round(c.score * 100)}% match)`;
    })
    .join("\n");
  return { candidates, output };
});

const KEYWORD_SEEDS = [
  "{t} for beginners", "how to {t}", "best {t} tools", "{t} tips and tricks",
  "{t} tutorial", "what is {t}", "{t} examples", "{t} guide 2026",
  "learn {t}", "{t} mistakes to avoid",
];

registerHandler("meta-keywords-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim().toLowerCase() || "seo";
  const list = shuffle(KEYWORD_SEEDS.map((k) => k.replaceAll("{t}", base)), seed);
  return { keywords: list, output: list.join(", ") };
});

registerHandler("heading-outline-generator", (p) => {
  const topic = getString(p, "topic", "");
  const subtopics = getString(p, "subtopics", "");
  const base = topic.trim() || "Topic";
  const subs = subtopics
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const mid = subs.length >= 2 ? subs.slice(0, 4) : ["What Is " + base + "?", "Why " + base + " Matters", "How to Get Started", "Common Mistakes"];
  return [
    `H1: ${base}`,
    "",
    ...mid.map((m) => `H2: ${m}`),
    "  H3: Key point",
    "  H3: Example / case study",
    "H2: Frequently Asked Questions",
    "H2: Final Takeaways",
  ].join("\n");
});

registerHandler("alt-text-generator", (p) => {
  const imageDescription = getString(p, "imageDescription", "");
  const context = getString(p, "context", "");
  const desc = imageDescription.trim();
  if (!desc) return "";
  const ctx = context.trim();
  const base = desc.replace(/[.!?]+$/, "");
  const options = [
    `A photo of ${base}${ctx ? ` in the context of ${ctx}` : ""}.`,
    `${base.charAt(0).toUpperCase() + base.slice(1)}, ${ctx ? `${ctx} — ` : ""}shown clearly for accessibility.`,
    `Illustration showing ${base}${ctx ? ` related to ${ctx}` : ""}.`,
  ];
  return { options, output: options.join("\n\n") };
});

registerHandler("content-brief-generator", (p) => {
  const topic = getString(p, "topic", "");
  const target = getString(p, "target", "");
  const wordTarget = Math.max(300, Math.min(5000, Math.round(getNumber(p, "wordTarget", 1200))));
  const base = topic.trim() || "your topic";
  const words = wordTarget;
  return [
    `Content brief: ${base}`,
    "",
    `Target: ${target.trim() || "readers new to the topic"}`,
    `Word count: ~${words} words`,
    `Reading level: conversational, clear`,
    "",
    "SEO keywords:",
    `  - ${base} guide`,
    `  - ${base} tips`,
    `  - how to ${base.toLowerCase()}`,
    "",
    "Structure:",
    "  H1: " + base,
    "  H2: Why this matters",
    "  H2: Step-by-step / core content",
    "  H2: Common questions",
    "  H2: Conclusion + CTA",
    "",
    "Requirements:",
    "  - Answer the primary question in the first 100 words",
    "  - Include at least 2 internal links",
    "  - Add an FAQ section",
    "  - 3+ headings and one table or list",
  ].join("\n");
});

registerHandler("faq-schema-generator", (p) => {
  const input = requireString(p, "input", "input");
  const questions: { q: string; a: string }[] = [];
  let currentQ: string | null = null;
  for (const line of input.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const qMatch = line.match(/^(?:Q\d*[.:)\s]*|Question[: ]*)(.+?)[?？]?\s*$/i);
    const aMatch = line.match(/^A\d*[.:)\s]+(.+)$/i);
    if (aMatch) {
      if (currentQ) {
        questions.push({ q: currentQ, a: aMatch[1].replace(/^"(.*)"$/, "$1") });
        currentQ = null;
      }
    } else if (qMatch && qMatch[1]) {
      currentQ = qMatch[1];
    }
  }
  if (questions.length === 0) {
    throw new Error("Add at least one Q&A pair, e.g. 'Q: What is this? A: It's a tool.'");
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return { questions, output: formatJSON(JSON.stringify(schema)) };
});

const PLATFORMS: Record<string, { label: string; max: number; icon: string }> = {
  all: { label: "All platforms", max: 20, icon: "🌐" },
  instagram: { label: "Instagram", max: 30, icon: "📸" },
  tiktok: { label: "TikTok", max: 8, icon: "🎵" },
  youtube: { label: "YouTube", max: 5, icon: "▶️" },
  x: { label: "X / Twitter", max: 3, icon: "🐦" },
  linkedin: { label: "LinkedIn", max: 5, icon: "💼" },
  facebook: { label: "Facebook", max: 5, icon: "📘" },
  threads: { label: "Threads", max: 30, icon: "🧵" },
};

const VIRAL_TAGS = [
  "viral", "trending", "explore", "reels", "shorts", "fyp", "foryou",
  "contentcreator", "creator", "instagood", "mustwatch",
];

const MODIFIERS = [
  "", "tips", "ideas", "inspo", "community", "life", "love", "goals",
  "content", "creator", "2026", "oftheday", "hacks", "motivation",
  "madeeasy", "tutorial", "tipsandtricks", "guide", "essentials", "daily",
];

function buildPool(keywords: string[]): string[] {
  const pool = new Set<string>();
  for (const kw of keywords) {
    const base = cleanTag(kw);
    if (!base) continue;
    for (const mod of MODIFIERS) {
      pool.add(mod ? `#${base}${mod}` : `#${base}`);
    }
  }
  for (const v of VIRAL_TAGS) pool.add(`#${v}`);
  return [...pool];
}

registerHandler("hashtag-generator", (p) => {
  const text = getString(p, "input", "");
  const platform = getString(p, "platform", "instagram");
  const keywords = text
    .split(/[\n,]/)
    .map((k) => k.trim())
    .filter(Boolean);
  const pool = buildPool(keywords);
  const max = PLATFORMS[platform]?.max ?? 20;
  const tags = pool.slice(0, max);
  return { tags, output: tags.join(" "), max };
});

function generateBios(name: string, role: string, extra: string): string[] {
  const n = name.trim();
  const r = role.trim();
  const e = extra.trim();
  const bios: string[] = [];

  if (n && r) {
    bios.push(`${n} — ${r}${e ? ` helping creators like you ${e}` : ""}. Let's build something great together. 🚀`);
  }
  bios.push(`${r ? `${capFirst(r)}` : "Creator"} by day, ${e || "dreamer"} by night. Sharing what I learn so you don't have to. ✨`);
  bios.push(`${n || "I"} help brands & creators ${e ? e : "grow and connect"} through ${r.toLowerCase() || "great content"}. DM for collabs! 📩`);
  bios.push(`${r ? capFirst(r) : "Creator"} • ${e ? e + " • " : ""}Making the internet a little more interesting, one post at a time.`);
  bios.push(
    n
      ? `${n} ✦ ${r.toLowerCase() || "creator"} ✦ ${e ? e + " ✦ " : ""}New content weekly 👇`
      : `Creator ✦ ${e ? e + " ✦ " : ""}New content weekly 👇`
  );
  return bios.filter((b) => b.length <= 160).slice(0, 4);
}

registerHandler("bio-generator", (p) => {
  const name = getString(p, "name", "");
  const role = getString(p, "role", "");
  const extra = getString(p, "extra", "");
  return generateBios(name, role, extra);
});

const CAPTION_TONES = {
  casual: {
    label: "Casual",
    openers: ["So I was thinking…", "Real talk:", "Quick one for you:"],
    closers: ["Anyway, that's it. Go be great. ✨", "Thoughts? Drop a comment 👇"],
  },
  inspiring: {
    label: "Inspiring",
    openers: ["Your story is your superpower.", "Every expert was once a beginner.", "Small steps. Big results."],
    closers: ["Keep showing up. It matters.", "You've got this. 💪"],
  },
  educational: {
    label: "Educational",
    openers: ["Here's how it actually works:", "3 things I wish I knew sooner:", "The short version:"],
    closers: ["Save this for later. 📌", "Follow for more breakdowns."],
  },
  professional: {
    label: "Professional",
    openers: ["I've been thinking about this for a while:", "Quick insight worth sharing:", "Key takeaway from a project I just finished:"],
    closers: ["Happy to discuss further in the comments.", "What's your experience been? Let's talk."],
  },
  fun: {
    label: "Fun & playful",
    openers: ["Plot twist:", "POV: you finally got it right", "Warning: contains 100% real content"],
    closers: ["Tag someone who needs to see this 😄", "10/10 would recommend."],
  },
};

registerHandler("caption-generator", (p) => {
  const topic = getString(p, "topic", "");
  const tone = getString(p, "tone", "casual");
  const cta = getString(p, "cta", "");
  const t = topic.trim();
  if (!t) return { captions: [], all: "" };
  const toneData = CAPTION_TONES[tone as keyof typeof CAPTION_TONES] ?? CAPTION_TONES.casual;
  const tags = [...new Set([`#${cleanTag(t)}`, "#creatorlife", ...VIRAL_TAGS])].slice(0, 8).join(" ");
  const ctaLine = cta.trim() ? `${cta.trim()} 👇` : "Comment your thoughts 👇";
  const captions = [0, 1, 2, 3].map((i) => {
    const opener = toneData.openers[i % toneData.openers.length];
    const closer = toneData.closers[i % toneData.closers.length];
    return [
      `${opener}`,
      ``,
      `Today I want to talk about ${t} — the part nobody mentions.`,
      `I've spent a lot of time on this so you don't have to.`,
      ``,
      `${closer}`,
      `${ctaLine}`,
      ``,
      tags,
    ].join("\n");
  });
  return { captions, all: captions.join("\n\n———\n\n") };
});

registerHandler("tweet-formatter", (p) => {
  const input = requireString(p, "input", "input");
  const cleaned = input
    .replace(/\r\n/g, "\n")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const length = cleaned.length;
  const over = Math.max(0, length - 280);
  const ok = length <= 280;
  const tweets = (() => {
    if (!cleaned) return [];
    const sentences = splitSentences(cleaned);
    const chunks: string[] = [];
    let buffer = "";
    for (const s of sentences) {
      if (buffer && (buffer + " " + s).length > 260) {
        chunks.push(buffer);
        buffer = s;
      } else {
        buffer = buffer ? buffer + " " + s : s;
      }
    }
    if (buffer) chunks.push(buffer);
    return chunks;
  })();
  const thread = tweets.map((t, i) => `${t}\n\n${i + 1}/${tweets.length}`).join("\n\n");
  return { cleaned, length, over, ok, tweets, thread };
});

registerHandler("thread-generator", (p) => {
  const text = requireString(p, "text", "text");
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let buffer = "";
  for (const s of sentences) {
    if (buffer && (buffer + " " + s).length > 240) {
      chunks.push(buffer);
      buffer = s;
    } else {
      buffer = buffer ? buffer + " " + s : s;
    }
  }
  if (buffer) chunks.push(buffer);
  const output = chunks.map((t, i) => `${t}\n\n${i + 1}/${chunks.length}`).join("\n\n");
  return { tweets: chunks, output };
});

const LINKEDIN_HASHTAGS = ["contentcreation", "creatoreconomy", "productivity", "marketing", "growth", "socialmedia"];

registerHandler("linkedin-formatter", (p) => {
  const input = requireString(p, "input", "input");
  const addHashtags = getBool(p, "addHashtags", true);
  let out = splitSentences(input).join("\n");
  if (addHashtags) {
    const tags = LINKEDIN_HASHTAGS.map((t) => `#${t}`).join(" ");
    out += `\n\n${tags}`;
  }
  return out;
});

function hashtagPool(niche: string): string[] {
  const base = cleanTag(niche);
  const variants = base
    ? [
        base,
        `${base}tips`,
        `${base}community`,
        `${base}life`,
        `${base}goals`,
        `${base}2026`,
      ]
    : [];
  return [...new Set([...variants, ...VIRAL_TAGS])].slice(0, 12);
}

registerHandler("instagram-caption-optimizer", (p) => {
  const caption = getString(p, "caption", "");
  const niche = getString(p, "niche", "");
  const addLineBreaks = getBool(p, "addLineBreaks", true);
  const addHashtags = getBool(p, "addHashtags", true);
  let out = caption.trim();
  if (addLineBreaks) {
    const sentences = splitSentences(out);
    const lines: string[] = [];
    let line = "";
    for (const s of sentences) {
      if (line && line.split(" ").length + s.split(" ").length > 14) {
        lines.push(line);
        line = s;
      } else {
        line = line ? `${line} ${s}` : s;
      }
    }
    if (line) lines.push(line);
    out = lines.join("\n");
  }
  if (addHashtags && niche.trim()) {
    out += `\n\n${hashtagPool(niche).map((t) => `#${t}`).join(" ")}`;
  }
  const length = out.length;
  return { output: out, length, underLimit: length <= 2200 };
});

const EMOJI_GROUPS: Record<string, string[]> = {
  Smileys: ["😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😜", "🤔", "😎", "🥳", "😢", "😭", "😤", "😴", "🤗", "🙃", "😉", "🤩", "🥰", "😇", "🤪", "😅", "🤯", "😳", "🙄"],
  Gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤙", "👏", "🙌", "🙏", "🤝", "💪", "👋", "🤘", "🖐️", "✋", "👊", "✊", "🤛", "🤜", "🫶"],
  People: ["👦", "👧", "🧑", "👨", "👩", "🧔", "👵", "👴", "👶", "🧒", "👮", "🕵️", "💂", "👷", "🤴", "👸", "🧙", "🧚", "🧛", "🧟"],
  Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦄", "🐝", "🦋", "🐢", "🐙", "🦑", "🐬", "🐳"],
  Food: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥭", "🍍", "🥥", "🥑", "🍅", "🥕", "🍞", "🧀", "🍔", "🍟", "🍕", "🌮", "🌯", "🍜", "🍣", "🍩", "🍪", "🎂", "🍰", "☕", "🍺"],
  Travel: ["✈️", "🚗", "🚕", "🚌", "🚲", "🏍️", "🚂", "🚀", "🚁", "⛵", "🚢", "🏔️", "🌋", "🏝️", "🏖️", "🏜️", "🌄", "🌅", "🌆", "🌃", "🗽", "🗼", "🏰", "🎡", "🎢"],
  Activities: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏓", "⛳", "🎣", "🎮", "🎲", "🎯", "🎳", "🏆", "🥇", "🥈", "🥉", "🎧", "🎤", "🎸", "🎺", "🎻", "🎹", "🎬", "🎨"],
  Objects: ["💡", "🔑", "🔒", "🔓", "🔔", "⏰", "📱", "💻", "🖥️", "⌨️", "🖱️", "📷", "🎥", "📞", "💾", "💿", "📀", "📚", "📖", "✏️", "📝", "✂️", "📌", "📎", "🔍"],
  Symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "💯", "🔥", "✨", "⭐", "🌟", "💫", "⚡", "💥", "💦", "🌈", "☀️", "🌙", "✅", "❄️", "🎉", "🎊", "✔️", "❌"],
  Flags: ["🏁", "🚩", "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷", "🇧🇷", "🇮🇳", "🇨🇳", "🇳🇱", "🇸🇪", "🇳🇴", "🇩🇰", "🇵🇹", "🇷🇺", "🇲🇽", "🇦🇷", "🇿🇦", "🇳🇬", "🇪🇬"],
};

registerHandler("emoji-picker", (p) => {
  const query = getString(p, "query", "").trim().toLowerCase();
  if (!query) return { groups: EMOJI_GROUPS };
  const filtered = Object.values(EMOJI_GROUPS)
    .flat()
    .filter((e) => e.toLowerCase().includes(query));
  return { groups: EMOJI_GROUPS, filtered };
});

const TIKTOK_FORMATS = [
  "POV: you just discovered {topic}",
  "3 things I wish I knew about {topic}",
  "Day 1 of mastering {topic}",
  "The {topic} hack that blew my mind 🤯",
  "Rating popular {topic} hacks",
  "What happens when you try {topic} for a week",
  "Comment your {topic} hot take 👇",
  "Transformation: {topic} before vs after",
];

registerHandler("tiktok-idea-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "productivity";
  return shuffle(TIKTOK_FORMATS.map((f) => f.replaceAll("{topic}", base)), seed).slice(0, 5);
});

const STORY_TEMPLATES = [
  "Swipe up for the {topic} trick I can't stop using ✨",
  "Sneak peek: behind the scenes of {topic} 🎬",
  "Poll time: {poll}",
  "Day {n} of sharing {topic} tips — today's tip:",
  "You asked, I answered: the truth about {topic}",
  "Quick {topic} tip for your next try 👉",
];

registerHandler("instagram-story-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "your niche";
  const n = 1 + (Math.abs(seed) % 30);
  return shuffle(
    STORY_TEMPLATES.map((f) =>
      f
        .replaceAll("{topic}", base)
        .replaceAll("{n}", String(n))
        .replaceAll("{poll}", `which ${base} style do you prefer?`)
    ),
    seed
  ).slice(0, 3);
});

const PIN_PATTERNS = [
  "{topic} Ideas That Actually Work",
  "The Ultimate {topic} Checklist",
  "10 {topic} Mistakes to Avoid",
  "How to {topic} in 5 Easy Steps",
  "Free Printable: {topic} Planner",
  "What I Learned About {topic}",
  "7 {topic} Tips for Busy People",
];

registerHandler("pinterest-title-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "diy";
  return shuffle(PIN_PATTERNS.map((pp) => pp.replaceAll("{topic}", base)), seed).slice(0, 5);
});

const POLL_TOPICS = ["content format", "tool", "feature", "schedule", "topic for next post", "aesthetic"];

registerHandler("poll-ideas-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || pick(POLL_TOPICS, seed);
  const a = shuffle(["Option A", "Option B", "Yes", "No", "This", "That", "Every day", "Once a week", "First option", "Second option"], seed).slice(0, 2);
  return `Poll: Which ${base} do you prefer?\n\n${a[0]}  vs  ${a[1]}`;
});

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SOCIAL_PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn", "X (Twitter)"];

registerHandler("content-calendar-generator", (p) => {
  const theme = getString(p, "theme", "");
  const base = theme.trim() || "brand";
  const lines: string[] = [`Weekly content calendar — theme: ${base}`, ""];
  const days = shuffle(WEEKDAYS, 1);
  const formats = ["post", "story", "video", "tip", "poll", "behind the scenes", "meme"];
  for (let i = 0; i < 7; i++) {
    const platform = SOCIAL_PLATFORMS[i % SOCIAL_PLATFORMS.length];
    lines.push(`${days[i]} — ${platform}: ${pick(formats, i + 3)} about ${base}`);
  }
  lines.push("", "Ideas are suggestions — adapt to what your audience responds to.");
  return lines.join("\n");
});

const IMG_STYLES: Record<string, string> = {
  photorealistic:
    "ultra photorealistic, shot on a full-frame camera, 85mm lens, f/1.8, shallow depth of field, natural skin texture",
  cinematic:
    "cinematic film still, anamorphic lens, dramatic lighting, rich color grading, movie-quality composition",
  anime:
    "beautiful anime art style, Studio Ghibli inspired, cel shading, expressive eyes, vibrant color palette",
  "3d":
    "high-quality 3D render, octane render, soft global illumination, Pixar-style character design",
  digital:
    "detailed digital painting, intricate matte painting, concept art, high polish, fantasy art",
  watercolor:
    "delicate watercolor painting, soft color washes, textured paper grain, hand-painted feel",
  isometric:
    "clean isometric illustration, bold vector shapes, flat colors with subtle gradients, modern minimal",
  minimalist:
    "minimalist composition, negative space, clean lines, muted color palette, elegant simplicity",
};

const IMG_LIGHTING: Record<string, string> = {
  golden: "golden hour lighting, warm directional sunlight, long soft shadows",
  studio: "soft professional studio lighting, ring light catchlights, even exposure",
  dramatic: "dramatic chiaroscuro lighting, strong contrast, deep shadows",
  neon: "vibrant neon lighting, cyberpunk atmosphere, reflective surfaces",
  natural: "soft natural daylight, diffused window light, airy and bright",
  night: "moody night scene, moonlight, subtle rim lighting, atmospheric haze",
};

const IMG_QUALITIES = [
  "highly detailed, 8K, sharp focus, masterpiece",
  "professional, crisp details, best quality",
  "detailed, 4K, clean edges, high fidelity",
];

registerHandler("image-prompt-enhancer", (p) => {
  const idea = getString(p, "idea", "");
  const style = getString(p, "style", "photorealistic");
  const lighting = getString(p, "lighting", "golden");
  const quality = getString(p, "quality", IMG_QUALITIES[0]);
  const prompt = [idea.trim(), IMG_STYLES[style], IMG_LIGHTING[lighting], quality]
    .filter(Boolean)
    .join(", ");
  return { prompt, length: prompt.length, estimatedTokens: Math.round(prompt.length / 4) };
});

const STYLE_NEGATIVES: Record<string, string[]> = {
  portrait: ["deformed hands", "extra fingers", "distorted face", "bad anatomy", "crossed eyes"],
  animal: ["malformed legs", "extra limbs", "deformed paws", "wrong anatomy"],
  landscape: ["oversaturated sky", "distorted horizon", "fused elements"],
  general: ["disfigured", "poorly drawn", "extra limbs", "body out of frame"],
};

const COMMON_NEGATIVES = [
  "blurry", "low quality", "low resolution", "jpeg artifacts", "watermark", "text",
  "signature", "logo", "duplicate", "morphed", "ugly", "deformed", "worst quality",
  "bad composition", "oversaturated", "cluttered background",
];

registerHandler("negative-prompt-generator", (p) => {
  const subject = getString(p, "subject", "portrait");
  const custom = getString(p, "custom", "");
  const extras = STYLE_NEGATIVES[subject] ?? STYLE_NEGATIVES.general;
  const all = [...COMMON_NEGATIVES, ...extras];
  if (custom.trim()) {
    all.push(
      ...custom
        .split(/[\n,]/)
        .map((c) => c.trim())
        .filter(Boolean)
    );
  }
  return all.join(", ");
});

const COMMON_RATIOS: { name: string; ratio: number }[] = [
  { name: "16:9", ratio: 16 / 9 },
  { name: "9:16", ratio: 9 / 16 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "3:4", ratio: 3 / 4 },
  { name: "3:2", ratio: 3 / 2 },
  { name: "2:3", ratio: 2 / 3 },
  { name: "1:1", ratio: 1 },
  { name: "21:9", ratio: 21 / 9 },
  { name: "5:4", ratio: 5 / 4 },
  { name: "4:5", ratio: 4 / 5 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

registerHandler("aspect-ratio-calculator", (p) => {
  const width = getNumber(p, "width", 1920);
  const height = getNumber(p, "height", 1080);
  const g = gcd(width, height);
  const simplified = `${width / g}:${height / g}`;
  const decimal = width / height;
  let nearest = COMMON_RATIOS[0];
  let diff = Math.abs(nearest.ratio - decimal);
  for (const r of COMMON_RATIOS) {
    const d = Math.abs(r.ratio - decimal);
    if (d < diff) {
      diff = d;
      nearest = r;
    }
  }
  return { simplified, decimal, nearest: nearest.name };
});

interface PromptStyle {
  name: string;
  medium: string;
  fragment: string;
  example: string;
}

const PROMPT_STYLES: PromptStyle[] = [
  { name: "Photorealistic", medium: "Photography", fragment: "ultra photorealistic, shot on a full-frame camera, 85mm lens, f/1.8, shallow depth of field, natural skin texture, professional retouching", example: "a portrait of a woman in a sunlit cafe" },
  { name: "Cinematic", medium: "Film still", fragment: "cinematic film still, anamorphic lens, dramatic lighting, rich color grading, movie-quality composition, 35mm film grain", example: "a lone figure walking through rain-soaked neon streets" },
  { name: "Anime", medium: "Anime", fragment: "beautiful anime art style, Studio Ghibli inspired, cel shading, expressive eyes, vibrant color palette, detailed background", example: "a young girl flying a kite over a grassy hill" },
  { name: "3D Render", medium: "3D render", fragment: "high-quality 3D render, octane render, soft global illumination, Pixar-style character design, subsurface scattering", example: "a friendly robot tending a rooftop garden" },
  { name: "Digital Painting", medium: "Concept art", fragment: "detailed digital painting, intricate matte painting, concept art, high polish, fantasy art, rich textures", example: "an ancient floating city above the clouds" },
  { name: "Watercolor", medium: "Watercolor painting", fragment: "delicate watercolor painting, soft color washes, textured paper grain, hand-painted feel, gentle color bleed", example: "a cozy cabin in a snowy pine forest" },
  { name: "Isometric", medium: "Illustration", fragment: "clean isometric illustration, bold vector shapes, flat colors with subtle gradients, modern minimal, crisp edges", example: "a tiny workspace desk with plants and a laptop" },
  { name: "Minimalist", medium: "Design", fragment: "minimalist composition, negative space, clean lines, muted color palette, elegant simplicity, editorial design", example: "a single white vase on a beige pedestal" },
  { name: "Cyberpunk", medium: "Digital art", fragment: "cyberpunk aesthetic, neon lights, futuristic cityscape, holographic elements, high contrast, rainy reflective streets", example: "a cyber-enhanced courier on a neon-lit motorcycle" },
  { name: "Fantasy", medium: "Concept art", fragment: "epic fantasy concept art, sweeping vistas, magical atmosphere, painterly style, dramatic scale, luminous details", example: "a wizard standing before a glowing portal" },
  { name: "Sci-Fi", medium: "Concept art", fragment: "hard sci-fi concept art, futuristic technology, sleek design, spacecraft interior, volumetric lighting, cinematic scale", example: "a space station docking bay at golden hour" },
  { name: "Vintage", medium: "Film photography", fragment: "vintage film photograph, 1970s aesthetic, Kodak Portra, warm faded tones, soft grain, nostalgic mood", example: "a classic car at a roadside diner" },
  { name: "Low Poly", medium: "3D art", fragment: "low poly 3D art, faceted geometry, bright pastel colors, clean minimal shapes, stylized, soft shadows", example: "a low poly mountain range with a river" },
  { name: "Pixel Art", medium: "Pixel art", fragment: "detailed pixel art, 16-bit retro style, crisp pixels, vibrant limited palette, game sprite aesthetic", example: "a tiny village market in the evening" },
  { name: "Line Art", medium: "Illustration", fragment: "clean line art, bold black outlines, minimal shading, flat color fills, modern sticker style", example: "a fox with geometric patterns" },
  { name: "Surrealism", medium: "Surreal art", fragment: "surrealist composition, dreamlike atmosphere, impossible perspectives, melding organic forms, ethereal lighting", example: "an elephant with a floating island on its back" },
];

registerHandler("prompt-style-library", (p) => {
  const subject = getString(p, "subject", "");
  const selected = Math.max(0, Math.min(PROMPT_STYLES.length - 1, Math.round(getNumber(p, "selected", 0))));
  const style = PROMPT_STYLES[selected];
  const parts = [subject.trim(), style.fragment].filter(Boolean);
  return { styles: PROMPT_STYLES, selected: style, prompt: parts.join(", ") };
});

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

type SchemeId = "analogous" | "complementary" | "triadic" | "monochromatic";

const SCHEMES: Record<SchemeId, string> = {
  analogous: "Analogous",
  complementary: "Complementary",
  triadic: "Triadic",
  monochromatic: "Monochromatic",
};

function buildPalette(hue: number, scheme: SchemeId): string[] {
  switch (scheme) {
    case "analogous":
      return [hue, hue + 30, hue - 30, hue + 60, hue - 60].map((h) => hslToHex(h, 65, 55));
    case "complementary":
      return [hue, hue + 180, hue + 30, hue + 210, hue + 180].map((h, i) => hslToHex(h, 60 + (i === 4 ? 15 : 0), 55));
    case "triadic":
      return [hue, hue + 120, hue + 240, hue + 60, hue + 180].map((h) => hslToHex(h, 65, 55));
    case "monochromatic":
      return [0, 1, 2, 3, 4].map((i) => hslToHex(hue, 25 + i * 12, 30 + i * 14));
  }
}

registerHandler("color-palette-generator", (p) => {
  const hue = getNumber(p, "hue", 262);
  const scheme = getString(p, "scheme", "analogous") as SchemeId;
  const s = SCHEMES[scheme] ? scheme : "analogous";
  const palette = buildPalette(hue, s);
  const cssOutput = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
  const downloadOutput = [
    `/* Creator Toolkit palette · ${SCHEMES[s]} */`,
    `:root {`,
    cssOutput,
    `}`,
  ].join("\n");
  return { palette, hex: palette.join(" "), css: cssOutput, download: downloadOutput };
});

const RANDOM_SUBJECTS = [
  "a fox reading a book in a forest",
  "a astronaut floating above a coral reef",
  "a tiny dragon warming itself by a campfire",
  "a barista serving coffee in a floating café",
  "a cat astronaut on the moon",
  "a lighthouse on a cliff during a storm",
  "a robot chef cooking in a cozy kitchen",
  "a samurai watching cherry blossoms fall",
  "a fox sleeping on a stack of old books",
  "a hot air balloon over lavender fields",
  "a street musician playing in neon rain",
  "a whale swimming through clouds",
];

const RANDOM_STYLES = PROMPT_STYLES.map((s) => s.fragment);
const RANDOM_LIGHTING = [
  "golden hour lighting", "soft studio lighting", "dramatic chiaroscuro lighting",
  "vibrant neon lighting", "soft natural daylight", "moody night scene with moonlight",
  "warm candlelight", "overcast diffused light",
];
const RANDOM_CAMERAS = [
  "shot on a full-frame camera, 85mm lens", "shot on a medium format camera, 50mm lens",
  "wide angle 24mm lens", "telephoto 200mm lens", "shot on 35mm film", "aerial drone shot",
];
const RANDOM_ARTISTS = [
  "inspired by studio Ghibli", "in the style of cinematic concept art",
  "reminiscent of classic Dutch masters", "inspired by modern impressionism",
  "in the style of retro sci-fi posters", "inspired by fashion editorial photography",
];
const RANDOM_QUALITY = [
  "highly detailed, 8K, sharp focus, masterpiece", "professional, crisp details, best quality",
  "detailed, 4K, clean edges, high fidelity",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

registerHandler("prompt-randomizer", () => {
  const prompts = Array.from({ length: 3 }, () =>
    [
      pickRandom(RANDOM_SUBJECTS),
      pickRandom(RANDOM_STYLES),
      pickRandom(RANDOM_LIGHTING),
      pickRandom(RANDOM_CAMERAS),
      pickRandom(RANDOM_ARTISTS),
      pickRandom(RANDOM_QUALITY),
    ].join(", ")
  );
  return { prompts, output: prompts.join("\n\n") };
});

const LIGHT_TYPES = {
  golden: { label: "Golden hour", prompt: "golden hour lighting, warm soft sunlight, long shadows" },
  soft: { label: "Soft diffused", prompt: "soft diffused lighting, overcast sky, gentle even illumination" },
  studio: { label: "Studio strobes", prompt: "professional studio lighting, softbox key light, crisp highlights" },
  neon: { label: "Neon / cyberpunk", prompt: "neon lighting, cyan and magenta glow, reflective surfaces" },
  dramatic: { label: "Dramatic / chiaroscuro", prompt: "dramatic chiaroscuro lighting, strong contrast, deep shadows" },
  backlight: { label: "Backlight", prompt: "backlit silhouette, rim light, glowing outline" },
  candle: { label: "Candlelight", prompt: "warm candlelight, flickering amber glow, intimate mood" },
};

registerHandler("lighting-prompt-generator", (p) => {
  const subject = getString(p, "subject", "");
  const type = getString(p, "type", "golden");
  const seed = getNumber(p, "seed", 1);
  const base = subject.trim() || "the subject";
  const light = LIGHT_TYPES[type as keyof typeof LIGHT_TYPES]?.prompt ?? LIGHT_TYPES.golden.prompt;
  const intros = [
    `A photo of ${base}, ${light}, photorealistic, 8k`,
    `${light}, ${base}, captured on a 50mm lens, shallow depth of field`,
  ];
  return intros[Math.abs(seed) % 2];
});

const CAMERA_SETTINGS = [
  { label: "Portrait 50mm", prompt: "50mm f/1.8, ISO 200, 1/250s, shallow depth of field, eye-level angle" },
  { label: "Wide landscape 24mm", prompt: "24mm f/8, ISO 100, 1/125s, deep focus, high dynamic range" },
  { label: "Street 35mm", prompt: "35mm f/4, ISO 800, 1/500s, candid framing, natural perspective" },
  { label: "Macro 100mm", prompt: "100mm macro f/2.8, ISO 400, 1/200s, extreme close-up detail" },
  { label: "Telephoto 135mm", prompt: "135mm f/2, ISO 100, 1/1000s, compressed background, creamy bokeh" },
];

registerHandler("camera-settings-generator", (p) => {
  const subject = getString(p, "subject", "");
  const preset = Math.max(0, Math.min(CAMERA_SETTINGS.length - 1, Math.round(getNumber(p, "preset", 0))));
  const base = subject.trim() || "the scene";
  const cam = CAMERA_SETTINGS[preset];
  return `${base}, ${cam.prompt}`;
});

registerHandler("lora-prompt-generator", (p) => {
  const style = getString(p, "style", "");
  const trigger = getString(p, "trigger", "trigger words");
  const weight = getNumber(p, "weight", 1);
  const base = style.trim() || "my style";
  const triggerWords = trigger.trim() || "trigger words";
  const wrapped = weight !== 1 ? `((${triggerWords}))` : triggerWords;
  return `${base}, ${wrapped}, detailed, high quality`;
});

const EXTENSIONS = [
  "intricate details, ultra detailed",
  "dramatic lighting, cinematic atmosphere",
  "masterpiece, best quality, 8k",
  "sharp focus, high contrast",
  "professional color grading, film grain",
  "smooth gradients, rich textures",
  "wide dynamic range, lifelike",
  "subtle reflections, ambient occlusion",
];

registerHandler("prompt-extender", (p) => {
  const base = requireString(p, "base", "base").trim();
  if (!base) return "";
  const seed = getNumber(p, "seed", 1);
  const extras = [...EXTENSIONS];
  const picked: string[] = [];
  let s = Math.abs(seed) || 1;
  for (let i = 0; i < 3 && extras.length; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = s % extras.length;
    picked.push(extras.splice(idx, 1)[0]);
  }
  return `${base}, ${picked.join(", ")}`;
});

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

registerHandler("json-compare", (p) => {
  const a = requireString(p, "a", "a");
  const b = requireString(p, "b", "b");
  const errA = jsonError(a);
  const errB = jsonError(b);
  if (errA || errB) throw new Error(errA ?? errB ?? "Invalid JSON");
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
  const lines: string[] = [`JSON Compare Report`, ``];
  if (equal > 0) lines.push(`${equal} matching path${equal === 1 ? "" : "s"}`);
  if (onlyA.length) {
    lines.push(``, `Only in A (${onlyA.length}):`);
    lines.push(...onlyA.map((k) => `  - ${k}`));
  }
  if (onlyB.length) {
    lines.push(``, `Only in B (${onlyB.length}):`);
    lines.push(...onlyB.map((k) => `  + ${k}`));
  }
  if (changed.length) {
    lines.push(``, `Different values (${changed.length}):`);
    lines.push(...changed.map((c) => `  ~ ${c.path}\n      A: ${c.a}\n      B: ${c.b}`));
  }
  if (!onlyA.length && !onlyB.length && !changed.length) {
    lines.push(``, "The two JSON structures are identical.");
  }
  return { equal, onlyA, onlyB, changed, output: lines.join("\n") };
});

interface XToken {
  type: "open" | "close" | "self" | "comment" | "cdata" | "doctype" | "pi" | "text";
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
      if (inner.startsWith("!")) tokens.push({ type: "doctype", raw, name: "" });
      else if (inner.startsWith("?")) tokens.push({ type: "pi", raw, name: "" });
      else if (inner.startsWith("/")) tokens.push({ type: "close", raw, name: inner.slice(1).trim().split(/\s+/)[0] });
      else if (inner.endsWith("/")) {
        tokens.push({ type: "self", raw, name: inner.slice(0, -1).trim().split(/\s+/)[0] });
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
    return { out: lines.join("\n"), error: `Unclosed tag <${stack[stack.length - 1]}>` };
  }
  return { out: lines.join("\n"), error: null };
}

registerHandler("xml-formatter", (p) => {
  const input = requireString(p, "input", "input");
  return formatMarkup(tokenizeMarkup(input), false);
});

registerHandler("html-formatter", (p) => {
  const input = requireString(p, "input", "input");
  return formatMarkup(tokenizeMarkup(input), true);
});

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

registerHandler("css-beautifier", (p) => {
  const input = requireString(p, "input", "input");
  return formatCSS(input);
});

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

registerHandler("sql-formatter", (p) => {
  const input = requireString(p, "input", "input");
  const uppercase = getBool(p, "uppercase", true);
  return formatSQL(input, uppercase);
});

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

registerHandler("regex-tester", (p) => {
  const pattern = getString(p, "pattern", "");
  const text = getString(p, "text", "");
  const flagsObj = (getString(p, "flags", "g") || "g").split("");
  const flags = ["g", "i", "m", "s"].filter((f) => flagsObj.includes(f)).join("");
  const { matches, error } = runRegex(pattern, flags, text);
  const segments = (() => {
    if (error || !pattern) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
      parts.push({ text: m.full, match: true });
      last = m.index + m.full.length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
  })();
  const output = matches.map((m) => m.full).join("\n");
  const details = matches
    .map((m, i) => {
      const groups =
        m.groups.length > 0
          ? ` · groups: ${m.groups.map((g) => g ?? "(none)").join(", ")}`
          : "";
      return `${i + 1}. ${m.full} @ ${m.index}${groups}`;
    })
    .join("\n");
  return { matches, error, segments, output, details };
});

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

registerHandler("jwt-decoder", (p) => {
  const token = requireString(p, "token", "token").trim();
  const parts = token.split(".");
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
    return { error: null, header, payload, claims, signature: parts[2] ?? null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not decode JWT.",
      header: null,
      payload: null,
      claims: [],
    };
  }
});

registerHandler("timestamp-converter", (p) => {
  const input = getString(p, "input", "").trim();
  if (!input) throw new Error("timestamp is required.");
  const numeric = Number(input);
  let date: Date | null = null;
  if (!Number.isNaN(numeric)) {
    const ms = numeric > 1e12 ? numeric : numeric * 1000;
    date = new Date(ms);
  } else {
    const parsed = new Date(input);
    date = Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (!date) throw new Error("Could not parse that as a timestamp or date.");
  const result = {
    utc: date.toISOString(),
    local: date.toLocaleString(),
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    iso: date.toISOString().replace("T", " ").slice(0, 19) + "Z",
  };
  const output = [
    `Unix timestamp (seconds): ${result.unixSeconds}`,
    `Unix timestamp (milliseconds): ${result.unixMs}`,
    `ISO 8601: ${result.utc}`,
    `UTC: ${result.utc}`,
    `Local: ${result.local}`,
  ].join("\n");
  return { ...result, output };
});

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

registerHandler("color-converter", (p) => {
  const input = getString(p, "input", "").trim();
  if (!input) throw new Error("color is required.");
  let rgb: { r: number; g: number; b: number } | null = null;
  if (HEX_RE.test(input)) {
    rgb = hexToRgb(input);
  } else {
    const m = input.match(RGB_RE);
    if (m) rgb = { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  }
  if (!rgb) throw new Error("Invalid color format.");
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
    css: `rgb(${rgb.r} ${rgb.g} ${rgb.b})`,
  };
});

registerHandler("json-to-csv", (p) => {
  const input = requireString(p, "input", "input");
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Invalid JSON");
  }
  const arr = Array.isArray(parsed) ? parsed : [parsed];
  if (arr.length === 0) return "";
  const objects = arr.filter((x) => x !== null && typeof x === "object");
  if (objects.length === 0) throw new Error("JSON must contain objects.");
  const keys = [...new Set(objects.flatMap((o) => Object.keys(o)))];
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...objects.map((o) => keys.map((k) => esc(o[k])).join(","))].join("\n");
});

function parseCsvRow(line: string): string[] {
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
}

registerHandler("csv-to-json", (p) => {
  const input = requireString(p, "input", "input");
  const hasHeader = getBool(p, "hasHeader", true);
  const lines = input.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return "";
  const rows = lines.map(parseCsvRow);
  const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
  const data = hasHeader ? rows.slice(1) : rows;
  const json = data.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
  return JSON.stringify(json, null, 2);
});

registerHandler("json-to-yaml", (p) => {
  const input = requireString(p, "input", "input");
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : "Invalid JSON");
  }
  const lines: string[] = [];
  const needsQuote = (s: string) => /^[\s-]|[:#\[\]{},&*!|>'"%@`]|:\s/.test(s) || s === "";
  const scalar = (v: unknown) =>
    typeof v === "string" ? (needsQuote(v) ? JSON.stringify(v) : v) : String(v);
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
  return lines.join("\n");
});

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

registerHandler("password-strength-checker", (p) => {
  const password = requireString(p, "password", "password");
  return scorePassword(password);
});

registerHandler("ai-token-calculator", (p) => {
  const text = getString(p, "input", "");
  const chars = text.length;
  const words = wordCount(text);
  const perModel = TOKEN_MODELS.map((m) => ({
    model: m.id,
    name: m.name,
    provider: m.provider,
    tokens: estimateTokens(text, m),
  }));
  const maxTokens = Math.max(0, ...perModel.map((m) => m.tokens));
  return {
    chars,
    words,
    averageTokens: Math.ceil(chars / 4),
    maxTokens,
    models: perModel,
  };
});

registerHandler("ai-cost-calculator", (p) => {
  const prompt = getString(p, "prompt", "");
  const outputChars = getNumber(p, "outputChars", 500);
  const modelId = getString(p, "modelId", "gpt-4o");
  const selected = TOKEN_MODELS.find((m) => m.id === modelId) ?? TOKEN_MODELS[0];
  const inputTokens = estimateTokens(prompt, selected);
  const outputTokens = Math.round(outputChars / selected.charsPerToken);
  const cost = estimateCost(inputTokens, outputTokens, selected);
  const models = TOKEN_MODELS.map((m) => {
    const inTokens = estimateTokens(prompt, m);
    const outTokens = Math.round(outputChars / m.charsPerToken);
    const c = estimateCost(inTokens, outTokens, m);
    return { id: m.id, name: m.name, provider: m.provider, inputTokens: inTokens, outputTokens: outTokens, cost: c };
  });
  const summary =
    `Prompt: ${formatNumber(inputTokens)} input tokens\n` +
    `Output: ${formatNumber(outputTokens)} tokens\n` +
    `Model: ${selected.name} (${selected.provider})\n` +
    `Est. cost: $${cost.toFixed(6)}`;
  return { inputTokens, outputTokens, cost, model: selected, models, summary };
});

registerHandler("prompt-formatter", (p) => {
  const role = getString(p, "role", "");
  const task = getString(p, "task", "");
  const context = getString(p, "context", "");
  const constraints = getString(p, "constraints", "");
  const outputFormat = getString(p, "outputFormat", "");
  const examples = getString(p, "examples", "");
  const tone = getString(p, "tone", "");
  const sections: string[] = [];
  if (role.trim()) sections.push(`## Role\n${role.trim()}`);
  if (task.trim()) sections.push(`## Task\n${task.trim()}`);
  if (context.trim()) sections.push(`## Context\n${context.trim()}`);
  if (constraints.trim()) {
    const lines = constraints
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `- ${l}`);
    sections.push(`## Constraints\n${lines.join("\n")}`);
  }
  if (outputFormat.trim()) sections.push(`## Output Format\n${outputFormat.trim()}`);
  if (examples.trim()) sections.push(`## Examples\n${examples.trim()}`);
  if (tone.trim()) sections.push(`## Tone\n${tone.trim()}`);
  const output = sections.join("\n\n");
  return { output, sections: output ? output.split("\n## ").length : 0, estimatedTokens: Math.round(output.length / 4) };
});

const WEAK_WORDS = ["some", "things", "stuff", "maybe", "etc", "whatever", "something"];
const CONSTRAINT_WORDS = ["must", "only", "limit", "avoid", "exactly", "max", "minimum", "do not", "don't", "no more"];

registerHandler("prompt-optimizer", (p) => {
  const raw = requireString(p, "prompt", "prompt").trim();
  if (!raw) return { optimized: "", improvements: [], tokens: 0 };

  const improvements: { title: string; description: string }[] = [];
  let out = raw;
  let prefix = "";

  if (!/^(you are|you're|act as|imagine you|pretend)/i.test(raw)) {
    prefix = "You are a helpful, precise assistant. ";
    improvements.push({
      title: "Added a role",
      description: "Framing the AI as a capable assistant improves output quality.",
    });
  }

  const weak = WEAK_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(raw));
  if (weak.length > 0) {
    improvements.push({
      title: "Vague words detected",
      description: `Replace "${weak.join(", ")}" with concrete details for sharper results.`,
    });
  }

  const hasConstraint = CONSTRAINT_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(raw));
  if (!hasConstraint) {
    out = `${out}\n\nConstraints: Be specific, avoid fluff, and stay on topic.`;
    improvements.push({
      title: "Added constraints",
      description: "Explicit limits reduce hallucination and scope creep.",
    });
  }

  const hasFormat = /(?:output|format|structure|as a list|in json|table|bullet|step)\b/i.test(raw);
  if (!hasFormat) {
    out = `${out}\n\nOutput: Provide a clear, well-structured answer.`;
    improvements.push({
      title: "Specified output format",
      description: "Telling the model how to answer makes results more usable.",
    });
  }

  const hasExample = /\b(?:example|for instance|like this|e\.g\.)\b/i.test(raw);
  if (!hasExample) {
    improvements.push({
      title: "Consider adding an example",
      description: "One example can dramatically improve consistency — add one if possible.",
    });
  }

  out = `${prefix}${out}\n\nReview your work against the request before answering.`;
  improvements.push({
    title: "Added self-review step",
    description: "Prompting a quick review reduces obvious mistakes.",
  });

  return { optimized: out, improvements, tokens: Math.round(out.length / 4) };
});

const OUTPUT_TYPES = [
  { id: "paragraphs", label: "Paragraphs" },
  { id: "list", label: "Bullet list" },
  { id: "steps", label: "Step-by-step" },
  { id: "table", label: "Table" },
  { id: "json", label: "JSON" },
  { id: "short", label: "Short answer" },
];

registerHandler("prompt-generator", (p) => {
  const task = requireString(p, "task", "task").trim();
  const domain = getString(p, "domain", "");
  const audience = getString(p, "audience", "");
  const outputType = getString(p, "outputType", "paragraphs");
  const d = domain.trim();
  const a = audience.trim();
  const fmt = OUTPUT_TYPES.find((o) => o.id === outputType)?.label.toLowerCase() ?? "a clear answer";
  const parts: string[] = [];
  parts.push(
    d
      ? `You are an expert in ${d} with deep, practical knowledge.`
      : "You are a helpful, precise assistant with broad expertise."
  );
  parts.push("");
  parts.push(`Your task: ${task}.`);
  if (a) parts.push(`The audience is: ${a}.`);
  parts.push("");
  parts.push("Constraints:");
  parts.push("- Be accurate, specific, and well-organized.");
  parts.push("- Avoid fluff, filler, and unsupported claims.");
  parts.push("- Keep it actionable and easy to follow.");
  parts.push("");
  parts.push(`Output format: respond as ${fmt}.`);
  parts.push("Review your answer against the task before finishing.");
  return parts.join("\n");
});

interface PromptTemplate {
  title: string;
  category: string;
  prompt: string;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  { title: "Blog post outline", category: "Writing", prompt: "You are an SEO content strategist. Create a detailed outline for a blog post about {topic} targeting {audience}. Include a working title, an intro angle, 5-7 main sections with sub-points, and a conclusion with a call to action." },
  { title: "Email reply", category: "Writing", prompt: "You are a professional but warm communicator. Draft a reply to this email: {email}. Match the tone of the sender, address every point, and end with a clear next step." },
  { title: "Product description", category: "Marketing", prompt: "You are a persuasive copywriter. Write a product description for {product} aimed at {audience}. Highlight the top 3 benefits, use sensory language, and close with a soft call to action. Keep it under 120 words." },
  { title: "Social media post", category: "Marketing", prompt: "You are a social media manager. Write 3 short caption options for {platform} about {topic}. Each should have a hook, a value line, and a call to action. Vary the tone between friendly, bold, and playful." },
  { title: "Code review", category: "Coding", prompt: "You are a senior software engineer. Review this code snippet for bugs, performance issues, and readability: {code}. List issues by severity and suggest concrete fixes with code." },
  { title: "Bug fixer", category: "Coding", prompt: "You are an expert debugger. Here is the code and the error: {error}. Explain the root cause simply, then provide a corrected version with a short note on why it was wrong." },
  { title: "Summarize article", category: "Research", prompt: "You are a research assistant. Summarize the following article in 3 sentences: {article}. Then list the 3 strongest arguments and 1 potential weakness." },
  { title: "Study plan", category: "Research", prompt: "You are a learning coach. Create a 4-week study plan to learn {topic} for a complete beginner. Break it into weekly goals, daily tasks, and checkpoints." },
  { title: "Meeting agenda", category: "Business", prompt: "You are an operations consultant. Build a 30-minute meeting agenda for {meeting purpose}. Include objectives, time-boxed topics, owners, and a clear decision list." },
  { title: "Cold pitch", category: "Business", prompt: "You are a growth marketer. Write a short cold outreach message to {prospect} about {offer}. Start with a personalized opener, state the value, and ask one clear question. Under 120 words." },
  { title: "Video script hook", category: "Creative", prompt: "You are a YouTube scriptwriter. Write 5 opening hooks for a video about {topic}. Each hook should be under 15 words and designed to stop the scroll." },
  { title: "Story starter", category: "Creative", prompt: "You are a fiction writer. Write 3 first lines for a story about {topic} in different genres: mystery, romance, and sci-fi. Each line should create immediate intrigue." },
];

registerHandler("prompt-library", (p) => {
  const category = getString(p, "category", "");
  const templates = category
    ? PROMPT_TEMPLATES.filter((t) => t.category === category)
    : PROMPT_TEMPLATES;
  return templates;
});

function scorePrompt(prompt: string): {
  score: number;
  checks: { label: string; pass: boolean; tip: string }[];
} {
  const checks: { label: string; pass: boolean; tip: string }[] = [];

  const imperative = /\b(write|create|generate|explain|list|describe|summarize|analyze|draft|convert|fix|review)\b/i.test(prompt);
  checks.push({
    label: "Clear instruction",
    pass: imperative,
    tip: imperative ? "" : "Start with a strong action verb (write, create, explain…).",
  });

  const specific = /\d|specific|exactly|precisely|\b(new|old|best|top)\b/i.test(prompt);
  checks.push({
    label: "Specific & detailed",
    pass: specific,
    tip: specific ? "" : "Add numbers, names, or concrete details to remove ambiguity.",
  });

  const constrained = CONSTRAINT_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(prompt));
  checks.push({
    label: "Constraints given",
    pass: constrained,
    tip: constrained ? "" : "Add limits like length, tone, or things to avoid.",
  });

  const examples = /\b(example|for instance|e\.g\.|like this|sample)\b/i.test(prompt);
  checks.push({
    label: "Examples included",
    pass: examples,
    tip: examples ? "" : "Including one example improves output consistency.",
  });

  const format = /(?:output|format|as a |in json|list|table|bullet|paragraph|steps?)\b/i.test(prompt);
  checks.push({
    label: "Output format defined",
    pass: format,
    tip: format ? "" : "Tell the AI how to format the answer.",
  });

  const len = prompt.trim().length;
  let lenPass = len >= 30;
  if (len === 0) lenPass = false;
  checks.push({
    label: "Good length",
    pass: lenPass,
    tip:
      len === 0
        ? "Enter a prompt to test it."
        : len < 30
          ? "Prompt is very short — add context."
          : len > 1500
            ? "Very long — consider splitting into steps."
            : "",
  });

  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { score, checks };
}

registerHandler("ai-prompt-tester", (p) => {
  const prompt = requireString(p, "prompt", "prompt");
  const result = scorePrompt(prompt);
  return {
    ...result,
    characters: prompt.length,
    estimatedTokens: Math.round(prompt.length / 4),
    words: prompt.trim() ? prompt.trim().split(/\s+/).length : 0,
  };
});

const IMG_MEDIA = [
  "photograph", "digital painting", "3D render", "anime illustration",
  "vector illustration", "pixel art", "oil painting", "watercolor painting",
];

const IMG_STYLE_OPTS = [
  "photorealistic", "cinematic", "minimalist", "surreal", "isometric",
  "cyberpunk", "fantasy", "vintage", "low poly", "flat design",
];

const IMG_LIGHT_OPTS = [
  "golden hour lighting", "soft studio lighting", "dramatic chiaroscuro",
  "neon lighting", "candlelight", "overcast diffused light", "moonlight",
  "backlit silhouette",
];

const IMG_COLORS = [
  "vibrant saturated colors", "soft pastel palette", "monochrome black and white",
  "muted earth tones", "neon color palette", "high contrast", "sepia tones",
  "teal and orange grade",
];

const IMG_CAMERAS = [
  "shot on full-frame DSLR, 85mm f/1.8", "shot on medium format, 50mm lens",
  "wide angle 24mm", "telephoto 200mm", "aerial drone shot",
  "macro lens, extreme close-up", "long exposure",
];

const IMG_MOODS = [
  "calm and serene", "epic and grand", "mysterious", "joyful",
  "melancholic", "tense", "dreamy", "cozy",
];

const IMG_QUALITY_OPTS = [
  "8K, highly detailed, masterpiece", "4K, crisp details, best quality",
  "highly detailed, sharp focus",
];

const IMG_NEGATIVES = [
  "blurry", "low quality", "watermark", "text", "signature", "deformed hands",
  "extra fingers", "bad anatomy", "jpeg artifacts",
];

registerHandler("ai-image-prompt-builder", (p) => {
  const subject = getString(p, "subject", "");
  const media = getString(p, "media", IMG_MEDIA[0]);
  const style = getString(p, "style", IMG_STYLE_OPTS[0]);
  const artist = getString(p, "artist", "");
  const lighting = getString(p, "lighting", IMG_LIGHT_OPTS[0]);
  const color = getString(p, "color", IMG_COLORS[0]);
  const camera = getString(p, "camera", IMG_CAMERAS[0]);
  const mood = getString(p, "mood", IMG_MOODS[0]);
  const quality = getString(p, "quality", IMG_QUALITY_OPTS[0]);
  const aspect = getString(p, "aspect", "16:9");
  const parts = [
    subject.trim() || "your subject",
    media,
    style,
    artist.trim() ? `in the style of ${artist.trim()}` : "",
    lighting,
    color,
    camera,
    `${mood} mood`,
    quality,
  ].filter(Boolean);
  return { prompt: parts.join(", ") + ` --ar ${aspect}`, negative: IMG_NEGATIVES.join(", ") };
});

const SPEAKER_PREFIX = /^\s*(?:user|assistant|human|ai|me|you|bot|chatgpt|system|model)\s*[:：]\s*/i;
const TIMESTAMP_LINE = /^\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*(?:am|pm))?\s*$/i;
const TIMESTAMP_PREFIX = /^\s*(\[\d{1,2}:\d{2}(?::\d{2})?\]|\d{1,2}:\d{2}(?::\d{2})?)\s*/;

registerHandler("ai-chat-export-cleaner", (p) => {
  const input = requireString(p, "input", "input");
  const removeSpeakers = getBool(p, "removeSpeakers", true);
  const removeTimestamps = getBool(p, "removeTimestamps", true);
  const collapseBlank = getBool(p, "collapseBlank", true);
  let lines = input.split("\n");

  if (removeSpeakers) {
    lines = lines.map((l) => l.replace(SPEAKER_PREFIX, ""));
  }

  if (removeTimestamps) {
    lines = lines
      .map((l) => (TIMESTAMP_LINE.test(l) ? "" : l.replace(TIMESTAMP_PREFIX, "")))
      .map((l) => l.replace(TIMESTAMP_PREFIX, ""));
  }

  lines = lines.map((l) => l.trim());

  if (collapseBlank) {
    const collapsed: string[] = [];
    for (const l of lines) {
      if (l === "" && collapsed[collapsed.length - 1] === "") continue;
      collapsed.push(l);
    }
    lines = collapsed;
  }

  return lines.join("\n").trim();
});

const LANGS: { id: string; name: string; flag: string }[] = [
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "pt", name: "Portuguese", flag: "🇵🇹" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
  { id: "zh", name: "Chinese", flag: "🇨🇳" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
];

const DICT: [string, string[]][] = [
  ["the", ["el", "le", "das", "o", "यह", "的", "その"]],
  ["a", ["un", "un", "ein", "um", "एक", "一个", "一つ"]],
  ["an", ["un", "un", "ein", "um", "एक", "一个", "一つ"]],
  ["and", ["y", "et", "und", "e", "और", "和", "と"]],
  ["or", ["o", "ou", "oder", "ou", "या", "或", "または"]],
  ["but", ["pero", "mais", "aber", "mas", "लेकिन", "但是", "しかし"]],
  ["you", ["tú", "tu", "du", "você", "आप", "你", "あなた"]],
  ["your", ["tu", "ton", "dein", "seu", "आपका", "你的", "あなたの"]],
  ["are", ["son", "êtes", "sind", "são", "हैं", "是", "です"]],
  ["is", ["es", "est", "ist", "é", "है", "是", "です"]],
  ["with", ["con", "avec", "mit", "com", "के साथ", "与", "と"]],
  ["about", ["sobre", "à propos", "über", "sobre", "के बारे में", "关于", "について"]],
  ["this", ["este", "ce", "dies", "este", "यह", "这个", "これ"]],
  ["that", ["ese", "cela", "das", "isso", "वह", "那个", "それ"]],
  ["as", ["como", "comme", "als", "como", "के रूप में", "作为", "として"]],
  ["in", ["en", "dans", "in", "em", "में", "在", "で"]],
  ["on", ["en", "sur", "auf", "em", "पर", "在", "に"]],
  ["at", ["en", "à", "an", "em", "पर", "在", "で"]],
  ["please", ["por favor", "s'il vous plaît", "bitte", "por favor", "कृपया", "请", "お願いします"]],
  ["write", ["escribe", "écris", "schreibe", "escreva", "लिखें", "写", "書いて"]],
  ["create", ["crea", "crée", "erstelle", "crie", "बनाएं", "创建", "作成して"]],
  ["generate", ["genera", "génère", "generiere", "gere", "उत्पन्न करें", "生成", "生成して"]],
  ["explain", ["explica", "explique", "erkläre", "explique", "समझाएं", "解释", "説明して"]],
  ["describe", ["describe", "décris", "beschreibe", "descreva", "वर्णन करें", "描述", "説明して"]],
  ["list", ["lista", "liste", "liste", "liste", "सूची", "列出", "リスト"]],
  ["provide", ["proporciona", "fournis", "gib", "forneça", "प्रदान करें", "提供", "提供して"]],
  ["give", ["da", "donne", "gib", "dê", "दें", "给", "与えて"]],
  ["help", ["ayuda", "aide", "hilf", "ajude", "मदद", "帮助", "助けて"]],
  ["make", ["haz", "fais", "mache", "faça", "बनाएं", "做", "作って"]],
  ["use", ["usa", "utilise", "verwende", "use", "उपयोग करें", "使用", "使って"]],
  ["using", ["usando", "en utilisant", "mit", "usando", "उपयोग करके", "使用", "使って"]],
  ["step", ["paso", "étape", "Schritt", "passo", "कदम", "步骤", "ステップ"]],
  ["by", ["por", "par", "von", "por", "द्वारा", "由", "によって"]],
  ["for", ["para", "pour", "für", "para", "के लिए", "为了", "のために"]],
  ["following", ["siguiente", "suivant", "folgend", "seguinte", "निम्न", "以下", "以下の"]],
  ["task", ["tarea", "tâche", "Aufgabe", "tarefa", "कार्य", "任务", "タスク"]],
  ["prompt", ["indicación", "consigne", "Prompt", "instrução", "प्रॉम्प्ट", "提示词", "プロンプト"]],
  ["answer", ["respuesta", "réponse", "Antwort", "resposta", "उत्तर", "回答", "答え"]],
  ["question", ["pregunta", "question", "Frage", "pergunta", "प्रश्न", "问题", "質問"]],
  ["topic", ["tema", "sujet", "Thema", "tópico", "विषय", "主题", "トピック"]],
  ["output", ["salida", "sortie", "Ausgabe", "saída", "आउटपुट", "输出", "出力"]],
  ["response", ["respuesta", "réponse", "Antwort", "resposta", "प्रतिक्रिया", "响应", "応答"]],
  ["text", ["texto", "texte", "Text", "texto", "पाठ", "文本", "テキスト"]],
  ["content", ["contenido", "contenu", "Inhalt", "conteúdo", "सामग्री", "内容", "コンテンツ"]],
  ["example", ["ejemplo", "exemple", "Beispiel", "exemplo", "उदाहरण", "例子", "例"]],
  ["important", ["importante", "important", "wichtig", "importante", "महत्वपूर्ण", "重要", "重要"]],
  ["ensure", ["asegúrate", "assure", "stelle sicher", "garanta", "सुनिश्चित करें", "确保", "確実に"]],
  ["avoid", ["evita", "évite", "vermeide", "evite", "बचें", "避免", "避けて"]],
  ["keep", ["mantén", "garde", "halte", "mantenha", "रखें", "保持", "保って"]],
  ["simple", ["simple", "simple", "einfach", "simples", "सरल", "简单", "シンプル"]],
  ["clear", ["claro", "clair", "klar", "claro", "स्पष्ट", "清晰", "明確"]],
  ["concise", ["conciso", "concis", "präzise", "conciso", "संक्षिप्त", "简洁", "簡潔"]],
  ["detailed", ["detallado", "détaillé", "detailliert", "detalhado", "विस्तृत", "详细", "詳細"]],
  ["professional", ["profesional", "professionnel", "professionell", "profissional", "पेशेवर", "专业", "プロフェッショナル"]],
  ["friendly", ["amigable", "amical", "freundlich", "amigável", "मैत्रीपूर्ण", "友好", "フレンドリー"]],
  ["tone", ["tono", "ton", "Ton", "tom", "लहजा", "语气", "トーン"]],
  ["format", ["formato", "format", "Format", "formato", "प्रारूप", "格式", "形式"]],
  ["like", ["como", "comme", "wie", "como", "जैसे", "像", "のように"]],
  ["should", ["deberías", "devrais", "solltest", "deveria", "चाहिए", "应该", "すべき"]],
  ["need", ["necesito", "besoin", "brauche", "preciso", "ज़रूरत", "需要", "必要"]],
  ["want", ["quiero", "veux", "möchte", "quero", "चाहते हैं", "想要", "欲しい"]],
  ["summary", ["resumen", "résumé", "Zusammenfassung", "resumo", "सारांश", "摘要", "要約"]],
  ["summarize", ["resume", "résume", "fasse zusammen", "resuma", "सारांशित करें", "总结", "要約して"]],
  ["draft", ["borrador", "brouillon", "Entwurf", "rascunho", "मसौदा", "草稿", "下書き"]],
  ["edit", ["edita", "modifie", "bearbeite", "edite", "संपादित करें", "编辑", "編集して"]],
  ["rewrite", ["reescribe", "réécris", "umschreiben", "reescreva", "फिर से लिखें", "重写", "書き直して"]],
  ["translate", ["traduce", "traduis", "übersetze", "traduza", "अनुवाद करें", "翻译", "翻訳して"]],
  ["improve", ["mejora", "améliore", "verbessere", "melhore", "सुधारें", "改善", "改善して"]],
  ["keywords", ["palabras clave", "mots-clés", "Schlüsselwörter", "palavras-chave", "कीवर्ड", "关键词", "キーワード"]],
  ["ideas", ["ideas", "idées", "Ideen", "ideias", "विचार", "想法", "アイデア"]],
  ["title", ["título", "titre", "Titel", "título", "शीर्षक", "标题", "タイトル"]],
  ["email", ["correo", "e-mail", "E-Mail", "e-mail", "ईमेल", "电子邮件", "メール"]],
  ["blog", ["blog", "blog", "Blog", "blog", "ब्लॉग", "博客", "ブログ"]],
  ["post", ["publicación", "publication", "Beitrag", "postagem", "पोस्ट", "帖子", "投稿"]],
  ["article", ["artículo", "article", "Artikel", "artigo", "लेख", "文章", "記事"]],
  ["script", ["guion", "script", "Drehbuch", "roteiro", "स्क्रिप्ट", "脚本", "脚本"]],
  ["video", ["video", "vidéo", "Video", "vídeo", "वीडियो", "视频", "動画"]],
  ["code", ["código", "code", "Code", "código", "कोड", "代码", "コード"]],
  ["function", ["función", "fonction", "Funktion", "função", "फ़ंक्शन", "函数", "関数"]],
  ["fix", ["arregla", "corrige", "repariere", "corrija", "ठीक करें", "修复", "修正して"]],
  ["error", ["error", "erreur", "Fehler", "erro", "त्रुटि", "错误", "エラー"]],
  ["data", ["datos", "données", "Daten", "dados", "डेटा", "数据", "データ"]],
  ["image", ["imagen", "image", "Bild", "imagem", "छवि", "图像", "画像"]],
  ["style", ["estilo", "style", "Stil", "estilo", "शैली", "风格", "スタイル"]],
  ["subject", ["sujeto", "sujet", "Thema", "assunto", "विषय", "主题", "主題"]],
  ["background", ["fondo", "arrière-plan", "Hintergrund", "fundo", "पृष्ठभूमि", "背景", "背景"]],
  ["lighting", ["iluminación", "éclairage", "Beleuchtung", "iluminação", "प्रकाश", "光照", "照明"]],
  ["good", ["bueno", "bon", "gut", "bom", "अच्छा", "好", "良い"]],
  ["great", ["genial", "super", "großartig", "ótimo", "महान", "很棒", "素晴らしい"]],
  ["best", ["mejor", "meilleur", "beste", "melhor", "सर्वश्रेष्ठ", "最好", "最高の"]],
  ["new", ["nuevo", "nouveau", "neu", "novo", "नया", "新", "新しい"]],
  ["every", ["cada", "chaque", "jeder", "cada", "हर", "每个", "毎"]],
  ["today", ["hoy", "aujourd'hui", "heute", "hoje", "आज", "今天", "今日"]],
];

registerHandler("ai-prompt-translator", (p) => {
  const prompt = getString(p, "prompt", "");
  const langId = getString(p, "lang", "es");
  const langIndex = Math.max(0, LANGS.findIndex((l) => l.id === langId));
  if (!prompt.trim()) return "";
  const words = prompt.match(/\b[a-zA-Z][a-zA-Z-']*[a-zA-Z]\b|[.,!?;:]/g) ?? [];
  return words
    .map((w) => {
      if (/^[.,!?;:]$/.test(w)) return w;
      const entry = DICT.find(([en]) => en === w.toLowerCase());
      if (!entry) return w;
      const t = entry[1][langIndex] ?? w;
      return w[0] === w[0].toUpperCase() ? t.charAt(0).toUpperCase() + t.slice(1) : t;
    })
    .join(" ");
});

const PROMPT_FILLERS = [
  "actually", "basically", "really", "very", "quite", "just", "simply",
  "literally", "totally", "honestly", "obviously", "clearly", "extremely",
];

const PROMPT_PHRASES: [RegExp, string][] = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bat this point in time\b/gi, "now"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bin the event that\b/gi, "if"],
  [/\bit is important to note that\b/gi, "note that"],
  [/\bwith regard to\b/gi, "about"],
  [/\bwhen it comes to\b/gi, "for"],
  [/\bthere is no doubt that\b/gi, "undoubtedly"],
  [/\ba majority of\b/gi, "most"],
];

registerHandler("ai-prompt-shortener", (p) => {
  const prompt = requireString(p, "prompt", "prompt");
  let out = prompt;
  for (const [re, sub] of PROMPT_PHRASES) out = out.replace(re, sub);
  for (const w of PROMPT_FILLERS) {
    out = out.replace(new RegExp(`\\s\\b${w}\\b\\s?`, "gi"), " ");
  }
  out = out.replace(/\s{2,}/g, " ").trim();
  const before = prompt.length;
  const after = out.length;
  return {
    output: out,
    saved: Math.max(0, before - after),
    tokensBefore: Math.round(before / 4),
    tokensAfter: Math.round(after / 4),
  };
});

const INTERVIEW_TYPES = {
  behavioral: [
    "Tell me about a time you had to handle a difficult teammate.",
    "Describe a project that failed. What did you learn?",
    "How do you prioritize when everything is urgent?",
    "Give an example of a time you took initiative beyond your role.",
    "How do you handle feedback you disagree with?",
  ],
  technical: [
    "Explain a technical concept to a non-technical person.",
    "How would you design a URL shortener?",
    "What's the difference between a process and a thread?",
    "How do you debug a slow production page?",
    "Describe a time you fixed a critical bug under pressure.",
  ],
  creative: [
    "Tell me about a campaign or piece of work you're proud of.",
    "How do you generate ideas when you feel stuck?",
    "Describe a brief that was vague — how did you approach it?",
    "What's your process for turning feedback into revisions?",
    "Share a time you chose a creative risk over a safe option.",
  ],
  leadership: [
    "How do you motivate a team through a hard quarter?",
    "Tell me about a time you had to make an unpopular decision.",
    "How do you give difficult feedback?",
    "Describe how you've helped someone grow on your team.",
    "How do you handle competing priorities from stakeholders?",
  ],
};

registerHandler("interview-question-generator", (p) => {
  const role = getString(p, "role", "");
  const type = getString(p, "type", "behavioral");
  const seed = getNumber(p, "seed", 1);
  const base = role.trim() || "the role";
  const questions = shuffle(INTERVIEW_TYPES[type as keyof typeof INTERVIEW_TYPES] ?? INTERVIEW_TYPES.behavioral, seed).slice(0, 5);
  return {
    output: [
      `Interview questions for ${base} — ${type} focus`,
      "",
      ...questions.map((q, i) => `${i + 1}. ${q}`),
    ].join("\n"),
    questions,
  };
});

const MJ_STYLES = [
  "cinematic, photorealistic",
  "studio photography, softbox lighting",
  "digital art, vibrant colors",
  "anime style, clean linework",
  "3D render, octane render, subsurface scattering",
  "oil painting, textured brushstrokes",
  "isometric, stylized, pastel palette",
];

registerHandler("midjourney-prompt-generator", (p) => {
  const subject = getString(p, "subject", "");
  const style = Math.max(0, Math.min(MJ_STYLES.length - 1, Math.round(getNumber(p, "style", 0))));
  const ratio = getString(p, "ratio", "16:9");
  const seed = getNumber(p, "seed", 1);
  const base = subject.trim() || "a mysterious forest";
  const styleDesc = MJ_STYLES[style];
  const params = `--ar ${ratio} --v 6.1 --stylize ${150 + (Math.abs(seed) % 150)}`;
  return `${base}, ${styleDesc}, highly detailed, award-winning composition ${params}`;
});

registerHandler("prompt-comparator", (p) => {
  const promptA = getString(p, "a", "");
  const promptB = getString(p, "b", "");
  const count = (pp: string) => {
    const words = pp.trim().split(/\s+/).filter(Boolean);
    const unique = new Set(words.map((w) => w.toLowerCase()));
    return { words: words.length, unique: unique.size, chars: pp.length };
  };
  const a = count(promptA);
  const b = count(promptB);
  const specificityWords = ["", "concrete", "specific", "detailed", "golden", "soft", "moody", "cinematic", "vivid", "close-up", "wide-angle", "shallow depth"];
  const specificity = (pp: string) => specificityWords.filter((w) => w && pp.toLowerCase().includes(w)).length;
  const aSpec = specificity(promptA);
  const bSpec = specificity(promptB);
  const score = (m: typeof a, spec: number) => m.words * 1 + spec * 2 + (m.unique / Math.max(1, m.words)) * 3;
  const sa = score(a, aSpec);
  const sb = score(b, bSpec);
  let verdict: string | null = null;
  if (promptA.trim() || promptB.trim()) {
    if (Math.abs(sa - sb) < 0.001) verdict = "Prompts look equally detailed.";
    else verdict = sa > sb ? "Prompt A is more detailed and specific." : "Prompt B is more detailed and specific.";
  }
  return {
    a: { ...a, specificity: aSpec },
    b: { ...b, specificity: bSpec },
    verdict,
  };
});

const IMPROVE_RULES = [
  "Break long sentences into shorter ones.",
  "Replace vague words like 'good', 'bad', 'very' with concrete language.",
  "Add an active voice instead of passive constructions.",
  "End with a clear call to action.",
  "Keep the tone professional but conversational.",
  "Remove filler phrases like 'I think', 'sort of', 'basically'.",
];

registerHandler("ai-response-improver", (p) => {
  const input = requireString(p, "input", "input");
  if (!input.trim()) return "";
  const lower = input.toLowerCase();
  const vague = [" very ", " really ", " good ", " bad ", " nice "].filter((w) => lower.includes(w));
  const passive = /\b(is|are|was|were) (being )?\w+ed\b/i.test(input);
  const longSentences = splitSentences(input).filter((s) => s.split(/\s+/).length > 30).length;
  const suggestions = IMPROVE_RULES.slice(0, 4);
  const flags = [
    passive ? "Uses passive voice in places." : null,
    longSentences > 0 ? `Found ${longSentences} very long sentence(s).` : null,
    vague.length > 0 ? `Contains vague wording (${vague.map((v) => v.trim()).join(", ")}).` : null,
  ].filter(Boolean);
  return [
    `Original (${input.split(/\s+/).filter(Boolean).length} words)`,
    "",
    input.trim(),
    "",
    "--- Suggested improvements ---",
    ...suggestions.map((s, i) => `${i + 1}. ${s}`),
    ...flags.map((f) => `• ${f}`),
  ].join("\n");
});

const QUESTION_TEMPLATES = [
  "What is {topic} and why does it matter?",
  "How does {topic} compare to {alt}?",
  "What are the most common mistakes with {topic}?",
  "What should beginners know before trying {topic}?",
  "How long does it take to see results with {topic}?",
  "What tools or resources are best for {topic}?",
  "Can {topic} work for someone on a tight budget?",
  "Where can I learn more about {topic}?",
];

registerHandler("question-generator", (p) => {
  const topic = getString(p, "topic", "");
  const seed = getNumber(p, "seed", 1);
  const base = topic.trim() || "this subject";
  return shuffle(
    QUESTION_TEMPLATES.map((q) =>
      q
        .replaceAll("{topic}", base)
        .replaceAll("{alt}", pick(["alternatives", "paid options", "the usual approach"], seed))
    ),
    seed
  ).slice(0, 6);
});