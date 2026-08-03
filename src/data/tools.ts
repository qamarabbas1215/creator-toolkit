import type { Category, CategorySlug, ToolMeta } from "@/types/tool";

export const categories: Category[] = [
  {
    slug: "ai",
    name: "AI Tools",
    icon: "🤖",
    color: "#8b5cf6",
    description: "Estimate AI token usage, costs, and format better prompts.",
  },
  {
    slug: "writing",
    name: "Writing",
    icon: "✍️",
    color: "#3b82f6",
    description: "Counters, reading time, and text statistics for writers.",
  },
  {
    slug: "youtube",
    name: "YouTube",
    icon: "▶️",
    color: "#ef4444",
    description: "Titles, tags, hooks, and thumbnail analysis for creators.",
  },
  {
    slug: "seo",
    name: "SEO",
    icon: "🔍",
    color: "#10b981",
    description: "Keyword density, meta tags, slugs, and SERP previews.",
  },
  {
    slug: "social",
    name: "Social Media",
    icon: "📱",
    color: "#ec4899",
    description: "Hashtags, bios, and captions for every platform.",
  },
  {
    slug: "image",
    name: "Image",
    icon: "🎨",
    color: "#f59e0b",
    description: "AI image prompt tools for Midjourney, Flux and more.",
  },
  {
    slug: "text",
    name: "Text",
    icon: "🔤",
    color: "#06b6d4",
    description: "Batch editing, extraction, sorting, and conversion tools.",
  },
  {
    slug: "developer",
    name: "Developer",
    icon: "💻",
    color: "#6366f1",
    description: "JSON, Base64, URL encoding, and UUID generators.",
  },
  {
    slug: "pdf",
    name: "PDF",
    icon: "📄",
    color: "#f43f5e",
    description: "Merge, split, compress, and convert PDF documents.",
  },
  {
    slug: "file",
    name: "File",
    icon: "🗜️",
    color: "#84cc16",
    description: "Zip, compress, rename, and convert your files.",
  },
];

export const tools: ToolMeta[] = [
  {
    slug: "character-counter",
    name: "Character Counter",
    category: "writing",
    icon: "📝",
    description:
      "Count characters (with or without spaces), words, sentences, paragraphs, and lines instantly.",
    keywords: [
      "character count",
      "chars",
      "letter counter",
      "text length",
      "twitter limit",
      "instagram caption",
    ],
    featured: true,
    trending: true,
    isNew: true,
    popularity: 98,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "writing",
    icon: "📖",
    description:
      "Track words, average word length, unique words, reading level, and keyword frequency.",
    keywords: [
      "word count",
      "count words",
      "essay word counter",
      "writing",
    ],
    featured: true,
    trending: true,
    popularity: 97,
  },
  {
    slug: "sentence-counter",
    name: "Sentence Counter",
    category: "writing",
    icon: "💬",
    description: "Count sentences in any text and measure average sentence length.",
    keywords: ["sentence count", "sentences", "average words per sentence"],
    popularity: 80,
  },
  {
    slug: "paragraph-counter",
    name: "Paragraph Counter",
    category: "writing",
    icon: "📄",
    description: "Count paragraphs, lines, and structure of your text.",
    keywords: ["paragraph count", "lines", "text structure"],
    popularity: 75,
  },
  {
    slug: "reading-time",
    name: "Reading Time",
    category: "writing",
    icon: "⏱️",
    description:
      "Calculate how long your article, blog post, or document takes to read.",
    keywords: [
      "reading time calculator",
      "read time",
      "articles",
      "blog",
      "wpm",
    ],
    featured: true,
    popularity: 90,
  },
  {
    slug: "speaking-time",
    name: "Speaking Time",
    category: "writing",
    icon: "🎙️",
    description:
      "Estimate script reading duration for videos, podcasts, and voice-overs.",
    keywords: [
      "speaking time",
      "script timer",
      "voice over",
      "presentation",
      "podcast",
    ],
    trending: true,
    popularity: 85,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    icon: "🔠",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
    keywords: [
      "case converter",
      "uppercase",
      "lowercase",
      "title case",
      "camelcase",
      "snake case",
      "kebab case",
    ],
    featured: true,
    trending: true,
    popularity: 95,
  },
  {
    slug: "find-and-replace",
    name: "Find & Replace",
    category: "text",
    icon: "🔎",
    description: "Batch find and replace text across multiple lines at once.",
    keywords: ["find replace", "replace text", "batch find", "bulk replace"],
    trending: true,
    popularity: 82,
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    category: "text",
    icon: "🗂️",
    description: "Remove duplicate lines while keeping the first or last occurrence.",
    keywords: [
      "remove duplicates",
      "dedupe",
      "unique lines",
      "batch text",
    ],
    popularity: 72,
  },
  {
    slug: "remove-empty-lines",
    name: "Remove Empty Lines",
    category: "text",
    icon: "🧹",
    description: "Strip blank lines and extra whitespace from large text blocks.",
    keywords: ["remove blank lines", "clean text", "remove whitespace"],
    popularity: 70,
  },
  {
    slug: "line-sorter",
    name: "Line Sorter",
    category: "text",
    icon: "🔃",
    description: "Sort lines alphabetically, reverse, by length, or randomly.",
    keywords: ["sort lines", "alphabetical", "sort text", "shuffle lines"],
    popularity: 68,
  },
  {
    slug: "prefix-suffix",
    name: "Prefix / Suffix",
    category: "text",
    icon: "➕",
    description: "Add a prefix or suffix to every line of text in one click.",
    keywords: ["add prefix", "add suffix", "bulk edit lines"],
    popularity: 60,
  },
  {
    slug: "reverse-text",
    name: "Reverse Text",
    category: "text",
    icon: "🔄",
    description: "Reverse the whole text or flip words and characters.",
    keywords: ["reverse text", "flip text", "reverse words", "backwards text"],
    popularity: 65,
  },
  {
    slug: "extract-urls",
    name: "Extract URLs",
    category: "text",
    icon: "🌐",
    description: "Pull every link out of text, HTML, or messages instantly.",
    keywords: ["extract urls", "find links", "url extractor", "scrape links"],
    popularity: 76,
  },
  {
    slug: "extract-emails",
    name: "Extract Emails",
    category: "text",
    icon: "📧",
    description: "Extract all email addresses from any text in one click.",
    keywords: ["extract emails", "email extractor", "find emails"],
    popularity: 78,
  },
  {
    slug: "extract-numbers",
    name: "Extract Numbers",
    category: "text",
    icon: "🔢",
    description: "Extract all numbers, decimals, and negative values from text.",
    keywords: ["extract numbers", "number extractor", "find numbers"],
    popularity: 66,
  },
  {
    slug: "youtube-title-generator",
    name: "YouTube Title Generator",
    category: "youtube",
    icon: "🎬",
    description:
      "Generate high-CTR YouTube titles with SEO keywords and power words.",
    keywords: [
      "youtube title generator",
      "video titles",
      "title ideas",
      "ctr",
    ],
    featured: true,
    trending: true,
    popularity: 94,
  },
  {
    slug: "youtube-tag-generator",
    name: "YouTube Tag Generator",
    category: "youtube",
    icon: "🏷️",
    description: "Generate SEO-optimized YouTube tags and keyword phrases.",
    keywords: ["youtube tags", "video tags", "tag generator", "keywords"],
    featured: true,
    popularity: 88,
  },
  {
    slug: "youtube-hook-generator",
    name: "Hook Generator",
    category: "youtube",
    icon: "🪝",
    description: "Generate scroll-stopping opening hooks for your videos.",
    keywords: ["hook generator", "video intro", "opening hook", "retention"],
    isNew: true,
    popularity: 84,
  },
  {
    slug: "thumbnail-text-checker",
    name: "Thumbnail Text Checker",
    category: "youtube",
    icon: "🖼️",
    description:
      "Analyze thumbnail text for word count, readability, and mobile visibility.",
    keywords: [
      "thumbnail text",
      "thumbnail checker",
      "youtube thumbnail",
      "ctr",
    ],
    popularity: 86,
  },
  {
    slug: "keyword-density",
    name: "Keyword Density",
    category: "seo",
    icon: "📊",
    description:
      "Measure keyword density and frequency for better content SEO.",
    keywords: [
      "keyword density",
      "keyword frequency",
      "seo analysis",
      "content optimization",
    ],
    featured: true,
    popularity: 87,
  },
  {
    slug: "meta-title-generator",
    name: "Meta Title Generator",
    category: "seo",
    icon: "🏷️",
    description: "Generate SEO meta titles with ideal pixel and character length.",
    keywords: ["meta title", "seo title", "page title", "title tag"],
    popularity: 80,
  },
  {
    slug: "meta-description-generator",
    name: "Meta Description Generator",
    category: "seo",
    icon: "📝",
    description: "Write compelling SEO meta descriptions with live SERP preview.",
    keywords: ["meta description", "seo description", "snippet"],
    popularity: 79,
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    category: "seo",
    icon: "🔗",
    description: "Convert any title into a clean, SEO-friendly URL slug.",
    keywords: ["slug generator", "url slug", "permalink", "seo url"],
    featured: true,
    popularity: 89,
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Generator",
    category: "social",
    icon: "#️⃣",
    description:
      "Generate optimized hashtags for Instagram, TikTok, YouTube, and X.",
    keywords: [
      "hashtag generator",
      "instagram hashtags",
      "tiktok hashtags",
      "youtube hashtags",
    ],
    featured: true,
    trending: true,
    popularity: 92,
  },
  {
    slug: "bio-generator",
    name: "Bio Generator",
    category: "social",
    icon: "👤",
    description: "Generate a personal bio for Instagram, Twitter, or LinkedIn.",
    keywords: ["bio generator", "instagram bio", "twitter bio", "linkedin bio"],
    popularity: 81,
  },
  {
    slug: "image-prompt-enhancer",
    name: "Image Prompt Enhancer",
    category: "image",
    icon: "🎨",
    description:
      "Turn simple ideas into detailed prompts for Midjourney, Flux, SDXL, and DALL·E.",
    keywords: [
      "ai image prompt",
      "midjourney prompt",
      "stable diffusion prompt",
      "prompt enhancer",
      "flux",
    ],
    featured: true,
    trending: true,
    isNew: true,
    popularity: 91,
  },
  {
    slug: "negative-prompt-generator",
    name: "Negative Prompt Generator",
    category: "image",
    icon: "🚫",
    description:
      "Generate negative prompts to avoid common AI image artifacts.",
    keywords: [
      "negative prompt",
      "stable diffusion negative",
      "ai image",
      "midjourney no",
    ],
    popularity: 77,
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    category: "image",
    icon: "📐",
    description:
      "Calculate aspect ratios and dimensions for videos, thumbnails, and images.",
    keywords: [
      "aspect ratio",
      "16 9",
      "9 16",
      "video dimensions",
      "resize",
    ],
    popularity: 74,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    icon: "🧩",
    description:
      "Beautify, minify, and validate JSON with instant error detection.",
    keywords: [
      "json formatter",
      "json beautifier",
      "json validator",
      "pretty print json",
      "minify json",
    ],
    featured: true,
    trending: true,
    popularity: 93,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    category: "developer",
    icon: "🔐",
    description: "Encode or decode text to and from Base64 with Unicode support.",
    keywords: ["base64", "base64 encode", "base64 decode", "encode text"],
    popularity: 83,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    category: "developer",
    icon: "🔗",
    description: "Percent-encode or decode URLs and query strings.",
    keywords: ["url encode", "url decode", "percent encoding", "query string"],
    popularity: 79,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer",
    icon: "🆔",
    description: "Generate UUID v4 and v7 identifiers in bulk.",
    keywords: ["uuid", "guid", "uuid v4", "id generator", "unique id"],
    popularity: 80,
  },
  {
    slug: "ai-token-calculator",
    name: "AI Token Calculator",
    category: "ai",
    icon: "🤖",
    description:
      "Estimate token usage for ChatGPT, Claude, Gemini, Llama, and more.",
    keywords: [
      "token calculator",
      "token counter",
      "chatgpt tokens",
      "claude tokens",
      "llm tokens",
    ],
    featured: true,
    trending: true,
    isNew: true,
    popularity: 96,
  },
  {
    slug: "ai-cost-calculator",
    name: "AI Cost Calculator",
    category: "ai",
    icon: "💰",
    description:
      "Estimate the cost of your AI prompts and API calls across providers.",
    keywords: ["ai cost", "api cost", "token price", "gpt cost", "openai price"],
    popularity: 88,
  },
  {
    slug: "text-statistics",
    name: "Text Statistics",
    category: "writing",
    icon: "📊",
    description:
      "Deep dive into your text: character, word, and sentence stats with readability scores.",
    keywords: [
      "text statistics",
      "readability",
      "text analysis",
      "flesch score",
      "content stats",
    ],
    isNew: true,
    popularity: 84,
  },
  {
    slug: "grammar-checker",
    name: "Grammar Checker",
    category: "writing",
    icon: "✅",
    description:
      "Catch spelling errors, repeated words, and common grammar issues in your writing.",
    keywords: [
      "grammar checker",
      "spell check",
      "writing errors",
      "proofread",
      "grammar",
    ],
    isNew: true,
    trending: true,
    popularity: 89,
  },
  {
    slug: "rewrite-tool",
    name: "Rewrite Tool",
    category: "writing",
    icon: "✂️",
    description:
      "Rephrase and rewrite sentences with tone, length, and formality controls.",
    keywords: [
      "rewrite text",
      "paraphrase",
      "rephrase",
      "tone changer",
      "paraphrasing tool",
    ],
    isNew: true,
    popularity: 86,
  },
  {
    slug: "summarizer",
    name: "Summarizer",
    category: "writing",
    icon: "📄",
    description:
      "Summarize long text by percentage or sentence count, with key-point extraction.",
    keywords: ["summarize text", "summary generator", "tl dr", "text summarizer"],
    popularity: 83,
  },
  {
    slug: "expand-text",
    name: "Expand Text",
    category: "writing",
    icon: "📈",
    description:
      "Expand short sentences into longer, more detailed ones without changing meaning.",
    keywords: ["expand text", "lengthen text", "more detail", "add words"],
    popularity: 72,
  },
  {
    slug: "shorten-text",
    name: "Shorten Text",
    category: "writing",
    icon: "📉",
    description:
      "Condense long sentences into concise versions while keeping the core message.",
    keywords: ["shorten text", "condense", "make it shorter", "concise writing"],
    popularity: 71,
  },
  {
    slug: "outline-generator",
    name: "Outline Generator",
    category: "writing",
    icon: "🗂️",
    description:
      "Turn any topic into a structured H1-H3 outline ready for articles or scripts.",
    keywords: [
      "outline generator",
      "blog outline",
      "article structure",
      "content outline",
    ],
    popularity: 75,
  },
  {
    slug: "remove-emojis",
    name: "Remove Emojis",
    category: "text",
    icon: "🙅",
    description: "Strip every emoji from your text while keeping punctuation and symbols.",
    keywords: ["remove emojis", "delete emojis", "emoji remover", "clean text"],
    popularity: 73,
  },
  {
    slug: "remove-special-characters",
    name: "Remove Special Characters",
    category: "text",
    icon: "🧼",
    description:
      "Remove symbols, punctuation, or non-alphanumeric characters from any text.",
    keywords: [
      "remove symbols",
      "special characters",
      "clean text",
      "strip punctuation",
    ],
    popularity: 69,
  },
  {
    slug: "youtube-description-generator",
    name: "Description Generator",
    category: "youtube",
    icon: "📝",
    description:
      "Generate SEO-friendly YouTube descriptions with keywords and timestamps.",
    keywords: [
      "youtube description",
      "description generator",
      "video description",
      "seo description",
    ],
    isNew: true,
    popularity: 82,
  },
  {
    slug: "ctr-analyzer",
    name: "CTR Analyzer",
    category: "youtube",
    icon: "📈",
    description:
      "Rate your title and thumbnail text for click-through potential and curiosity.",
    keywords: ["ctr analyzer", "click through rate", "youtube ctr", "title score"],
    popularity: 78,
  },
  {
    slug: "script-timer",
    name: "Script Timer",
    category: "youtube",
    icon: "⏱️",
    description:
      "Estimate how long your video script takes to read at different paces.",
    keywords: ["script timer", "video length", "script duration", "read time"],
    popularity: 76,
  },
  {
    slug: "shorts-idea-generator",
    name: "Shorts Idea Generator",
    category: "youtube",
    icon: "⚡",
    description:
      "Generate viral Shorts ideas with hooks and angles for any niche.",
    keywords: ["youtube shorts", "shorts ideas", "short form", "viral ideas"],
    isNew: true,
    trending: true,
    popularity: 85,
  },
  {
    slug: "cta-generator",
    name: "CTA Generator",
    category: "youtube",
    icon: "🔔",
    description:
      "Generate click-worthy calls-to-action like subscribe, like, and comment prompts.",
    keywords: ["cta", "call to action", "subscribe prompt", "youtube cta"],
    popularity: 70,
  },
  {
    slug: "chapter-generator",
    name: "Chapter Generator",
    category: "youtube",
    icon: "📑",
    description:
      "Generate timestamped chapters from your script or video topic list.",
    keywords: ["youtube chapters", "timestamps", "video chapters", "sections"],
    popularity: 74,
  },
  {
    slug: "youtube-keyword-finder",
    name: "Keyword Finder",
    category: "youtube",
    icon: "🔍",
    description:
      "Find high-intent YouTube keywords with questions, tags, and related terms.",
    keywords: [
      "youtube keywords",
      "keyword research",
      "video seo",
      "keyword finder",
    ],
    popularity: 80,
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "seo",
    icon: "🤖",
    description:
      "Generate a clean robots.txt file with user-agent and crawl rules.",
    keywords: ["robots.txt", "robots generator", "crawl rules", "seo file"],
    popularity: 68,
  },
  {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    category: "seo",
    icon: "🗺️",
    description:
      "Generate an XML sitemap from your site URLs and set priority and frequency.",
    keywords: ["sitemap", "xml sitemap", "sitemap generator", "seo"],
    isNew: true,
    popularity: 79,
  },
  {
    slug: "serp-preview",
    name: "SERP Preview",
    category: "seo",
    icon: "🖥️",
    description:
      "Preview how your title and meta description appear in Google search results.",
    keywords: ["serp preview", "google preview", "meta preview", "snippet"],
    popularity: 81,
  },
  {
    slug: "internal-link-suggestions",
    name: "Internal Link Suggestions",
    category: "seo",
    icon: "🔗",
    description:
      "Find internal linking opportunities between your articles and pages.",
    keywords: [
      "internal links",
      "link suggestions",
      "interlinking",
      "seo linking",
    ],
    popularity: 64,
  },
  {
    slug: "caption-generator",
    name: "Caption Generator",
    category: "social",
    icon: "💬",
    description:
      "Generate captions for Instagram, Facebook, and more in any tone.",
    keywords: [
      "caption generator",
      "instagram caption",
      "social caption",
      "photo caption",
    ],
    isNew: true,
    trending: true,
    popularity: 87,
  },
  {
    slug: "tweet-formatter",
    name: "Tweet Formatter",
    category: "social",
    icon: "🐦",
    description:
      "Format tweets with line breaks, character count, and thread-ready text.",
    keywords: ["tweet formatter", "twitter", "x post", "tweet length"],
    popularity: 72,
  },
  {
    slug: "thread-generator",
    name: "Thread Generator",
    category: "social",
    icon: "🧵",
    description:
      "Split long text into a numbered Twitter/X thread with perfect breaks.",
    keywords: ["thread generator", "twitter thread", "thread splitter", "x thread"],
    popularity: 77,
  },
  {
    slug: "linkedin-formatter",
    name: "LinkedIn Formatter",
    category: "social",
    icon: "💼",
    description:
      "Clean and format text for LinkedIn posts with emoji bullet lists.",
    keywords: [
      "linkedin formatter",
      "linkedin post",
      "professional post",
      "line breaks",
    ],
    popularity: 67,
  },
  {
    slug: "instagram-caption-optimizer",
    name: "Caption Optimizer",
    category: "social",
    icon: "📸",
    description:
      "Analyze and improve Instagram captions for length, hooks, and hashtags.",
    keywords: [
      "instagram caption",
      "caption optimizer",
      "ig engagement",
      "caption tips",
    ],
    popularity: 71,
  },
  {
    slug: "emoji-picker",
    name: "Emoji Picker",
    category: "social",
    icon: "😀",
    description:
      "Browse and copy emoji by category with one click for any post or bio.",
    keywords: ["emoji picker", "copy emoji", "emoji list", "emojis"],
    popularity: 75,
  },
  {
    slug: "prompt-style-library",
    name: "Prompt Style Library",
    category: "image",
    icon: "🎭",
    description:
      "Browse and copy style prompts for photography, 3D, anime, and more.",
    keywords: [
      "prompt styles",
      "midjourney styles",
      "style prompts",
      "prompt library",
    ],
    popularity: 78,
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    category: "image",
    icon: "🎨",
    description:
      "Generate color palettes by mood and copy them as hex, RGB, or CSS.",
    keywords: [
      "color palette",
      "color scheme",
      "hex colors",
      "palette generator",
    ],
    isNew: true,
    popularity: 82,
  },
  {
    slug: "prompt-randomizer",
    name: "Prompt Randomizer",
    category: "image",
    icon: "🎲",
    description:
      "Mix and randomize prompt elements to create endless new image prompts.",
    keywords: ["prompt randomizer", "random prompt", "prompt ideas", "mix"],
    popularity: 66,
  },
  {
    slug: "prompt-history",
    name: "Prompt History",
    category: "image",
    icon: "🕓",
    description:
      "Save and browse your recent image prompts with copy and favorites.",
    keywords: ["prompt history", "save prompts", "prompt list", "favorites"],
    popularity: 63,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    category: "developer",
    icon: "🔎",
    description:
      "Validate JSON and see detailed line and column errors with hints.",
    keywords: ["json validator", "validate json", "json check", "json errors"],
    popularity: 84,
  },
  {
    slug: "json-compare",
    name: "JSON Compare",
    category: "developer",
    icon: "🆚",
    description:
      "Compare two JSON documents and highlight added, removed, and changed keys.",
    keywords: ["json compare", "diff json", "json diff", "compare files"],
    isNew: true,
    popularity: 81,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    category: "developer",
    icon: "🧾",
    description:
      "Beautify or minify XML with indentation and error reporting.",
    keywords: ["xml formatter", "xml beautifier", "pretty xml", "minify xml"],
    popularity: 70,
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "developer",
    icon: "🌐",
    description:
      "Beautify or minify messy HTML and clean up markup with one click.",
    keywords: ["html formatter", "html beautifier", "pretty html", "minify html"],
    popularity: 73,
  },
  {
    slug: "css-beautifier",
    name: "CSS Beautifier",
    category: "developer",
    icon: "🎀",
    description:
      "Format and sort CSS rules with indentation and optional property sorting.",
    keywords: ["css formatter", "css beautifier", "format css", "pretty css"],
    popularity: 68,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "developer",
    icon: "🗄️",
    description:
      "Beautify SQL queries with keyword casing and indentation options.",
    keywords: ["sql formatter", "sql beautifier", "format sql", "pretty sql"],
    popularity: 72,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "developer",
    icon: "🧮",
    description:
      "Test regular expressions live with match highlighting and capture groups.",
    keywords: ["regex tester", "regexp", "regular expression", "regex test"],
    isNew: true,
    trending: true,
    popularity: 85,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "developer",
    icon: "🔑",
    description:
      "Decode JWT tokens into header and payload with base64Url support.",
    keywords: ["jwt decoder", "jwt", "token decoder", "json web token"],
    popularity: 69,
  },
  {
    slug: "prompt-formatter",
    name: "Prompt Formatter",
    category: "ai",
    icon: "📋",
    description:
      "Structure raw AI prompts with roles, tasks, context, and constraints.",
    keywords: [
      "prompt formatter",
      "structure prompt",
      "prompt template",
      "chatgpt prompt",
    ],
    popularity: 76,
  },
  {
    slug: "prompt-optimizer",
    name: "Prompt Optimizer",
    category: "ai",
    icon: "🚀",
    description:
      "Upgrade weak prompts into detailed, high-performing AI prompts.",
    keywords: [
      "prompt optimizer",
      "improve prompt",
      "prompt engineering",
      "better prompts",
    ],
    isNew: true,
    trending: true,
    popularity: 88,
  },
  {
    slug: "prompt-generator",
    name: "Prompt Generator",
    category: "ai",
    icon: "✨",
    description:
      "Generate complete AI prompts from a topic and desired outcome.",
    keywords: [
      "prompt generator",
      "ai prompt ideas",
      "prompt ideas",
      "generate prompt",
    ],
    isNew: true,
    popularity: 83,
  },
  {
    slug: "prompt-library",
    name: "Prompt Library",
    category: "ai",
    icon: "📚",
    description:
      "Browse ready-to-use prompts for writing, coding, marketing, and more.",
    keywords: [
      "prompt library",
      "chatgpt prompts",
      "prompt examples",
      "copy prompts",
    ],
    popularity: 79,
  },
  {
    slug: "ai-prompt-tester",
    name: "Prompt Tester",
    category: "ai",
    icon: "🧪",
    description:
      "Test prompt ideas for clarity, structure, and likelihood of good results.",
    keywords: [
      "prompt tester",
      "test prompt",
      "prompt score",
      "prompt analysis",
    ],
    popularity: 74,
  },
  {
    slug: "ai-image-prompt-builder",
    name: "Image Prompt Builder",
    category: "ai",
    icon: "🖼️",
    description:
      "Build detailed image prompts step-by-step for Midjourney, Flux, and SDXL.",
    keywords: [
      "image prompt builder",
      "ai image prompt",
      "midjourney builder",
      "prompt builder",
    ],
    isNew: true,
    popularity: 82,
  },
  {
    slug: "ai-chat-export-cleaner",
    name: "Chat Export Cleaner",
    category: "ai",
    icon: "🧹",
    description:
      "Clean ChatGPT or Claude conversation exports into plain, usable text.",
    keywords: [
      "chat export cleaner",
      "chatgpt export",
      "conversation cleaner",
      "clean chat",
    ],
    popularity: 65,
  },
  {
    slug: "ai-prompt-translator",
    name: "Prompt Translator",
    category: "ai",
    icon: "🌍",
    description:
      "Translate prompts between languages while keeping AI-optimized phrasing.",
    keywords: [
      "translate prompt",
      "prompt translation",
      "multi language",
      "ai prompt translate",
    ],
    popularity: 62,
  },
  {
    slug: "ai-prompt-shortener",
    name: "Prompt Shortener",
    category: "ai",
    icon: "✂️",
    description:
      "Condense long prompts into compact versions without losing intent.",
    keywords: [
      "shorten prompt",
      "prompt shortener",
      "condense prompt",
      "compact prompt",
    ],
    popularity: 61,
  },
  {
    slug: "pdf-merge",
    name: "Merge PDF",
    category: "pdf",
    icon: "🔗",
    description:
      "Combine multiple PDF files into one document in the order you choose.",
    keywords: [
      "merge pdf",
      "combine pdf",
      "join pdf",
      "pdf merger",
      "merge files",
    ],
    featured: true,
    trending: true,
    popularity: 92,
  },
  {
    slug: "pdf-split",
    name: "Split PDF",
    category: "pdf",
    icon: "✂️",
    description:
      "Split a PDF into separate pages or extract a page range as a new file.",
    keywords: ["split pdf", "extract pages", "pdf splitter", "separate pdf"],
    popularity: 86,
  },
  {
    slug: "pdf-compress",
    name: "Compress PDF",
    category: "pdf",
    icon: "🗜️",
    description:
      "Reduce PDF file size by optimizing the structure and stripping metadata.",
    keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "optimize pdf"],
    isNew: true,
    popularity: 88,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    category: "pdf",
    icon: "📝",
    description:
      "Extract text from a PDF and export it as an editable Word (.docx) file.",
    keywords: [
      "pdf to word",
      "pdf to docx",
      "convert pdf",
      "extract pdf text",
    ],
    popularity: 85,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    category: "pdf",
    icon: "📃",
    description:
      "Convert Word documents to PDF with a clean preview and print-to-PDF.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf", "convert word"],
    isNew: true,
    popularity: 83,
  },
  {
    slug: "zip-compressor",
    name: "ZIP Compressor",
    category: "file",
    icon: "🗜️",
    description:
      "Compress files into a ZIP archive or list and extract ZIP contents.",
    keywords: ["zip files", "compress files", "zip archive", "extract zip"],
    featured: true,
    popularity: 84,
  },
  {
    slug: "file-compressor",
    name: "File Compressor",
    category: "file",
    icon: "🧊",
    description:
      "Gzip-compress or decompress any file entirely in your browser.",
    keywords: ["gzip", "compress file", "decompress", "file compressor"],
    popularity: 72,
  },
  {
    slug: "bulk-renamer",
    name: "Bulk Renamer",
    category: "file",
    icon: "🏷️",
    description:
      "Rename multiple files with prefixes, suffixes, find & replace, or patterns.",
    keywords: [
      "rename files",
      "bulk rename",
      "batch rename",
      "file renamer",
    ],
    popularity: 76,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    category: "file",
    icon: "🖼️",
    description:
      "Convert images between PNG, JPEG, and WebP with quality control.",
    keywords: [
      "image converter",
      "jpg to png",
      "png to webp",
      "convert image",
    ],
    isNew: true,
    trending: true,
    popularity: 87,
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    category: "file",
    icon: "🎥",
    description:
      "Convert videos to MP4, WebM, MOV, MKV, or GIF right in the browser.",
    keywords: [
      "video converter",
      "mp4 converter",
      "mp4 to webm",
      "convert video",
      "video to gif",
    ],
    isNew: true,
    trending: true,
    popularity: 90,
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    category: "file",
    icon: "🎵",
    description:
      "Convert audio between MP3, WAV, OGG, M4A, FLAC, and AAC formats.",
    keywords: [
      "audio converter",
      "mp3 converter",
      "wav to mp3",
      "convert audio",
      "flac converter",
    ],
    isNew: true,
    popularity: 86,
  },
];

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug) ?? categories[0];
}

export function getTool(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug).name;
}

export function toolsByCategory(slug: CategorySlug): ToolMeta[] {
  return tools.filter((t) => t.category === slug);
}

export function featuredTools(): ToolMeta[] {
  return tools.filter((t) => t.featured);
}

export function trendingTools(): ToolMeta[] {
  return tools
    .filter((t) => t.trending || t.popularity >= 84)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
}

export function newTools(): ToolMeta[] {
  return tools.filter((t) => t.isNew);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = tools
    .map((tool) => {
      let score = 0;
      const name = tool.name.toLowerCase();
      const desc = tool.description.toLowerCase();
      const keywords = tool.keywords.map((k) => k.toLowerCase());
      if (name === q) score += 100;
      if (name.startsWith(q)) score += 60;
      if (name.includes(q)) score += 40;
      if (keywords.some((k) => k === q)) score += 50;
      if (keywords.some((k) => k.includes(q))) score += 25;
      if (desc.includes(q)) score += 15;
      return { tool, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 12).map((s) => s.tool);
}

export function relatedTools(slug: string, limit = 4): ToolMeta[] {
  const tool = getTool(slug);
  if (!tool) return [];
  const sameCategory = tools.filter(
    (t) => t.slug !== slug && t.category === tool.category
  );
  const others = tools.filter(
    (t) => t.slug !== slug && t.category !== tool.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
