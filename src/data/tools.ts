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
