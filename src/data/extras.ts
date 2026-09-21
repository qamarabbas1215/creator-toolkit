import type { ToolExample, ToolExtras, ToolFaq } from "@/types/tool";
import { getCategory, getTool } from "@/data/tools";

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
  "sentence-counter": {
    examples: [
      {
        title: "Tighten a long paragraph",
        description:
          "Paste a dense paragraph and watch the average words per sentence change as you split run-ons.",
      },
      {
        title: "Check sentence variety",
        description:
          "Compare the longest and shortest sentence to see whether your rhythm is monotone.",
      },
      {
        title: "Scan a transcript",
        description:
          "Drop in a video or podcast transcript to gauge how many sentences it contains.",
      },
    ],
    faqs: [
      {
        question:
          "Does it count a period in abbreviations as a sentence end?",
        answer:
          "Yes. The splitter treats . ! ? and … as boundaries, so Dr. Smith or 3.14 can add extra sentences. It is a fast rule-based count, not grammar analysis.",
      },
      {
        question: "Can I copy or download the sentence stats?",
        answer:
          "The Sentence Counter shows live stats only. Use the Word Counter if you want a copyable and downloadable summary.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Type or paste into the box. Every count updates live as you type.",
      },
      {
        title: "Read the four stats",
        description:
          "Sentences is the total, Avg words / sentence is words divided by sentences, and Longest and Shortest report word counts for the extremes.",
      },
      {
        title: "Trim the outliers",
        description:
          "Edit the longest sentence down or merge very short fragments, then watch the average move.",
      },
    ],
    workedExample: {
      input: "Hello world. How are you? Great!",
      output:
        "Sentences: 3 · Avg words / sentence: 2.0 · Longest: 3 words · Shortest: 1 word",
      note: "A sentence ends at a period, question mark, exclamation mark, or ellipsis, each optionally followed by whitespace.",
    },
    limits: [
      "Sentences are split on . ! ? and …, so abbreviations, decimals, and initials are counted as sentence boundaries.",
      "It is a rule-based splitter rather than grammar-aware NLP, so dense technical or legal text can be miscounted.",
      "The Longest and Shortest figures are word counts taken from whitespace splitting, so short fragments can skew the shortest value.",
    ],
    privacyNote:
      "Counting runs entirely in your browser with JavaScript. Your text is never sent to a server, and the stats update live as you type.",
    related: [
      {
        slug: "paragraph-counter",
        note: "Count paragraph and line structure in the same text.",
      },
      {
        slug: "word-counter",
        note: "See unique words, reading level, and keyword frequency.",
      },
      {
        slug: "reading-time",
        note: "Turn your word count into an estimated read time.",
      },
    ],
  },
  "paragraph-counter": {
    examples: [
      {
        title: "Profile a blog draft",
        description:
          "Paste a draft and check how many paragraphs and lines it has before publishing.",
      },
      {
        title: "Measure paragraph length",
        description:
          "Use avg words / paragraph to spot walls of text that need breaking up.",
      },
      {
        title: "Check an outline",
        description:
          "Count the separate blocks in notes or an outline where blocks are separated by blank lines.",
      },
    ],
    faqs: [
      {
        question: "What counts as a paragraph?",
        answer:
          "A block of text separated from the next by a blank line. A single line break stays inside the same paragraph.",
      },
      {
        question: "Why is my paragraph count lower than expected?",
        answer:
          "If your text uses single line breaks between blocks, they are treated as one paragraph. Add a blank line between blocks to separate them.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description: "Paste into the box and every stat updates live.",
      },
      {
        title: "Separate paragraphs with blank lines",
        description:
          "A new paragraph starts only when there is a blank line. A single line break keeps the text in the same paragraph.",
      },
      {
        title: "Check avg words / paragraph",
        description:
          "Words are divided by the paragraph count. A high number means long blocks you may want to split.",
      },
    ],
    workedExample: {
      input: "First paragraph with a few words.\n\nSecond paragraph, also short.",
      output:
        "Paragraphs: 2 · Lines: 3 · Words: 10 · Avg words / paragraph: 5.0",
      note: "The blank line between the two blocks creates the second paragraph; the empty line itself still counts as a line.",
    },
    limits: [
      "A new paragraph requires a blank line, so indented or single-line-break paragraphs are counted together.",
      "Lines are counted with a plain newline split, so blank lines and trailing line breaks are included in that number.",
      "Words are counted with a Latin-focused pattern, so space-less scripts are undercounted.",
    ],
    privacyNote:
      "Paragraph and line counting happens locally in your browser. The text you paste is not uploaded.",
    related: [
      {
        slug: "sentence-counter",
        note: "Count sentences and average sentence length.",
      },
      {
        slug: "word-counter",
        note: "Get exact words, unique words, and readability stats.",
      },
      {
        slug: "reading-time",
        note: "Estimate how long the text takes to read.",
      },
    ],
  },
  "reading-time": {
    examples: [
      {
        title: "Estimate a blog post",
        description:
          "Paste an article and read the time at your usual pace before you publish.",
      },
      {
        title: "Compare reader speeds",
        description:
          "The stat grid shows the same text at 150, 200, 250, and 300 words per minute side by side.",
      },
      {
        title: "Plan a newsletter",
        description:
          "Keep a newsletter under a target read time by watching the headline number as you edit.",
      },
    ],
    faqs: [
      {
        question: "What reading speed does it use by default?",
        answer:
          "200 words per minute. You can switch to 150, 250, or 300, and the stat grid always shows all four speeds for comparison.",
      },
      {
        question: "Does the estimate include images or code?",
        answer:
          "No. It is based on word count alone, so media-heavy pages or code samples will take longer to read than the number suggests.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Words are counted as you type with the same word counter used across the toolkit.",
      },
      {
        title: "Pick a reading speed",
        description:
          "Choose Slow reader (150 wpm), Average (200), Fast reader (250), or Skimming (300). The default is 200 wpm.",
      },
      {
        title: "Read the headline time",
        description:
          "The large number uses your selected speed, and the grid below shows all four speeds.",
      },
    ],
    workedExample: {
      input: "400 words (a short article)",
      output: "At 200 wpm: 2m 0s · At 150 wpm: 2m 40s",
      note: "400 ÷ 200 = 2.0 minutes, and 400 ÷ 150 = 2.67 minutes, shown as 2m 40s.",
    },
    limits: [
      "Estimates use word count only and do not account for images, charts, code, footnotes, or re-reading.",
      "Words are counted with a Latin-focused pattern, so scripts without spaces, such as Chinese or Japanese, are undercounted.",
      "The four speeds are fixed benchmarks, not measurements of an individual reader.",
    ],
    privacyNote:
      "Reading time is calculated in your browser from your text. Nothing is uploaded, and no account is required.",
    related: [
      {
        slug: "speaking-time",
        note: "Estimate how long the same text takes to say out loud.",
      },
      {
        slug: "word-counter",
        note: "Get the full word and readability breakdown.",
      },
      {
        slug: "sentence-counter",
        note: "Check sentence length and variety.",
      },
    ],
  },
  "speaking-time": {
    examples: [
      {
        title: "Time a YouTube script",
        description:
          "Paste a script and see whether it lands in your target video length before you record.",
      },
      {
        title: "Plan a Short",
        description:
          "Check that a short script reads in under a minute at your delivery speed.",
      },
      {
        title: "Prep a podcast",
        description:
          "Estimate episode length for a rough script at a conversational pace.",
      },
    ],
    faqs: [
      {
        question: "What is the default speaking speed?",
        answer:
          "130 words per minute, a conversational pace. You can also choose 100, 160, or 190 wpm.",
      },
      {
        question: "Is the duration label a guarantee?",
        answer:
          "No. It is a rough content-format hint based on the estimated minutes, not a rule about how long your video should be.",
      },
    ],
    howTo: [
      {
        title: "Paste your script",
        description:
          "Paste the spoken text — narration, dialogue, or a monologue.",
      },
      {
        title: "Choose a speaking speed",
        description:
          "Slow and clear (100 wpm), Conversational (130, the default), Enthusiastic (160), or Fast / energetic (190).",
      },
      {
        title: "Read the result",
        description:
          "The headline time uses your chosen speed, a badge suggests a content format, and the grid lists all four speeds.",
      },
    ],
    workedExample: {
      input: "260 words (roughly two minutes of narration)",
      output: "At 130 wpm: 2m 0s · format badge: Short-form video",
      note: "260 ÷ 130 = 2.0 minutes, which falls in the 1–5 minute short-form band.",
    },
    limits: [
      "The estimate assumes continuous speech and does not include pauses, music, sound effects, demos, or audience reactions.",
      "The format badge is a rough length guide based on duration bands, not a rule about the right video length.",
      "Like reading time, it counts words only and undercounts scripts that are not space-separated.",
    ],
    privacyNote:
      "The estimate is computed locally in your browser from the words in your script. Your script is not uploaded.",
    related: [
      {
        slug: "reading-time",
        note: "Compare how long the same text takes to read silently.",
      },
      {
        slug: "word-counter",
        note: "Get an exact word count and vocabulary stats.",
      },
      {
        slug: "paragraph-counter",
        note: "Check the structure of your script.",
      },
    ],
  },
  "case-converter": {
    examples: [
      {
        title: "Clean up a headline",
        description:
          "Turn a shouty headline into Title Case or sentence case in one click.",
      },
      {
        title: "Make a code identifier",
        description:
          "Convert a phrase like order total amount into camelCase, PascalCase, snake_case, or kebab-case.",
      },
      {
        title: "Fix pasted caps-lock text",
        description:
          "Paste all-caps text and switch to lowercase or sentence case.",
      },
    ],
    faqs: [
      {
        question: "What does Sentence case capitalise?",
        answer:
          "Only the first letter of the text and the first letter after a . ! or ? that is followed by a space. Everything is lowercased first.",
      },
      {
        question: "Why did my acronym change?",
        answer:
          "Title Case and the identifier cases lower-case the rest of each word, so HTML becomes Html. Use UPPERCASE if you must preserve capitals.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description: "Type or paste any text into the box.",
      },
      {
        title: "Pick a case",
        description:
          "Choose from 11 modes: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, aLtErNaTiNg, Reverse, or inVERSE cASE.",
      },
      {
        title: "Copy or download",
        description:
          "The converted text appears in an editable output box you can copy or download as converted-text.txt.",
      },
    ],
    workedExample: {
      input: "hello world-foo_bar",
      output:
        "camelCase: helloWorldFooBar · snake_case: hello_world_foo_bar",
      note: "camelCase, PascalCase, snake_case, and kebab-case first split the text on spaces and punctuation, then rejoin the words.",
    },
    limits: [
      "Title Case capitalises every whitespace-separated word, so small words like the and of are also capitalised and acronyms become Html or Api.",
      "camelCase, PascalCase, snake_case, and kebab-case remove punctuation and split on it, so symbols such as + and . are lost.",
      "Reverse flips the entire string character by character, including spaces, and aLtErNaTiNg counts spaces in its position sequence.",
    ],
    privacyNote:
      "All conversions happen in the browser with JavaScript. Your text is not sent anywhere, and the output box stays editable on your device.",
    related: [
      {
        slug: "slug-generator",
        note: "Turn a title into a clean URL slug.",
      },
      {
        slug: "find-and-replace",
        note: "Batch-edit text before or after converting case.",
      },
      {
        slug: "remove-duplicate-lines",
        note: "Clean up lists while you reformat text.",
      },
    ],
    blogLink: {
      slug: "most-used-text-tools",
      title: "Our 5 most used text tools (and how to use them)",
      readTime: "4 min read",
    },
  },
  "youtube-tag-generator": {
    examples: [
      {
        title: "Tag a tutorial video",
        description:
          "Enter video editing and get a starter set of tag phrases plus broad defaults.",
      },
      {
        title: "Expand a single keyword",
        description:
          "Type one topic and the generator builds related phrases like how to …, best …, and … for beginners.",
      },
      {
        title: "Copy as hashtags",
        description:
          "Use the Copy hashtags button to get the same tags spaced and prefixed for a description.",
      },
    ],
    faqs: [
      {
        question: "Are these tags based on real search data?",
        answer:
          "No. They are built from fixed word patterns around your keywords plus a set of broad defaults. They are a starting point, not search-volume or competition data.",
      },
      {
        question: "Why are there so many tags?",
        answer:
          "Each keyword expands into 12 template phrases and the combined list is capped at 60 tags. YouTube limits the tag field to 500 characters, so trim the list before pasting.",
      },
    ],
    howTo: [
      {
        title: "Enter your keywords",
        description:
          "Type one or more topics separated by commas or new lines, for example video editing, thumbnails, youtube growth.",
      },
      {
        title: "Click Generate tags",
        description:
          "Each keyword is expanded into template phrases and combined with broad defaults, then de-duplicated.",
      },
      {
        title: "Copy in your preferred format",
        description:
          "Copy comma-separated tags for YouTube's tag field, or copy hashtags for a description.",
      },
    ],
    workedExample: {
      input: "video editing",
      output:
        "video editing, video editing tips, how to video editing, best video editing, video editing tutorial, video editing for beginners, …",
      note: "The list ends with the fixed defaults content creator, youtube tips, creator tips, viral, shorts, tutorial, and how to, and is capped at 60 tags.",
    },
    limits: [
      "Tags come from a fixed set of word patterns, so they do not reflect real search volume, competition, or ranking difficulty.",
      "YouTube's tag field has a 500-character total limit, and 60 generated tags can exceed it, so trim the list before pasting.",
      "There is no guarantee of views, reach, or ranking. Keep only the tags that genuinely describe your video.",
    ],
    privacyNote:
      "Tag generation runs in your browser using local word patterns. Your keywords are not sent to a server, and no AI service is involved.",
    related: [
      {
        slug: "youtube-title-generator",
        note: "Write a title that earns the click for those tags.",
      },
      {
        slug: "youtube-hook-generator",
        note: "Pair your tags with a stronger opening hook.",
      },
      {
        slug: "hashtag-generator",
        note: "Build a hashtag set for other social platforms.",
      },
    ],
  },
  "slug-generator": {
    examples: [
      {
        title: "Clean a blog post URL",
        description:
          "Paste a working title and get a lowercase, hyphenated slug suitable for a permalink.",
      },
      {
        title: "Try different separators",
        description:
          "Switch between hyphen, underscore, and no separator to match your site's URL style.",
      },
      {
        title: "Drop filler words",
        description:
          "Leave Remove stop words on to strip the, and, for, in, and similar words from the URL.",
      },
    ],
    faqs: [
      {
        question: "Which words are treated as stop words?",
        answer:
          "Common short words such as the, and, for, in, of, to, and with. The list is shared with the Keyword Density tool.",
      },
      {
        question: "Why did non-English characters disappear?",
        answer:
          "The slug keeps only a–z, 0–9, spaces, and hyphens. Accented letters are removed rather than transliterated, and the separator you choose replaces spaces.",
      },
    ],
    howTo: [
      {
        title: "Paste a title or phrase",
        description: "The slug preview updates live as you type.",
      },
      {
        title: "Choose a separator",
        description:
          "Pick a hyphen (default), an underscore, or no separator.",
      },
      {
        title: "Toggle stop words",
        description:
          "With Remove stop words on (default), common words like the and for are removed before the words are joined.",
      },
    ],
    workedExample: {
      input: "7 Best AI Tools for Content Creators in 2026",
      output: "7-best-ai-tools-content-creators-2026",
      note: "The stop words for and in are removed. Turning the toggle off gives 7-best-ai-tools-for-content-creators-in-2026.",
    },
    limits: [
      "Only a–z, 0–9, spaces, and hyphens are kept, so accented and non-Latin characters are dropped rather than transliterated: café becomes caf and 日本語 becomes empty.",
      "A hyphen already inside a word is preserved, so a title containing well-known keeps the hyphen even when you choose the underscore separator.",
      "The tool does not collapse runs of separators, check for duplicate URLs, or reserve existing permalinks — check those yourself.",
    ],
    privacyNote:
      "Slug generation is pure browser JavaScript. The title you type is not sent to a server.",
    related: [
      {
        slug: "meta-title-generator",
        note: "Write a page title that works with your URL.",
      },
      {
        slug: "keyword-density",
        note: "Check which terms matter before you pick a slug.",
      },
      {
        slug: "case-converter",
        note: "Reformat text into other naming styles.",
      },
    ],
    blogLink: {
      slug: "creators-seo-checklist",
      title: "The creator's SEO checklist before you hit publish",
      readTime: "8 min read",
    },
  },
  "ai-token-calculator": {
    examples: [
      {
        title: "Size a prompt before sending",
        description:
          "Paste a prompt to estimate how many tokens it uses across several popular models.",
      },
      {
        title: "Compare providers",
        description:
          "See how the same text estimates differently for OpenAI, Anthropic, Google, and open models.",
      },
      {
        title: "Check a long document",
        description:
          "Paste a document to get a rough idea of whether it fits comfortably in a context window.",
      },
    ],
    faqs: [
      {
        question: "Are these exact token counts?",
        answer:
          "No. They are character-based estimates: characters divided by a model's average characters per token. Real tokenizers produce different counts depending on language, punctuation, code, and model version.",
      },
      {
        question: "Why do models show different numbers for the same text?",
        answer:
          "Each model uses a different average characters-per-token value. The Claude and DeepSeek entries use 3.5, while most others use 4.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Character, word, and average token estimates update live as you type.",
      },
      {
        title: "Compare the model bars",
        description:
          "Each row shows one model's estimated tokens and a bar sized against the largest estimate on screen.",
      },
      {
        title: "Use it as a planning guide",
        description:
          "Treat the numbers as rough estimates for budgeting context, not as billing-accurate counts.",
      },
    ],
    workedExample: {
      input: "Hello, world!",
      output:
        "Characters: 13 · Est. tokens (avg): 4 · GPT-4o: 3 · Claude Sonnet 4: 4",
      note: "The average rounds 13 ÷ 4 up to 4, GPT-4o rounds 3.25 to 3, and Claude rounds 13 ÷ 3.5 to 4.",
    },
    limits: [
      "This is an estimator, not a tokenizer. It never runs a real byte-pair encoding, so counts can differ from actual usage.",
      "Non-Latin scripts, code, whitespace, and heavy punctuation can all push real token counts well above or below the estimate.",
      "Model tokenizers change between versions, and the average characters-per-token values here are fixed approximations.",
    ],
    privacyNote:
      "Token estimates are calculated in your browser from character counts. Your prompt is not sent to any AI provider or server.",
    related: [
      {
        slug: "ai-cost-calculator",
        note: "Turn token estimates into an estimated dollar cost.",
      },
      {
        slug: "ai-image-prompt-builder",
        note: "Build a detailed image prompt without an API call.",
      },
      {
        slug: "image-prompt-enhancer",
        note: "Expand a simple image idea into a richer prompt.",
      },
    ],
  },
  "color-palette-generator": {
    examples: [
      {
        title: "Start a brand palette",
        description:
          "Pick a base hue and an analogous scheme to get five related colors for a project.",
      },
      {
        title: "Find a complementary accent",
        description:
          "Use the complementary scheme to get opposing hues for buttons or highlights.",
      },
      {
        title: "Build a monochrome set",
        description:
          "Use the monochromatic scheme to vary lightness and saturation from one hue.",
      },
    ],
    faqs: [
      {
        question: "How many colors does it generate?",
        answer:
          "Five per palette. The scheme decides how their hues relate to the base hue you pick.",
      },
      {
        question: "Can I copy a color?",
        answer:
          "Yes. Click a swatch to copy its hex code, copy the CSS variables block, or use the hex list in the output box.",
      },
      {
        question: "Can it pull colors from an image?",
        answer:
          "No. Palettes are generated mathematically from the base hue and scheme. There is no image upload or color extraction.",
      },
    ],
    howTo: [
      {
        title: "Choose a base hue",
        description:
          "Drag the Base hue slider from 0 to 360, or press Shuffle for a random start.",
      },
      {
        title: "Pick a scheme",
        description:
          "Choose Analogous, Complementary, Triadic, or Monochromatic to change how the five hues are derived.",
      },
      {
        title: "Copy the output",
        description:
          "Click any swatch to copy its hex code, or copy the generated CSS custom properties for your stylesheet.",
      },
    ],
    workedExample: {
      input: "Base hue 0 (red) · Analogous scheme",
      output: "#D74242, #D78C42, #D7428C, #D7D742, #D742D7",
      note: "Analogous uses the hues at 0, +30, −30, +60, and −60 degrees around the base, all at 65% saturation and 55% lightness, converted from HSL to hex.",
    },
    limits: [
      "Every palette is generated from one base hue and a fixed scheme, not from brand colors or an uploaded image.",
      "The output is uppercase hex plus CSS custom properties. There is no RGB or HSL export, and colors are not checked for contrast or accessibility.",
      "The Complementary scheme intentionally reuses the opposite hue at two saturations, so a palette can contain two similar swatches.",
    ],
    privacyNote:
      "Palettes are generated in your browser. Copying uses your device's clipboard, and no colors or settings are uploaded.",
    related: [
      {
        slug: "color-converter",
        note: "Convert a swatch between hex, RGB, and HSL.",
      },
      {
        slug: "aspect-ratio-calculator",
        note: "Size a canvas or image before you design with the palette.",
      },
      {
        slug: "image-prompt-enhancer",
        note: "Describe a palette in an AI image prompt.",
      },
    ],
  },
  "pdf-merge": {
    examples: [
      {
        title: "Combine a report set",
        description:
          "Add a cover page, body, and appendix as separate PDFs and merge them into one file.",
      },
      {
        title: "Assemble scanned pages",
        description:
          "Join several single-page scans into one document in the order you set.",
      },
      {
        title: "Reorder before merging",
        description:
          "Use the up and down arrows to fix the sequence before you click Merge PDFs.",
      },
    ],
    faqs: [
      {
        question: "Are my PDFs uploaded?",
        answer:
          "No. Merging uses the pdf-lib library in your browser, so the files you pick are read locally and are not sent to a server.",
      },
      {
        question: "Why did merging fail?",
        answer:
          "Every file must be a valid, password-free PDF. Corrupted, encrypted, or non-PDF files cannot be merged, and very large batches are limited by your browser's memory.",
      },
    ],
    howTo: [
      {
        title: "Add two or more PDFs",
        description:
          "Use Add PDFs to pick files. They appear in a list in the order they will be merged.",
      },
      {
        title: "Set the order",
        description:
          "Use the up and down arrows on each row to reorder, or the ✕ button to remove a file.",
      },
      {
        title: "Merge and download",
        description:
          "Click Merge PDFs. The combined document downloads as merged.pdf in the list order.",
      },
    ],
    workedExample: {
      input: "report.pdf (2 pages), invoice.pdf (4 pages), appendix.pdf (3 pages)",
      output: "merged.pdf containing 9 pages in that order",
      note: "Pages are copied from each source PDF in full and appended to a new document, so page count is the sum of the inputs.",
    },
    limits: [
      "At least two valid, unencrypted PDFs are required. Password-protected or damaged files cause the merge to fail.",
      "Output is always named merged.pdf, and the source files are unchanged.",
      "Very large files or very long batches can hit browser memory limits; there is no server-side fallback.",
      "The tool concatenates pages. Interactive forms, bookmarks, and per-file metadata are not guaranteed to survive the merge.",
    ],
    privacyNote:
      "Merging runs entirely in your browser using pdf-lib. The PDFs you select are read locally and are not uploaded anywhere.",
    related: [
      {
        slug: "pdf-split",
        note: "Split one PDF into pages or extract a range.",
      },
      {
        slug: "pdf-compress",
        note: "Shrink a PDF before or after merging.",
      },
      {
        slug: "pdf-to-word",
        note: "Convert a PDF into an editable Word document.",
      },
    ],
  },
  "ai-image-prompt-builder": {
    examples: [
      {
        title: "Build a full scene prompt",
        description:
          "Set a subject, then choose medium, style, lighting, color, camera, mood, quality, and aspect ratio.",
      },
      {
        title: "Swap one element at a time",
        description:
          "Change a single dropdown, such as lighting or mood, and the prompt rewrites instantly.",
      },
      {
        title: "Grab a negative prompt",
        description:
          "Copy the built-in negative prompt to reduce common artifacts alongside your main prompt.",
      },
    ],
    faqs: [
      {
        question: "Does this use an AI model?",
        answer:
          "No. It is a rule-based builder that assembles your selected options into a prompt. No model is called and no text is sent anywhere.",
      },
      {
        question: "Why is the negative prompt the same each time?",
        answer:
          "The negative prompt is a fixed list of common artifacts such as blurry, watermark, and bad anatomy. It is not generated from your subject, so edit it if you need something specific.",
      },
    ],
    howTo: [
      {
        title: "Describe your subject",
        description:
          "Type the main subject, for example a fox drinking tea in a Victorian library.",
      },
      {
        title: "Choose the look",
        description:
          "Select a medium, style, lighting, color palette, camera or lens, mood, quality, and aspect ratio. Artist is optional.",
      },
      {
        title: "Copy the prompts",
        description:
          "The image prompt updates live and ends with an aspect-ratio flag. Copy the prompt, and the negative prompt if your model supports one.",
      },
    ],
    workedExample: {
      input: "Subject: a fox drinking tea in a Victorian library (default options)",
      output:
        "a fox drinking tea in a Victorian library, photograph, photorealistic, golden hour lighting, vibrant saturated colors, shot on full-frame DSLR, 85mm f/1.8, calm and serene mood, 8K, highly detailed, masterpiece --ar 16:9",
      note: "The builder joins your subject with the selected presets and appends --ar 16:9. The default quality adds 8K, highly detailed, masterpiece.",
    },
    limits: [
      "This is a template and rule-based builder, not LLM generation. It assembles the options you pick and never calls a model.",
      "The negative prompt is fixed and not tailored to your subject, so it may not address subject-specific problems.",
      "The --ar flag is Midjourney-style and may be ignored by some models. Other models expect different parameters.",
      "The order of the joined fragments reflects the builder's fixed order, so wording is not optimised per model.",
    ],
    privacyNote:
      "The prompt is assembled in your browser from local option lists. Nothing is sent to an AI service or server.",
    related: [
      {
        slug: "image-prompt-enhancer",
        note: "Expand a short idea with style and lighting presets.",
      },
      {
        slug: "negative-prompt-generator",
        note: "Build a negative prompt for a specific subject or style.",
      },
      {
        slug: "prompt-style-library",
        note: "Browse ready-made style fragments for prompts.",
      },
    ],
  },
  "image-prompt-enhancer": {
    examples: [
      {
        title: "Turn an idea into a prompt",
        description:
          "Type a short idea and receive a detailed prompt with style, lighting, and quality detail.",
      },
      {
        title: "Match a visual style",
        description:
          "Switch the style preset between photorealistic, cinematic, anime, 3D, watercolor, and more.",
      },
      {
        title: "Tune the lighting",
        description:
          "Choose golden hour, studio, dramatic, neon, natural, or night lighting to change the mood.",
      },
    ],
    faqs: [
      {
        question: "Does this rewrite my idea with AI?",
        answer:
          "No. It appends a chosen style, lighting, and quality preset to your idea. There is no language model involved.",
      },
      {
        question: "What are the prompt length and token stats?",
        answer:
          "Prompt length is the character count of the assembled prompt, and estimated tokens is that length divided by 4 — a rough guide, not a tokenizer result.",
      },
    ],
    howTo: [
      {
        title: "Describe your idea",
        description:
          "Type a short description, for example a fox reading a book in a forest.",
      },
      {
        title: "Choose style, lighting, and quality",
        description:
          "Each dropdown adds a fixed block of descriptive detail to your prompt.",
      },
      {
        title: "Edit and copy",
        description:
          "The enhanced prompt appears in an editable output box you can tweak, copy, or download as image-prompt.txt.",
      },
    ],
    workedExample: {
      input:
        "a fox reading a book in a forest (photorealistic, golden lighting, quality preset 1)",
      output:
        "a fox reading a book in a forest, ultra photorealistic, shot on a full-frame camera, 85mm lens, f/1.8, shallow depth of field, natural skin texture, golden hour lighting, warm directional sunlight, long soft shadows, highly detailed, 8K, sharp focus, masterpiece",
      note: "The enhancer joins your idea with the preset fragments separated by commas, in the order idea, style, lighting, quality.",
    },
    limits: [
      "This is a rule-based enhancer. It does not use an AI model and does not understand your subject beyond appending presets.",
      "Each style, lighting, and quality option maps to one fixed fragment, so the same selection always produces the same extra text.",
      "The token estimate is characters divided by 4 and can differ from real model token counts.",
    ],
    privacyNote:
      "Enhancement happens in your browser using local preset lists. Your idea is not sent to a server or AI model.",
    related: [
      {
        slug: "ai-image-prompt-builder",
        note: "Assemble a prompt from detailed per-element options.",
      },
      {
        slug: "prompt-style-library",
        note: "Explore 16 ready-made style fragments.",
      },
      {
        slug: "negative-prompt-generator",
        note: "Add a negative prompt to reduce artifacts.",
      },
    ],
  },
  "text-statistics": {
    examples: [
      {
        title: "Profile a draft before publishing",
        description:
          "Paste a finished draft to see characters, words, sentences, and readability in one grid.",
      },
      {
        title: "Find the hardest paragraph",
        description:
          "Compare syllables and average words per sentence across sections to spot dense copy.",
      },
      {
        title: "Track one stat as you edit",
        description:
          "Watch unique words, long words (7+), and grade level update live while you revise.",
      },
    ],
    faqs: [
      {
        question: "Which stats does Text Statistics actually show?",
        answer:
          "Characters (with and without spaces), words, unique words, sentences, paragraphs, lines, long words of 7 letters or more, syllables, average word length, average words per sentence, Flesch Reading Ease with a label, and Flesch-Kincaid Grade Level.",
      },
      {
        question: "Does it include reading or speaking time?",
        answer:
          "The shared stats engine also computes reading minutes (200 wpm) and speaking minutes (130 wpm), but this page does not display them. Use the Reading Time or Speaking Time tools for those numbers.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Type or paste into the box — every statistic updates as you type.",
      },
      {
        title: "Read the grid and the Flesch card",
        description:
          "Characters, words, sentences, syllables, and grade level sit in the stat grid; the card shows the Flesch Reading Ease score and its label.",
      },
      {
        title: "Copy the full breakdown",
        description:
          "Click Copy all stats to grab a plain-text summary of every metric as its own line.",
      },
    ],
    workedExample: {
      input: "Hello world. How are you? Great!",
      output:
        "Characters: 32 · Words: 6 · Unique words: 6 · Sentences: 3 · Paragraphs: 1 · Lines: 1 · Long words (7+): 0 · Syllables: 7 · Avg word length: 4.0 · Avg words / sentence: 2.0 · Flesch ease: 106.1 (Very Easy) · Grade level: -1.0",
      note: "Words are matched with the Latin-focused pattern [A-Za-z0-9'’-], giving 6 words and 7 syllables. The Flesch formula can exceed 100 for very short, simple text, and the page bar clamps at 100%.",
    },
    limits: [
      "Words are matched with a Latin-focused pattern, so space-less scripts such as Chinese or Japanese are undercounted.",
      "Syllable counting is an English heuristic (vowel groups with a trailing-e rule), so other languages get rough estimates.",
      "Sentences split on . ! ? and …, so abbreviations, decimals, and initials add extra sentences.",
      "The Flesch score can climb above 100 on very short simple text even though the formula label reads 0–100.",
    ],
    privacyNote:
      "All statistics are computed in your browser with JavaScript. Your text is never sent to a server.",
    related: [
      {
        slug: "word-counter",
        note: "The same word basis with reading time and keyword frequency.",
      },
      {
        slug: "sentence-counter",
        note: "Sentence totals and longest/shortest sentence lengths.",
      },
      {
        slug: "readability-checker",
        note: "Focus on the Flesch Reading Ease score alone.",
      },
    ],
  },
  "readability-checker": {
    examples: [
      {
        title: "Grade a blog intro",
        description:
          "Paste an intro and aim for a Standard (60–70) score so casual readers keep going.",
      },
      {
        title: "Compare two versions",
        description:
          "Draft the same idea twice and compare which reads more easily before you publish.",
      },
      {
        title: "Check a call-to-action",
        description:
          "Make sure subscribe buttons and signup copy are Short Sentences with Simple Words like the scoring guide recommends.",
      },
    ],
    faqs: [
      {
        question: "What score should I aim for?",
        answer:
          "The tool uses the Flesch label bands: 90+ Very Easy, 80+ Easy, 70+ Fairly Easy, 60+ Standard, 50+ Fairly Difficult, 30+ Difficult, and below 30 Very Confusing. For creator content, Standard or above is a safe target.",
      },
      {
        question: "What exactly is measured?",
        answer:
          "Flesch Reading Ease uses average words per sentence and average syllables per word: 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words). The tool displays the rounded score, its label, and the underlying word, sentence, and syllable counts.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Drop a paragraph, script, or landing page into the box. The score updates as you type.",
      },
      {
        title: "Read the score and label",
        description:
          "The Reading Ease card shows the score from 0–100 plus its label (Very Easy to Very Confusing).",
      },
      {
        title: "Inspect the breakdown",
        description:
          "Words, sentences, syllables, and average syllables per word explain why the score landed where it did.",
      },
    ],
    workedExample: {
      input:
        "Reading ease scores are calculated from sentence length and syllable count. Longer sentences with difficult words produce lower scores. Short text tends to score quite high.",
      output:
        "Score: 61.4 (Standard) · Words: 26 · Sentences: 3 · Syllables: 42 · Avg syllables per word: 1.62",
      note: "The three sentences average 8.7 words each, but multisyllable words like calculated, difficult, and syllable push the count up, which keeps the score in the Standard band.",
    },
    limits: [
      "The score is an English Flesch Reading Ease estimate, so other languages and mixed text get skewed results.",
      "Syllables come from an English heuristic (vowel groups with a trailing-e rule), not a dictionary.",
      "Sentences split on . ! ? and …, so decimals, initials, and abbreviations add count.",
      "Flesch is length-based only: it says nothing about vocabulary difficulty or tone.",
    ],
    privacyNote:
      "The score is computed locally in your browser. Nothing you paste is uploaded or stored.",
    related: [
      {
        slug: "text-statistics",
        note: "The same core stats with a full grid on one page.",
      },
      {
        slug: "sentence-counter",
        note: "A headline-friendlier sentence total without the score.",
      },
      {
        slug: "word-counter",
        note: "Word counts, reading time, and keyword frequency.",
      },
    ],
  },
  "headline-analyzer": {
    examples: [
      {
        title: "Score a video title",
        description:
          "Paste a YouTube title and see exactly which of the five signals held it back.",
      },
      {
        title: "A/B test two headlines",
        description:
          "Compare a numbers-first title against a question title and keep the higher score.",
      },
      {
        title: "Tweak until it hits 8+",
        description:
          "Add a power word or a digit and watch the score climb toward the Strong band.",
      },
    ],
    faqs: [
      {
        question: "What does the score mean?",
        answer:
          "8–10 is Strong, 6–7 is Decent, and below 6 is Needs work. The rating is a composition heuristic — a headline that has a numbers score, a power word, and a question mark tends to draw more clicks.",
      },
      {
        question: "What are the five signals?",
        answer:
          "Numbers or digits, an emotional trigger word, headline length, a question, and punctuation — an exclamation mark, period, or question mark. Each is shown as a score out of 10 and the five are averaged into the final rating.",
      },
    ],
    howTo: [
      {
        title: "Paste or type a headline",
        description:
          "The score updates live as you edit the title.",
      },
      {
        title: "Read the five signals",
        description:
          "Numbers, emotional triggers, length, question, and punctuation each get a score out of 10 in the breakdown list.",
      },
      {
        title: "Iterate on the weak signal",
        description:
          "Raise the lowest score first — usually by adding a digit or an emotional keyword from the list.",
      },
    ],
    workedExample: {
      input: "10 Proven Ways to Boost Your CTR (in 2026)",
      output:
        "Overall: 8/10 (Strong) · Length: 10 · Power words: 8 · Numbers: 9 · Question: 7 · Punctuation: 6",
      note: "Nine words land in the 6–12 sweet spot (10/10), and two power words (Proven, Boost) beat the baseline. The digit 10 earns the numbers signal; the title is not a question and has no terminal punctuation, so those two signals stay low.",
    },
    limits: [
      "The verdict is a heuristic. It does not predict actual click-through rates or guarantee YouTube traction.",
      "'Question' triggers on a ? anywhere in the title; the parentheses around a year in the example do not count.",
      "The emotional keyword list is fixed (Proven, Secret, Easy, Instant, and a handful more).",
      "Punctuation triggers once on any of . ! ? for 9 points — a bare ellipsis (…) does not count on its own.",
    ],
    privacyNote:
      "Analysis runs entirely in your browser. Headlines are never stored or shared.",
    related: [
      {
        slug: "ctr-analyzer",
        note: "A separate 0–100 rating with power words and framing hooks.",
      },
      {
        slug: "blog-title-generator",
        note: "Hand out fresh titles after you finish analyzing.",
      },
      {
        slug: "youtube-title-generator",
        note: "Generate titles to test against this analyzer.",
      },
    ],
  },
  "grammar-checker": {
    examples: [
      {
        title: "Clean a caption before posting",
        description:
          "Paste text from your phone where doubled spaces and typos slipped in, then copy the corrected version.",
      },
      {
        title: "Fix common misspellings",
        description:
          "The tool rewrites a fixed set of frequent typos (like teh → the) while keeping your wording intact.",
      },
      {
        title: "Normalize spacing and punctuation",
        description:
          "Collapse extra spaces and remove spaces before commas, periods, and question marks in one pass.",
      },
    ],
    faqs: [
      {
        question: "Is this an AI grammar checker?",
        answer:
          "No. It applies deterministic rules: collapsing doubled spaces, removing spaces before punctuation, re-capping letters after . ! ?, flagging repeated words, and fixing a small dictionary of 28 common misspellings. It will not rewrite sentences or suggest style improvements.",
      },
      {
        question: "Why didn't it flag my lowercase sentence?",
        answer:
          "The tool only re-capitalizes the word after a sentence-ending period, exclamation, or question mark. It intentionally does not correct a lowercased first letter of the very first word.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Drop text into the box — the check runs live as you type, listing each issue it finds.",
      },
      {
        title: "Review each suggestion",
        description:
          "Scan the issue list — each entry shows the problem, the corrected text, and why it changed.",
      },
      {
        title: "Copy the corrected version",
        description:
          "Use Copy corrected text to grab the fully corrected version — all fixes are applied in that output.",
      },
    ],
    workedExample: {
      input: "this is teh  best  way to recieve it",
      output:
        "Fixed: 'this is the best way to receive it' · 4 issues found (two extra spaces, teh → the, recieve → receive)",
      note: "The first word stays lowercase because the checker only fixes text after a sentence-ending period, never the opening letter.",
    },
    limits: [
      "Corrections are rule-based, not a full grammar engine: no subject-verb agreement, tense, or style checks.",
      "The misspelling dictionary covers 28 of the most common typos only.",
      "Repeated-word detection triggers on exact repeats like 'the the' and does not catch near duplicates.",
      "The re-capitalization rule only applies after . ! ?, so it does not fix a lowercase first letter.",
    ],
    privacyNote:
      "The check runs entirely in your browser. Nothing you paste is uploaded or stored.",
    related: [
      {
        slug: "rewrite-tool",
        note: "Say the same thing a different way after fixing typos.",
      },
      {
        slug: "readability-checker",
        note: "Confirm the corrected text is easy to read.",
      },
      {
        slug: "sentence-counter",
        note: "Check sentence length once you tighten your text.",
      },
    ],
  },
  "summarizer": {
    examples: [
      {
        title: "Condense notes into a TL;DR",
        description:
          "Paste long meeting or research notes and pull 50% of the text into a fast summary.",
      },
      {
        title: "Skim three articles quickly",
        description:
          "Run each article at 20% and compare the kept sentences before reading any full post.",
      },
      {
        title: "Extract the core of your own writing",
        description:
          "Shorten a post to its key sentences to reuse as a social caption or email preview.",
      },
    ],
    faqs: [
      {
        question: "How is the summary picked?",
        answer:
          "The tool scores every sentence by how often its words appear across the whole text (rarer words weigh more after stopwords are removed). It then keeps the highest-scoring sentences until they reach the selected percentage of the sentence pool, and restores the original order.",
      },
      {
        question: "Why do same-length options differ?",
        answer:
          "The ratio is applied to the sentence pool, so the same input at 30% and 50% keeps a different number of complete sentences, re-sorted into their original order afterward. Nothing is rewritten or fused.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Drop any prose into the box.",
      },
      {
        title: "Pick a length",
        description:
          "Choose Short (20%), Medium (30%), or Long (50%) of the original text.",
      },
      {
        title: "Compare and copy",
        description:
          "The kept sentences render in their original order; copy the summary when it looks right.",
      },
    ],
    workedExample: {
      input:
        "Dogs love to run. Training a dog takes time and patience. Puppies chew everything they find. Older dogs are usually calmer.",
      output:
        "Long (50%): 'Training a dog takes time and patience. Puppies chew everything they find.' · 2 of 4 sentences kept",
      note: "The frequency scorer favors sentences carrying rarer content words (patience, puppies, chew), then re-sorts them back into their original order.",
    },
    limits: [
      "Summaries are extractive: the tool never writes new sentences, only reuses full ones.",
      "Short input can stay unchanged because at least one sentence is always kept.",
      "The word-frequency scoring can prize a specific-looking sentence over the most general one.",
      "Scoring is synchronous, so very long texts compute fully in the browser with no server round-trip.",
    ],
    privacyNote:
      "Summarization and scoring happen locally in your browser. Text is never sent to a server, and there is no AI API involved.",
    related: [
      {
        slug: "shorten-text",
        note: "Trim by character or word count instead of by sentence.",
      },
      {
        slug: "keyword-density",
        note: "See which words drive the sentence scoring above.",
      },
      {
        slug: "text-statistics",
        note: "Compare original vs. summary length with real numbers.",
      },
    ],
  },
  "thumbnail-text-checker": {
    examples: [
      {
        title: "Stress-test your thumbnail copy",
        description:
          "Paste the text you plan to put on a 1280×720 thumbnail and see if it stays readable at YouTube's small render size.",
      },
      {
        title: "Choose a canvas and font size",
        description:
          "Switch between 16:9 video, 9:16 Shorts, square, and 4K presets and drag the font-size slider to match your design.",
      },
      {
        title: "Trim words that push you out of range",
        description:
          "Cut from 8 words down to 6 to recover the word-count bonus and get a cleaner 100.",
      },
    ],
    faqs: [
      {
        question: "Does the score predict clicks?",
        answer:
          "No. Readability Score is strictly a legibility heuristic: how quickly the text can be read at thumbnail size. It combines word count, text size relative to the canvas, and length and has nothing to do with CTR or viewer interest.",
      },
      {
        question: "What preset should I use?",
        answer:
          "1280×720 (the classic 16:9 canvas) and 1920×1080 match most video layouts. Shorts use 720×1280, and the 1:1 preset (1080×1080) covers square uploads. Choose the one your audience actually sees.",
      },
    ],
    howTo: [
      {
        title: "Type the text on your thumbnail",
        description:
          "Enter the exact copy as it appears on the design.",
      },
      {
        title: "Pick a canvas and font size",
        description:
          "Choose the thumbnail dimensions and drag the font-size slider to match your design.",
      },
      {
        title: "Aim for the green zone",
        description:
          "The word count, character count, readability score, live preview, and recommendations show how close you are to a clear, punchy thumbnail.",
      },
    ],
    workedExample: {
      input:
        "Text: '5 MISTAKES YOU MAKE' · Canvas: 1280×720 · Font: 140 px",
      output:
        "Readability: 100/100 (raw 110, clamped to 100) · Word count: 4 · 'Great thumbnail text — clear, readable, and punchy.'",
      note: "Four short words at about 11% of canvas width hit every bonus: ≤6 words, size ≥9%, length ≤40 characters, and the 2–5-word sweet spot.",
    },
    limits: [
      "The score measures legibility, not click-through — it never predicts whether viewers will click.",
      "The font slider is a design estimate. Results shift if your real font size differs.",
      "The 60–260 px slider only approximates typical YouTube thumbnail fonts.",
      "Emoji and special glyphs count toward length but are rendered by your own system font.",
    ],
    privacyNote:
      "The analysis runs locally in your browser. No text, canvas choices, or scores are uploaded.",
    related: [
      {
        slug: "thumbnail-text-generator",
        note: "Generate short, punchy thumbnail copy to feed this checker.",
      },
      {
        slug: "ctr-analyzer",
        note: "Check the title that leads viewers to the thumbnail.",
      },
      {
        slug: "youtube-title-generator",
        note: "Pair a title with your optimized thumbnail text.",
      },
    ],
  },
  "ctr-analyzer": {
    blogLink: {
      slug: "youtube-titles-that-get-clicked",
      title: "How to write YouTube titles that actually get clicked",
      readTime: "6 min read",
    },
    examples: [
      {
        title: "Score your next video title",
        description:
          "Paste a title before hitting publish and see where you earn and lose points against the CTR checklist.",
      },
      {
        title: "Compare title candidates",
        description:
          "Run two or three title ideas side by side and keep the one that clears the 70-plus Strong band.",
      },
      {
        title: "Add the missing hook",
        description:
          "Drop in a number, a power word, or parentheses framing and watch the bar climb from Average to Strong.",
      },
    ],
    faqs: [
      {
        question: "Does this predict real click-through rate?",
        answer:
          "No. CTR Score is a heuristics-based rating built from length, numbers, power words, framing parentheses, questions, and emoji. It is a writing checklist, not a measurement of viewer behavior, and the page says so.",
      },
      {
        question: "What pushes a title into Strong?",
        answer:
          "A length between 20 and 60 characters, a number, and at least one of 14 power words (like mistakes, secret, best, or never). Adding parentheses framing like (in 2026) also adds points.",
      },
    ],
    howTo: [
      {
        title: "Type or paste a title",
        description:
          "The score re-evaluates live on every keystroke.",
      },
      {
        title: "Read the checklist bars",
        description:
          "Length, power words, and each hook gets its own bar with the exact points awarded.",
      },
      {
        title: "Iterate until 70+",
        description:
          "Reach the Strong band by raising the weakest bar: tighten length or add a power word or number.",
      },
    ],
    workedExample: {
      input: "5 Editing Secrets That Will Change Your Videos (in 2026)",
      output:
        "CTR Score: 90/100 (Strong) · Length: +20 · Numbers: +15 · Power words: +5 · Brackets: +10",
      note: "The 56-character title is inside the 20–60 sweet spot (+20) and contains a digit (+15). Only one power word matches — secret inside Secrets — so the power-word bucket adds +5 instead of the cap +15, and the (in 2026) brackets add +10. It stops at 90; a second power word, a question mark, or an emoji would push it higher.",
    },
    limits: [
      "It evaluates only the title text — never audience behavior, thumbnails, or real CTR data.",
      "The 14 power words are fixed, so synonyms like 'failures' or 'tips' do not score.",
      "An emoji only counts if the actual character is present in the title.",
      "Titles over 60 characters earn a reduced length bonus, and ones past 70 receive none, even if well-written.",
    ],
    privacyNote:
      "All scoring runs in your browser. Titles and scores never leave your device.",
    related: [
      {
        slug: "thumbnail-text-checker",
        note: "Readability scoring for the thumbnail that pairs with the title.",
      },
      {
        slug: "youtube-title-generator",
        note: "Generate title options to run through this analyzer.",
      },
      {
        slug: "youtube-hook-generator",
        note: "Write the first line that keeps viewers after the click.",
      },
    ],
  },
  "script-timer": {
    examples: [
      {
        title: "Fit a script to a slot",
        description:
          "Paste a script and pick 140 wpm to see spoken length against a 10-minute target.",
      },
      {
        title: "Find the slow section",
        description:
          "Sections like the intro and main points are timed separately, so you can see exactly what pushes you over.",
      },
      {
        title: "Reset and re-plan",
        description:
          "Trim the longest section and watch total time drop before you start recording.",
      },
    ],
    faqs: [
      {
        question: "How do section markers work?",
        answer:
          "The timer splits text on Markdown-style and script markers — ## headings, ###, --, [Section], and MM:SS timecodes. Each marked block becomes a measured section and gets its own word count and duration.",
      },
      {
        question: "What speaking speed is assumed?",
        answer:
          "You can choose 120, 140, 160, or 180 words per minute. The default is 140 wpm, a common talking-pace average for creator scripts.",
      },
    ],
    howTo: [
      {
        title: "Paste your script",
        description:
          "Add your section markers (## Intro, [Main points], etc.) as you go.",
      },
      {
        title: "Select a speaking pace",
        description:
          "Pick the 120–180 wpm preset that matches how you actually record.",
      },
      {
        title: "Read the section breakdown",
        description:
          "Total time plus per-section minutes and word counts show where the length lives.",
      },
    ],
    workedExample: {
      input:
        "Welcome back to the channel everyone\n\n### Main points\nThanks for all the support on this long video",
      output:
        "Total: 6s at 140 wpm · Intro: 6 words → 3s · Main points: 9 words → 4s (15 words total)",
      note: "Each marker creates its own section, and duration is section words ÷ speaking speed: 6 words at 140 wpm ≈ 2.6s (rounded to 3s) and 9 words ≈ 3.9s (rounded to 4s).",
    },
    limits: [
      "It estimates from word count only, so pacing, pauses, and ad-libs shift real recording time.",
      "Unmarked text is treated as an Intro section until you add a marker.",
      "Speech-rate presets are fixed; there is no custom wpm field.",
      "MM:SS markers are treated as section separators, not literal timestamps.",
    ],
    privacyNote:
      "Timing happens locally in your browser. Your script never leaves the page.",
    related: [
      {
        slug: "speaking-time",
        note: "A flat words → time estimate with no sectioning.",
      },
      {
        slug: "reading-time",
        note: "Minutes-to-read for written (not spoken) samples.",
      },
      {
        slug: "chapter-generator",
        note: "Turn a finished script into YouTube chapters.",
      },
    ],
  },
  "tweet-formatter": {
    examples: [
      {
        title: "Clean up a drafted tweet",
        description:
          "Remove doubled spaces, curly quotes, and stray newlines before pasting into X.",
      },
      {
        title: "Split a long post automatically",
        description:
          "When the cleaned text needs more than one tweet, it is split automatically into numbered tweets of up to 260 characters.",
      },
      {
        title: "Count exactly before you post",
        description:
          "The live 280-character counter shows exactly where you stand, thread or single tweet.",
      },
    ],
    faqs: [
      {
        question: "What does the formatter actually change?",
        answer:
          "It normalizes line endings, converts curly quotes and dashes to straight characters, collapses runs of spaces, trims blank lines, and trims the ends. Your words are otherwise untouched.",
      },
      {
        question: "How does the thread split work?",
        answer:
          "The tool packs cleaned sentences into blocks of up to 260 characters. If that takes more than one block, it shows them as numbered tweets (1/2, 2/2…), splitting only between sentences so text is never cut mid-word.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "The preview updates live and shows before/after character counts.",
      },
      {
        title: "Watch the counter",
        description:
          "The live 280 counter shows whether the cleaned text fits, and a numbered thread appears automatically when more than one tweet is needed.",
      },
      {
        title: "Copy what you need",
        description:
          "Copy formatted grabs the cleaned text; Copy thread grabs the whole numbered split when one is shown.",
      },
    ],
    workedExample: {
      input:
        "This is a long text.\n\n\nYou should format it  - properly!\n\n\n\nAnd finish here.\n\n",
      output:
        "Cleaned: 'This is a long text.\n\nYou should format it - properly!\n\nAnd finish here.' · 72/280 characters — fits in one tweet.",
      note: "Runs of spaces collapse, runs of three or more newlines collapse to a single blank line, dashes are normalized to hyphens, and trailing blank lines are trimmed — the words are unchanged.",
    },
    limits: [
      "The count uses JavaScript string length (UTF-16 code units), so an emoji occupies two slots and an emoji-heavy draft has less headroom than it looks.",
      "Thread blocks pack whole sentences up to 260 characters, so text is never cut mid-word; a single sentence longer than 260 keeps its full length in one block.",
      "The formatter does not rewrite your wording; it only cleans whitespace and quotes.",
      "X's live counting already includes URLs, so short links are recommended inside long tweets.",
    ],
    privacyNote:
      "Formatting and counting run entirely on your device. Your text is never uploaded.",
    related: [
      {
        slug: "thread-generator",
        note: "Split real sentences across tweets with numbering.",
      },
      {
        slug: "character-counter",
        note: "Raw 280 counts and keyword stats for any text.",
      },
      {
        slug: "linkedin-formatter",
        note: "The same normalization tuned for LinkedIn's editor.",
      },
    ],
  },
  "thread-generator": {
    examples: [
      {
        title: "Turn a paste of notes into a thread",
        description:
          "Drop a wall of sentences in and let the tool pack them into numbered 240-character tweets in order.",
      },
      {
        title: "Share a long explanation",
        description:
          "Keep full sentences intact across tweets instead of hard-cutting mid-word like a character limiter.",
      },
      {
        title: "Preview the whole arc",
        description:
          "The numbering and per-tweet counts show how the story flows before any line goes out.",
      },
    ],
    faqs: [
      {
        question: "How does this differ from a tweet limiter?",
        answer:
          "The thread generator splits on sentence boundaries, never mid-word, and packs one or more full sentences per tweet block. Character-based splitters can cut anywhere; here each tweet reads as a complete thought in sequence.",
      },
      {
        question: "What size does it allow per tweet?",
        answer:
          "It packs sentences up to a 240-character budget per tweet, so even the longest blocks steer clear of the 280 limit. Words that cannot fit begin the next tweet.",
      },
    ],
    howTo: [
      {
        title: "Write or paste your content",
        description:
          "Any text works — it is split into sentences first.",
      },
      {
        title: "Generate the thread",
        description:
          "Blocks are numbered 1/2, 2/2, and so on in reading order.",
      },
      {
        title: "Copy the whole thread",
        description:
          "Copy full thread grabs every numbered block in reading order.",
      },
    ],
    workedExample: {
      input:
        "Editing a video is mostly subtraction. You add value by removing the parts nobody needs. Cut every pause, every repeated word, every shot that says what the previous one already said. Do it early in the morning when you are fresh. Then watch it again tonight with colder eyes.",
      output:
        "2 tweets · Tweet 1/2 (230 chars): 'Editing a video is mostly subtraction. You add value by removing the parts nobody needs. Cut every pause, every repeated word, every shot that says what the previous one already said. Do it early in the morning when you are fresh.' · Tweet 2/2 (45 chars): 'Then watch it again tonight with colder eyes.'",
      note: "Sentences stay whole: the packer packs up to 240 characters a tweet, so the final short sentence starts its own block rather than being merged.",
    },
    limits: [
      "Blocks are words you supplied; the tool adds no formatting, emphasis, or hooks.",
      "A sentence longer than 240 characters becomes its own oversized block rather than being split.",
      "Sentence splitting relies on punctuation like . ! ?, so abbreviated text may mis-tokenize.",
      "Numbering is baked into each block, so reordering blocks after copying means re-numbering by hand.",
    ],
    privacyNote:
      "The split happens locally in your browser. Nothing is stored or sent to a server.",
    related: [
      {
        slug: "tweet-formatter",
        note: "Clean up and count a single tweet.",
      },
      {
        slug: "character-counter",
        note: "Check how close each block runs to 280.",
      },
      {
        slug: "linkedin-formatter",
        note: "The same cleanup, tuned for LinkedIn drafts.",
      },
    ],
  },
  "aspect-ratio-calculator": {
    examples: [
      {
        title: "Check a thumbnail ratio",
        description:
          "Enter 1280×720 to confirm a 16:9 canvas before exporting from any design tool.",
      },
      {
        title: "Compare a Short vs a video",
        description:
          "Flip between 1080×1920 (9:16) and 1920×1080 (16:9) to validate your crops.",
      },
      {
        title: "Match the nearest common ratio",
        description:
          "An odd dimension returns the closest of ten standard ratios, from 21:9 to 1:1.",
      },
    ],
    faqs: [
      {
        question: "How is the simplified ratio found?",
        answer:
          "The tool divides both sides by their greatest common divisor to produce the exact ratio, then rounds the decimal to four places. A separate card always shows which of ten common ratios your dimensions are closest to.",
      },
      {
        question: "Does it support vertical formats?",
        answer:
          "Yes. Swap width and height for 9:16 Shorts, or use the preset buttons for 1920×1080 (16:9), 1080×1920 (9:16), 1600×1200 (4:3), 1080×1080 (1:1), 3440×1440 (21:9), and 1500×1000 (3:2).",
      },
    ],
    howTo: [
      {
        title: "Enter width and height",
        description:
          "Use the numeric inputs or tap a preset like 1920×1080.",
      },
      {
        title: "Read the result triangle",
        description:
          "The simplified ratio, the decimal (to four places), and the nearest common ratio appear instantly.",
      },
      {
        title: "Copy what you need",
        description:
          "Copy the ratio, the decimal, or the dimension pair for your platform.",
      },
    ],
    workedExample: {
      input: "Width: 1920 · Height: 1080",
      output:
        "Ratio: 16:9 · Decimal: 1.7778 · Nearest common ratio: 16:9",
      note: "GCD(1920, 1080) = 120, giving the textbook 16:9; 1080×1920 mirrors it as 9:16.",
    },
    limits: [
      "The nearest-common-ratio list only knows ten presets (16:9 through 4:5).",
      "The simplified ratio is exact; the decimal is rounded to four places.",
      "Zero or negative inputs are not validated — the GCD still runs on absolute rounded values, so double-check your numbers.",
      "It reports the ratio math only — it does not crop or resize an image.",
    ],
    privacyNote:
      "All ratio math runs in your browser. No dimensions are uploaded.",
    related: [
      {
        slug: "ai-image-prompt-builder",
        note: "Feed the computed aspect into a prompt for image models.",
      },
      {
        slug: "color-palette-generator",
        note: "Pair the canvas shape with a matching palette.",
      },
      {
        slug: "thumbnail-text-checker",
        note: "Reuse the computed aspect when layouting thumbnail text.",
      },
    ],
  },
  "ai-cost-calculator": {
    examples: [
      {
        title: "Estimate a batch of generations",
        description:
          "Paste a prompt, enter the expected output size, and see the price across the 13 supported models at once.",
      },
      {
        title: "Compare an expensive and a cheap model",
        description:
          "Keep the same input and output sizes and switch from GPT-4o to GPT-4o mini to see the price gap in cents.",
      },
      {
        title: "Budget a content pipeline",
        description:
          "Run the same prompt through every model and pick the cheapest one that meets quality needs.",
      },
    ],
    faqs: [
      {
        question: "Are the prices live?",
        answer:
          "No. The calculator uses static per-million-token prices baked into the app for 13 popular models. They are a planning estimate, not a real-time bill, and can drift as providers republish pricing.",
      },
      {
        question: "How is the input token count derived?",
        answer:
          "It estimates tokens from character count (roughly one token per 4 characters) using each model's character-per-token constant, which is closer to 3.5 for Claude and a few Chinese-native models. Output tokens are estimated from the character count you enter, divided by the model's characters-per-token constant.",
      },
    ],
    howTo: [
      {
        title: "Enter your prompt and other text",
        description:
          "Input characters drive the input-token estimate.",
      },
      {
        title: "Set the output size",
        description:
          "Enter the output characters you expect; tokens are estimated as that count divided by the model's characters-per-token constant.",
      },
      {
        title: "Compare the table",
        description:
          "Every model row shows input cost, output cost, and total, so the cheapest option is visible at a glance.",
      },
    ],
    workedExample: {
      input:
        "Prompt: 'Hello' (1 token) · Output: '…500 characters…' (125 tokens) · Model: GPT-4o ($2.50/million input, $10/million output)",
      output:
        "Input tokens: 1 · Output tokens: 125 · GPT-4o: $0.001252 · GPT-4o mini: $0.000075",
      note: "Cost is (inputTokens ÷ 1M × inPrice) + (outputTokens ÷ 1M × outPrice), so GPT-4o is the 1 input token ($0.0000025) plus 125 output tokens ($0.00125). GPT-4o mini's cheaper unit rates make the same 1 + 125 tokens cost under a tenth of a cent.",
    },
    limits: [
      "Prices are a static snapshot of 13 models and can go stale as providers republish pricing.",
      "Token estimates are character-based; real tokenizers vary slightly between models.",
      "The output-token estimate comes from the character count you enter; it does not simulate a model run.",
      "Total cost is rounded to six decimals in the table, so sub-mill-cent rows may show $0.000000.",
    ],
    privacyNote:
      "Token math and pricing run entirely in your browser. Prompts and numbers are never uploaded.",
    related: [
      {
        slug: "ai-token-calculator",
        note: "Count tokens for any model without the price table.",
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
      answer: `Yes — ${tool.name} is free to use in your browser, and no account is required.`,
    },
    {
      question: `Does ${tool.name} upload my data?`,
      answer: `No. ${tool.name} runs in your browser, so the text, files, or images you work with are processed on your device.`,
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
      description: `Pick a ${category.name.toLowerCase()} and let the tool handle the rest — all processed right in your browser.`,
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
