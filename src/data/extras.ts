import type { ToolExample, ToolFaq } from "@/types/tool";
import { getCategory, getTool } from "@/data/tools";

interface ToolExtras {
  examples: ToolExample[];
  faqs: ToolFaq[];
}

const CURATED: Record<string, ToolExtras> = {
  "character-counter": {
    examples: [
      {
        title: "Stick to a tweet limit",
        description:
          "Paste your draft and instantly check if it fits inside 280 characters.",
      },
      {
        title: "Fit an Instagram caption",
        description:
          "Measure caption length against Instagram's 2,200-character cap before posting.",
      },
      {
        title: "Count a YouTube description",
        description:
          "Verify your video description stays under YouTube's 5,000-character limit.",
      },
    ],
    faqs: [
      {
        question: "Does the character counter count spaces?",
        answer:
          "Yes. You see two numbers — total characters including spaces, and characters without spaces — so you can target whichever limit your platform uses.",
      },
      {
        question: "Is my text uploaded anywhere?",
        answer:
          "No. Counting happens entirely in your browser. Nothing you paste is sent to a server.",
      },
    ],
  },
  "word-counter": {
    examples: [
      {
        title: "Check an essay length",
        description:
          "Paste your essay and see words, sentences, and reading time in one place.",
      },
      {
        title: "Profile your vocabulary",
        description:
          "Review unique words, average word length, and reading level to simplify dense copy.",
      },
      {
        title: "Plan a blog post",
        description:
          "Compare your draft word count to your usual post length.",
      },
    ],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer:
          "We use the standard average of 200 words per minute for reading and 130 words per minute for speaking.",
      },
      {
        question: "Does it handle languages other than English?",
        answer:
          "Word counting works for any space-separated language. Syllable and reading-level metrics are tuned for English.",
      },
    ],
  },
  "youtube-title-generator": {
    examples: [
      {
        title: "Turn a topic into ten titles",
        description:
          "Enter 'how to edit travel videos' and get ready-to-post title options.",
      },
      {
        title: "Add curiosity and numbers",
        description:
          "Generate titles with hooks, lists, and power words that stop the scroll.",
      },
      {
        title: "Match a video format",
        description:
          "Pick tutorial, vlog, or listicle styles to fit your content.",
      },
    ],
    faqs: [
      {
        question: "Can I use these titles for YouTube?",
        answer:
          "Yes. The generator follows YouTube's 100-character limit and suggests best practices for click-through.",
      },
      {
        question: "Do I need an account to use it?",
        answer:
          "No — every tool is free to use instantly, right in your browser.",
      },
    ],
  },
  "keyword-density": {
    examples: [
      {
        title: "Check an on-page keyword",
        description:
          "Paste a blog post to see how often your target keyword appears and where.",
      },
      {
        title: "Compare two drafts",
        description:
          "Run the winning version and the challenger through the density report.",
      },
      {
        title: "Avoid over-optimization",
        description:
          "Spot keyword stuffing and rebalance to a natural density.",
      },
    ],
    faqs: [
      {
        question: "What is a good keyword density?",
        answer:
          "There is no official rule, but 1–2% is a common, natural range. The tool also gives you raw counts so you can decide what feels right.",
      },
    ],
  },
  "json-formatter": {
    examples: [
      {
        title: "Pretty-print an API response",
        description:
          "Paste a minified JSON blob and format it with clean indentation.",
      },
      {
        title: "Validate config files",
        description:
          "Check that your JSON is well-formed and fix syntax errors fast.",
      },
      {
        title: "Minify before shipping",
        description:
          "Shrink JSON for storage or transfer with the minify mode.",
      },
    ],
    faqs: [
      {
        question: "Is the JSON sent to a server?",
        answer:
          "No. Formatting, validation, and minifying all happen locally in your browser.",
      },
    ],
  },
  "hashtag-generator": {
    examples: [
      {
        title: "Build an Instagram post pack",
        description:
          "Describe your photo and get relevant, mixed-size hashtags.",
      },
      {
        title: "Refresh an old post",
        description:
          "Generate a new tag set to test different audiences.",
      },
    ],
    faqs: [
      {
        question: "How many hashtags should I use?",
        answer:
          "Instagram allows up to 30 per post. The generator gives you a set you can trim to match your strategy.",
      },
    ],
  },
};

function fallbackExtras(toolSlug: string): ToolExtras | null {
  const tool = getTool(toolSlug);
  if (!tool) return null;
  const category = getCategory(tool.category);
  const keyword = tool.keywords[0] ?? "your content";
  const keywordPhrase = tool.keywords[1] ?? keyword;

  const examples: ToolExample[] = [
    {
      title: `Try it with ${keywordPhrase}`,
      description: `Paste or type ${keywordPhrase} and watch ${tool.name.toLowerCase()} process it instantly.`,
    },
    {
      title: "Refine real work",
      description: `Run an actual draft, script, or file through ${tool.name.toLowerCase()} to see practical results you can use.`,
    },
    {
      title: "Batch multiple items",
      description: `Use ${tool.name.toLowerCase()} repeatedly on different inputs — results update live with zero waiting.`,
    },
  ];

  const faqs: ToolFaq[] = [
    {
      question: `Is ${tool.name} free to use?`,
      answer: `Yes — ${tool.name} is 100% free. No sign-up is required to use it, and there are no usage limits.`,
    },
    {
      question: `Does ${tool.name} upload my data?`,
      answer: `No. ${tool.name} runs entirely in your browser, so the text, files, or images you work with never leave your device.`,
    },
    {
      question: `Do I need an account?`,
      answer: `You can use ${tool.name} instantly without an account. Create a free account only if you want to save projects and track your history across the site.`,
    },
  ];

  if (category.slug === "ai") {
    examples.unshift({
      title: "Improve an AI prompt",
      description: `Use ${tool.name.toLowerCase()} to sharpen a prompt before you send it to an AI model.`,
    });
  }
  if (category.slug === "youtube" || category.slug === "social") {
    examples.unshift({
      title: "Plan a post or video",
      description: `Feed in your topic and get output tailored for your next ${category.name.toLowerCase()} piece.`,
    });
  }
  if (category.slug === "pdf" || category.slug === "file") {
    examples.unshift({
      title: "Process a real file",
      description: `Pick a ${category.name.toLowerCase()} and let the tool handle the rest — no uploads, all local.`,
    });
  }
  if (category.slug === "developer") {
    examples.unshift({
      title: "Work with real code",
      description: `Paste a snippet of code or data and use ${tool.name.toLowerCase()} to format, convert, or analyze it.`,
    });
  }
  if (category.slug === "image") {
    examples.unshift({
      title: "Build a better prompt",
      description: `Describe your scene and refine the output into a detailed ${tool.name.toLowerCase()} result.`,
    });
  }

  return { examples, faqs };
}

export function getToolExtras(slug: string): ToolExtras | null {
  return CURATED[slug] ?? fallbackExtras(slug);
}
