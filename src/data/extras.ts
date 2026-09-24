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
  "find-and-replace": {
    examples: [
      {
        title: "Clean up a copied draft",
        description:
          "Fix a repeated typo across a pasted article: find the misspelling and replace every occurrence in one pass.",
      },
      {
        title: "Normalize a word or phrase",
        description:
          "Swap an outdated term, like newsletter for email, everywhere in a block of text.",
      },
      {
        title: "Work case-by-case",
        description:
          "Turn on **Case sensitive** to only touch exact matches and leave differently-cased variants alone.",
      },
    ],
    faqs: [
      {
        question: "Does Find & Replace support regex patterns?",
        answer:
          "No. The find box is treated as literal text in both modes — special characters like `.` and `*` are escaped automatically before matching. Use the Regex Tester when you need pattern-based matching.",
      },
      {
        question: "Does it replace every occurrence or just the first?",
        answer:
          "Every occurrence. Both the case-sensitive and case-insensitive modes replace all matches across the text; there is no find-next or approve-each-match flow.",
      },
      {
        question: "What happens if the search text isn't found?",
        answer:
          "The output stays identical to the input. When nothing matches, the tool simply returns the original text unchanged.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description: "Drop the source text into the input box.",
      },
      {
        title: "Set the find and replacement text",
        description:
          "Type the literal text to find and what to swap it for; check **Case sensitive** to require an exact case match.",
      },
      {
        title: "Copy the result",
        description:
          "The output updates live and is ready to copy from the output box.",
      },
    ],
    workedExample: {
      input: "The quick brown fox jumps over the lazy dog. The quick dog runs fast.",
      output: "The slow brown fox jumps over the lazy dog. The slow dog runs fast.",
      note: "With Case sensitive off, both lowercase instances of quick match and become slow. Every matching occurrence is replaced at once — there is no per-instance confirmation.",
    },
    limits: [
      "Matching is literal in both modes, never regex-based.",
      "Replacement applies to all occurrences at once; there is no per-match approval step.",
      "In the case-insensitive mode, `$` tokens such as `$&` in the replacement text expand as in a regex replace; check **Case sensitive** for a fully literal insertion.",
    ],
    privacyNote:
      "Replacement runs locally in your browser. Your text is never sent to a server.",
    related: [
      {
        slug: "case-converter",
        note: "Adjust capitalisation after you swap wording.",
      },
      {
        slug: "remove-duplicate-lines",
        note: "Clear repeated lines after replacing terms.",
      },
      {
        slug: "regex-tester",
        note: "When you need pattern-based matches instead of literal text.",
      },
    ],
  },
  "extract-urls": {
    examples: [
      {
        title: "Collect links from a post",
        description:
          "Paste a blog post or comment and pull out every http(s):// and www. link into a clean, copy-ready list.",
      },
      {
        title: "Collapse duplicates",
        description:
          "Repeated links appear once in the output even if they occur many times in the source.",
      },
      {
        title: "Audit outbound links",
        description:
          "Grab every link in a page's text to review where the links actually point.",
      },
    ],
    faqs: [
      {
        question: "Which URLs are detected?",
        answer:
          "Links starting with `http://`, `https://`, or `www.` followed by a dotted domain and an optional path. Bare domains like `example.com` and scheme-less links that don't use `www.` are not picked up.",
      },
      {
        question: "Are duplicates removed?",
        answer:
          "Yes. The URL list is deduplicated, so the same link that appears ten times is listed once, and the counter reflects unique URLs.",
      },
      {
        question: "Is this full URL parsing?",
        answer:
          "No. It is a pragmatic pattern match, not a standards-compliant parser. A period that ends a sentence directly after a path is kept as part of the URL.",
      },
    ],
    howTo: [
      {
        title: "Paste the source text",
        description: "Any text that may contain links works.",
      },
      {
        title: "Read the count",
        description:
          "The **URLs found** counter shows how many unique links were detected.",
      },
      {
        title: "Copy the list",
        description: "Every unique URL is listed one per line for copying.",
      },
    ],
    workedExample: {
      input:
        "Read the guide at https://example.com/page or follow www.example.org for updates; the old http://example.com/demo is archived.",
      output:
        "URLs found: 3\nhttps://example.com/page\nwww.example.org\nhttp://example.com/demo",
      note: "The bare domain `example.com` (no scheme or `www.`) is not matched, and the three discovered links are deduplicated and listed one per line.",
    },
    limits: [
      "Only `http://`, `https://`, and `www.`-prefixed links match; other schemes like `mailto:` or `ftp:` are ignored.",
      "Matching is pattern-based, not a full URL parser, so oddities like trailing punctuation in a path are kept verbatim.",
      "A dotted domain is required, so local hosts such as `https://localhost` are skipped.",
    ],
    privacyNote:
      "Extraction runs entirely in your browser. Your text is never uploaded.",
    related: [
      {
        slug: "extract-emails",
        note: "Pull addresses from the same source text.",
      },
      {
        slug: "extract-numbers",
        note: "Collect numeric values alongside links.",
      },
    ],
  },
  "extract-emails": {
    examples: [
      {
        title: "Gather contacts from a thread",
        description:
          "Paste an email thread or support log and collect every address into a clean list.",
      },
      {
        title: "Deduplicate a mailing list",
        description:
          "Repeated addresses collapse to a single entry, keeping your list tidy.",
      },
      {
        title: "Check a footer",
        description:
          "Verify which addresses actually appear in a page or newsletter text.",
      },
    ],
    faqs: [
      {
        question: "What counts as an email address?",
        answer:
          "A local part of letters, digits, dots and the `+`, `-`, `_`, `%` signs, followed by a domain with a two-letter-or-longer extension such as `example.com` or `mail.example.com`. One-letter TLDs like `a@b.c` do not match.",
      },
      {
        question: "Are duplicates removed?",
        answer:
          "Yes. The same address is listed only once and the counter reflects unique addresses.",
      },
      {
        question: "Is this RFC-perfect email parsing?",
        answer:
          "No. It is a practical pattern match: unusual-but-valid addresses can be mis-split or missed, and the tool never verifies that a mailbox actually exists.",
      },
    ],
    howTo: [
      {
        title: "Paste the source text",
        description: "Drop in any text that may contain addresses.",
      },
      {
        title: "Read the count",
        description:
          "The **Emails found** counter shows how many unique addresses were detected.",
      },
      {
        title: "Copy the list",
        description: "One address per line, ready to paste elsewhere.",
      },
    ],
    workedExample: {
      input:
        "Need help? Write to support@example.com or john.doe+jobs@mail.example.com. (support@example.com appears twice.)",
      output:
        "Emails found: 2\nsupport@example.com\njohn.doe+jobs@mail.example.com",
      note: "The repeated `support@example.com` is listed once thanks to deduplication, and a local part with a `+` tag such as `john.doe+jobs` is kept intact.",
    },
    limits: [
      "A two-letter-or-longer top-level domain is required, so short forms like `a@b.c` are not matched.",
      "Pattern-based rather than RFC-compliant: quoted local parts or addresses joined by odd punctuation can be missed or split.",
      "Extraction is deterministic — it does not check whether a mailbox exists or is deliverable.",
    ],
    privacyNote:
      "Extraction happens locally in your browser. Your text never leaves the page.",
    related: [
      {
        slug: "extract-urls",
        note: "Grab the links in the same source text.",
      },
      {
        slug: "extract-numbers",
        note: "Collect the numbers alongside the addresses.",
      },
    ],
  },
  "extract-numbers": {
    examples: [
      {
        title: "Pull totals from an order",
        description:
          "Extract quantities, prices and negative adjustments from order or invoice text.",
      },
      {
        title: "Sum numbers in prose",
        description:
          "Collect numeric values scattered across a paragraph and see their total in the **Sum** readout.",
      },
      {
        title: "Convert a recipe",
        description:
          "Grab the measurements, including decimals like 1.5, for easy scaling.",
      },
    ],
    faqs: [
      {
        question: "What kinds of numbers match?",
        answer:
          "Integers, negatives with a leading minus, and decimals using either a dot or a comma as the separator (1.5 or 2,5). Percentages match as the bare number — 50% becomes 50.",
      },
      {
        question: "Is the comma a thousands separator?",
        answer:
          "No. A comma is treated as a decimal separator, so 1,234 is one number that counts as about 1.234 toward the sum — not one thousand two hundred and thirty-four.",
      },
      {
        question: "How is the sum computed?",
        answer:
          "Each match is parsed with a comma converted to a dot and added to the total, which is formatted with up to four decimal digits.",
      },
    ],
    howTo: [
      {
        title: "Paste the text",
        description: "Any text containing numeric values works.",
      },
      {
        title: "Check the count and sum",
        description:
          "The **Numbers found** counter and **Sum** update live as you type.",
      },
      {
        title: "Copy the list",
        description: "Each number appears on its own line in the output box.",
      },
    ],
    workedExample: {
      input:
        "Order 3 apples, -2 refunds, 1.5 kg at 9.99 each, plus 1,234 items and a 50% discount.",
      output:
        "Numbers found: 6\n3\n-2\n1.5\n9.99\n1,234\n50\nSum: 63.724",
      note: "A comma is never a thousands separator: 1,234 is a single match that contributes 1.234 to the sum, and 50% is extracted as the bare number 50.",
    },
    limits: [
      "Only decimal separators are recognised — 1,000,000 is matched in parts, not as one million.",
      "A hyphen before a digit is treated as a minus sign, so a range like 10-20 yields 10 and -20.",
      "Dates like 2024-05-01 split into parts, and currency symbols like `$` in $9.99 are left out.",
    ],
    privacyNote:
      "Extraction and summation run locally in your browser. Nothing is uploaded.",
    related: [
      {
        slug: "extract-urls",
        note: "Find the links in the same text.",
      },
      {
        slug: "extract-emails",
        note: "Pull the email addresses too.",
      },
    ],
  },
  "text-diff": {
    examples: [
      {
        title: "Review an edited draft",
        description:
          "Compare the original and revised versions of a post to see exactly which lines changed.",
      },
      {
        title: "Check config changes",
        description:
          "Diff two versions of a settings file or list to confirm what was added or removed.",
      },
      {
        title: "Verify copy edits",
        description:
          "Confirm a rewrite only touched the intended lines and nothing else drifted.",
      },
    ],
    faqs: [
      {
        question: "How are differences calculated?",
        answer:
          "The two inputs are compared line by line using a longest-common-subsequence algorithm: identical lines stay put, removed lines show struck through, and added lines are highlighted.",
      },
      {
        question: "Is the comparison word-based?",
        answer:
          "No. It is strictly line-based — a single changed word on an otherwise unchanged line shows as that whole line removed and the new line added.",
      },
      {
        question: "Can I copy the diff?",
        answer:
          "The comparison is a read-only visual view, so there is no plain-text diff export. The **Additions** and **Removals** counters report the totals.",
      },
    ],
    howTo: [
      {
        title: "Paste the original",
        description: "The starting version goes in **Original**.",
      },
      {
        title: "Paste the revised version",
        description: "The updated text goes in **New**.",
      },
      {
        title: "Read the colors",
        description:
          "Added lines show highlighted, removed lines struck through, and identical lines stay grey.",
      },
    ],
    workedExample: {
      input:
        "Original:\nalpha\nbeta\ngamma\ndelta\n\nNew:\nalpha\nbeta2\ngamma\ndelta2",
      output: "Additions: 2 · Removals: 2",
      note: "The two identical lines (alpha, gamma) are kept in place, while beta→beta2 and delta→delta2 each show as one removed and one added line rather than a character-level edit.",
    },
    limits: [
      "Comparison is line-based only, so one changed character marks the whole line as changed.",
      "The diff view is read-only — there is no text output to copy or download.",
      "Blank lines are compared like any other line, so stray empty lines appear as added or removed rows.",
    ],
    privacyNote:
      "Diffing runs locally in your browser. Neither input leaves your device.",
    related: [
      {
        slug: "json-compare",
        note: "Compare two JSON documents with a paired view.",
      },
      {
        slug: "case-converter",
        note: "Normalise case on a copy before you diff it.",
      },
    ],
  },
  "json-validator": {
    examples: [
      {
        title: "Validate an API response",
        description:
          "Paste a JSON payload and confirm it parses cleanly before wiring it into code.",
      },
      {
        title: "Find the typo fast",
        description:
          "Trailing commas and unquoted keys are flagged with the parser's message and the exact character position.",
      },
      {
        title: "Inspect structure",
        description:
          "Valid JSON reports its root type, depth, total key count and top-level members at a glance.",
      },
    ],
    faqs: [
      {
        question: "Does it validate against a JSON Schema?",
        answer:
          "No. This tool checks JSON syntax with the browser's own JSON parser. It does not validate structure against a JSON Schema or enforce required fields.",
      },
      {
        question: "What makes JSON invalid here?",
        answer:
          "Anything the standard parser rejects: trailing commas, single-quoted strings, unquoted property names, comments and control characters inside strings all raise an error.",
      },
      {
        question: "What do the stats mean?",
        answer:
          "**Root type** is the top-level kind (object, array, string, number, boolean, null), **Depth** counts nested object/array levels, **Total keys** counts every key recursively, and **Top-level** is the number of first-level members.",
      },
    ],
    howTo: [
      {
        title: "Paste your JSON",
        description: "Drop valid or invalid JSON into the input.",
      },
      {
        title: "Watch the badge",
        description:
          "A green **Valid JSON** badge appears when the text parses; otherwise a red badge shows the parser message and a character position.",
      },
      {
        title: "Use the formatted output",
        description:
          "Valid input is pretty-printed with two-space indentation in the output box for copying.",
      },
    ],
    workedExample: {
      input:
        '{ "name": "Ada", "tags": ["ai", "code"], "meta": { "count": 2 }, "ok": true }',
      output:
        "Valid JSON · Root type: object · Total keys: 5 · Top-level keys: 4 · Depth: 2",
      note: "Adding a trailing comma after the last value would flip the badge to Invalid and report an error such as `Expected double-quoted property name in JSON at position 17`, with a matching character-position hint.",
    },
    limits: [
      "Validation is syntax-only — it never checks schema, required fields or value types against a contract.",
      "The character position comes from the runtime's error message and is a best-effort hint, not a styled cursor.",
      "JSON5-style extensions like comments or unquoted keys fail, because they are not part of standard JSON.",
    ],
    privacyNote:
      "Parsing and formatting run entirely in your browser. Your JSON is never sent to a server.",
    related: [
      {
        slug: "json-formatter",
        note: "Beautify or minify the payload.",
      },
      {
        slug: "json-to-csv",
        note: "Convert validated records into a table.",
      },
      {
        slug: "json-compare",
        note: "Spot differences between two documents.",
      },
    ],
  },
  "regex-tester": {
    examples: [
      {
        title: "Test a pattern before shipping",
        description:
          "Validate a regex against realistic sample text before using it in code.",
      },
      {
        title: "Inspect capture groups",
        description:
          "Each match reports its index and any capturing-group values in the details list.",
      },
      {
        title: "Refine step by step",
        description:
          "Adjust flags and watch matches, highlights and totals update live.",
      },
    ],
    faqs: [
      {
        question: "Which flags does the tool support?",
        answer:
          "`g` (global), `i` (ignore case), `m` (multiline) and `s` (dotall) are available as checkboxes. The `g` flag is always applied internally so every match is listed and highlighted, even if you uncheck it.",
      },
      {
        question: "How do matches show up?",
        answer:
          "The test string is rendered with each match highlighted, a **Matches** counter shows the total, and the details list reports each match's index plus capture-group values.",
      },
      {
        question: "What happens with an invalid pattern?",
        answer:
          "The pattern is caught before matching and its error message appears in a red box; matches stay empty until the pattern is fixed.",
      },
    ],
    howTo: [
      {
        title: "Enter the pattern",
        description:
          "Type a regex without slashes or flags; select the g/i/m/s flags you need.",
      },
      {
        title: "Paste the test string",
        description: "The text to search against updates the matches live.",
      },
      {
        title: "Read and copy the results",
        description:
          "Full matches and the match details (index and groups) are available to copy.",
      },
    ],
    workedExample: {
      input: "Start 09:15, break at 10:30, done 11:45. Pattern: (\\d{2}):(\\d{2})",
      output:
        "Matches: 3\n1. 09:15 @ 6 · groups: 09, 15\n2. 10:30 @ 22 · groups: 10, 30\n3. 11:45 @ 34 · groups: 11, 45",
      note: "The two capture groups are reported per match — first the hour, then the minute — and every occurrence is matched because the global flag is always force-enabled.",
    },
    limits: [
      "Patterns run on the browser's native JavaScript regex engine, so newer features require a current browser.",
      "This is a matching tool only — there is no find-and-replace mode here.",
      "The global flag is always on, so all matches are found and shown, never just the first.",
    ],
    privacyNote:
      "Matching runs locally in your browser. Patterns and test strings never leave the page.",
    related: [
      {
        slug: "find-and-replace",
        note: "Do literal text replacements across a document.",
      },
      {
        slug: "extract-emails",
        note: "Skip the pattern and pull addresses directly.",
      },
    ],
  },
  "json-to-csv": {
    examples: [
      {
        title: "Export an API array to a table",
        description:
          "Turn a list of objects into a header row plus one CSV line per object.",
      },
      {
        title: "Flatten for spreadsheets",
        description:
          "Keys are unioned across objects, so every record keeps its own columns even when the shapes differ.",
      },
      {
        title: "Prepare a database import",
        description:
          "Convert JSON records into CSV ready for a spreadsheet or database import.",
      },
    ],
    faqs: [
      {
        question: "What JSON shapes are accepted?",
        answer:
          "A top-level array of objects, or a single object treated as a one-row array. Nested values are stringified — arrays join with commas and objects become `[object Object]`.",
      },
      {
        question: "How are headers chosen?",
        answer:
          "The header row is the union of all object keys in first-seen order. Objects missing a key get an empty cell in that column.",
      },
      {
        question: "Is the output properly quoted?",
        answer:
          "Yes. Cells containing a comma, double quote or newline are wrapped in quotes with inner quotes doubled, which is the standard CSV escaping. Empty values are left blank.",
      },
    ],
    howTo: [
      {
        title: "Paste valid JSON",
        description: "An array of objects, or a single object.",
      },
      {
        title: "Clear any error",
        description:
          "Invalid JSON, empty arrays and non-object items each surface a clear message under the input.",
      },
      {
        title: "Copy the CSV",
        description:
          "The table output is ready to copy to a clipboard or download as output.csv.",
      },
    ],
    workedExample: {
      input:
        '[{"id":1,"name":"Ada","tags":["ai"]},{"id":2,"name":"Grace, M.","tags":[]},{"name":"Linus"}]',
      output:
        'id,name,tags\n1,Ada,ai\n2,"Grace, M.",\n,Linus,',
      note: "Headers are the union id, name, tags in first-seen order; the cell with a comma, Grace, M., is quoted, [\"ai\"] stringifies to ai, and Linus leaves the missing id blank.",
    },
    limits: [
      "Only arrays of objects (or a single object) convert — a bare array of scalars shows `JSON must contain objects.`",
      "Nested arrays and objects are not recursively flattened: an array becomes its comma-joined items and an object becomes `[object Object]`.",
      "Quoting covers cells with commas, quotes or newlines; multi-line records are not supported.",
    ],
    privacyNote: "Conversion runs in your browser. No JSON is uploaded.",
    related: [
      {
        slug: "csv-to-json",
        note: "Go the other way and turn rows back into objects.",
      },
      {
        slug: "json-validator",
        note: "Validate the payload before converting it.",
      },
      {
        slug: "json-formatter",
        note: "Clean up the source JSON first.",
      },
    ],
  },
  "csv-to-json": {
    examples: [
      {
        title: "Import a spreadsheet dump",
        description:
          "Paste a CSV export and turn the rows into JSON objects keyed by the header row.",
      },
      {
        title: "Handle quoted commas",
        description:
          "Cells wrapped in quotes, like a city of London, UK, stay intact instead of splitting.",
      },
      {
        title: "Work without headers",
        description:
          "Turn off **First row is a header** and columns are named col1, col2 and so on.",
      },
    ],
    faqs: [
      {
        question: "How are rows parsed?",
        answer:
          "Each line becomes one row split on commas while respecting quoted cells. A doubled quote inside a quoted cell becomes a literal quote, and commas inside quotes are not split.",
      },
      {
        question: "Does it follow RFC 4180 fully?",
        answer:
          "Not entirely. Quoting and doubled quotes are handled, but a quoted field cannot span multiple lines — a newline inside a quoted cell ends the record.",
      },
      {
        question: "What happens to headers and empty cells?",
        answer:
          "With **First row is a header** on, row one names the keys; with it off, columns get col1, col2, and so on. A missing cell becomes an empty string in the object.",
      },
    ],
    howTo: [
      {
        title: "Paste the CSV",
        description: "Rows separated by newlines.",
      },
      {
        title: "Choose the header option",
        description:
          "Keep **First row is a header** on when the first line holds column names.",
      },
      {
        title: "Copy the JSON",
        description:
          "The pretty-printed array is ready to copy or download.",
      },
    ],
    workedExample: {
      input:
        "name,email,city\nAda,ada@example.com,\"London, UK\"\nBo,bo@example.com,Berlin",
      output:
        '[\n  {\n    "name": "Ada",\n    "email": "ada@example.com",\n    "city": "London, UK"\n  },\n  {\n    "name": "Bo",\n    "email": "bo@example.com",\n    "city": "Berlin"\n  }\n]',
      note: "The quoted city cell London, UK is preserved around its comma and mapped to the city header; each data row becomes one object keyed by the header names.",
    },
    limits: [
      "Blank and whitespace-only lines are skipped, but non-empty cells are otherwise kept verbatim with no trimming.",
      "Quoted fields must stay on a single line; multiline quoted values are not supported.",
      "Missing cells become empty strings rather than null.",
    ],
    privacyNote:
      "Parsing runs locally in your browser. Nothing is uploaded.",
    related: [
      {
        slug: "json-to-csv",
        note: "Convert JSON records back into a table.",
      },
      {
        slug: "json-validator",
        note: "Validate the resulting JSON before you use it.",
      },
    ],
  },
  "password-strength-checker": {
    examples: [
      {
        title: "Score a draft password",
        description:
          "Type a candidate and see its score out of 10 with a plain-language checklist.",
      },
      {
        title: "Tighten the weak spots",
        description:
          "Each unfulfilled rule is spelled out, so you know exactly what to add next.",
      },
      {
        title: "Compare two candidates",
        description:
          "Test replacements against each other and keep the higher-scoring option.",
      },
    ],
    faqs: [
      {
        question: "How is the score calculated?",
        answer:
          "Points come from length (8+ and 12+), a mix of upper- and lowercase, digits, symbols, and avoiding four identical characters in a row, capped at 10. Labels are Strong (8–10), Medium (5–7), Weak (3–4) and Very weak (0–2).",
      },
      {
        question: "Does a high score mean the password is safe?",
        answer:
          "No. The score only reflects five simple heuristics. It does not check dictionaries, common passwords, sequences or leaked-password lists, and it says nothing about whether you reused the password elsewhere.",
      },
      {
        question: "Is my password sent anywhere?",
        answer:
          "No. Scoring runs entirely on the page, so the password never leaves your browser.",
      },
    ],
    howTo: [
      {
        title: "Type a password",
        description: "The field masks the text as you type.",
      },
      {
        title: "Read the score and rules",
        description:
          "The score, colour bar, label and checklist update live.",
      },
      {
        title: "Iterate",
        description:
          "Follow the unfulfilled checks to raise the score before you adopt the password.",
      },
    ],
    workedExample: {
      input: "Tr0ub4dor&3",
      output:
        "8 / 10 · Strong\nAt least 8 characters ✓\nMix of upper and lowercase ✓\nIncludes numbers ✓\nIncludes symbols ✓\nNo long repeated characters ✓",
      note: "Eleven characters with mixed case, a digit and a symbol reach 8/10 Strong — but this is only the rule-based score; it does not check that the password isn't a common or leaked one.",
    },
    limits: [
      "The check is a length/character-class heuristic, not an attacker model: it never tests dictionary words, sequences or breached-password lists.",
      "The repeated-character rule triggers on four identical characters in a row, so long but predictable passwords can still score high.",
      "A good score does not mean the password is unique or uncompromised.",
    ],
    privacyNote:
      "The password is evaluated only in your browser and is never transmitted or stored.",
    related: [
      {
        slug: "password-generator",
        note: "Create a strong, random password to test here.",
      },
      {
        slug: "sha256-generator",
        note: "Fingerprint your credentials text locally.",
      },
    ],
  },
  "sha256-generator": {
    examples: [
      {
        title: "Hash a string in the browser",
        description:
          "Turn any text into its fixed-length SHA-256 digest for integrity checks.",
      },
      {
        title: "Verify a known digest",
        description:
          "Recompute a hash locally and compare it to the value you were given.",
      },
      {
        title: "Fingerprint a snippet",
        description:
          "A short text maps to a 64-hex-character fingerprint that changes completely if even one character changes.",
      },
    ],
    faqs: [
      {
        question: "Is hashing the same as encryption?",
        answer:
          "No. SHA-256 is a one-way hash: the digest cannot be turned back into the original text and there is no key. It is used for integrity and fingerprinting, not for storing data confidentially and recovering it later.",
      },
      {
        question: "Does it hash files?",
        answer:
          "No. The input is a single text field — to digest a file, paste its contents as a string.",
      },
      {
        question: "Is the digest standard?",
        answer:
          "Yes. It uses the browser's Web Crypto SHA-256 implementation, so the 64-character lowercase hex digest matches any other SHA-256 tool for the same UTF-8 input.",
      },
    ],
    howTo: [
      {
        title: "Type or paste text",
        description: "The input box holds the text to hash.",
      },
      {
        title: "Click Compute SHA-256",
        description:
          "The digest is calculated on demand with the browser's Web Crypto API.",
      },
      {
        title: "Copy the digest",
        description:
          "The 64-character lowercase hex string is ready to copy or download.",
      },
    ],
    workedExample: {
      input: "hello",
      output:
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
      note: "This is the standard SHA-256 digest of hello — 64 lowercase hex characters, identical to what any other SHA-256 tool produces for the same input.",
    },
    limits: [
      "Hashing is one-way: a digest cannot be reversed or decrypted back into the input.",
      "Only text input is supported — there is no file upload.",
      "The Web Crypto API requires a secure (HTTPS) context in most browsers, so the hash button may error on a plain-HTTP local page.",
    ],
    privacyNote:
      "Hashing runs locally with the browser's Web Crypto API. Your text is never sent to a server.",
    related: [
      {
        slug: "password-generator",
        note: "Generate the strong string to fingerprint.",
      },
      {
        slug: "base64-encoder",
        note: "Encode text instead of hashing it.",
      },
    ],
  },
  "faq-schema-generator": {
    examples: [
      {
        title: "Build FAQPage markup",
        description:
          "Paste your questions and answers and get schema.org FAQPage JSON-LD for your page.",
      },
      {
        title: "Reuse existing FAQs",
        description:
          "Format the Q&As you already publish into structured data without hand-writing JSON.",
      },
      {
        title: "Validate the output",
        description:
          "Copy the generated JSON-LD into the JSON validator to confirm it parses before adding it to your page.",
      },
    ],
    faqs: [
      {
        question: "What input format does it expect?",
        answer:
          "One item per line. Questions start with `Q:`, `Q1:` (or `Question:`), and their answer follows on the next line starting with `A:` / `A2:` and so on. Any question without a matching answer is left out.",
      },
      {
        question: "Does the schema guarantee search rich results?",
        answer:
          "No. Markup helps search engines understand the page but does not guarantee rich results — and rich results require the markup to genuinely reflect visible page content.",
      },
      {
        question: "What structure is produced?",
        answer:
          "A schema.org FAQPage object with one Question entry per pair, each containing a `name` and an `acceptedAnswer` with a `text` field, in standard JSON-LD with a `@context` of `https://schema.org`.",
      },
    ],
    howTo: [
      {
        title: "Enter Q&A pairs",
        description:
          "One question and one answer per line using the `Q:` / `A:` prefixes.",
      },
      {
        title: "Fix any error message",
        description:
          "At least one complete Q&A pair is required; an orphan question alone shows a hint with the expected format.",
      },
      {
        title: "Copy the schema",
        description:
          "Pretty-printed JSON-LD is ready to paste into your page's head or a structured-data testing tool.",
      },
    ],
    workedExample: {
      input:
        "Q: What is this tool?\nA: It builds FAQPage schema markup.\nQ2: Is it free?\nA2: Yes, it runs in your browser.",
      output:
        'FAQPage JSON-LD with 2 questions\n{ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ { "@type": "Question", "name": "What is this tool", "acceptedAnswer": { "@type": "Answer", "text": "It builds FAQPage schema markup." } }, { "@type": "Question", "name": "Is it free", "acceptedAnswer": { "@type": "Answer", "text": "Yes, it runs in your browser." } } ] }',
      note: "The parser strips the `Q:` / `Q2:` prefixes, removes a trailing `?` from each question text, and pairs it with the following answer into a Question/acceptedAnswer entry.",
    },
    limits: [
      "Input is parsed line by line with `Q:` / `A:` prefixes — free-form lists, bullet FAQs or question-and-answer on a single line are not recognised.",
      "A question without a matching answer is dropped, and the whole output requires at least one complete pair.",
      "Schema markup alone does not guarantee rich results; the page must genuinely contain the questions and answers.",
    ],
    privacyNote:
      "Schema generation runs locally in your browser. Your Q&A text is never uploaded.",
    related: [
      {
        slug: "json-validator",
        note: "Confirm the generated JSON-LD parses cleanly.",
      },
    ],
  },
  "image-converter": {
    examples: [
      {
        title: "Keep transparency in a logo",
        description:
          "Convert a PNG logo to WebP and keep its transparent background for a web build.",
      },
      {
        title: "Flatten a photo for sharing",
        description:
          "Convert an opaque photo to JPEG at the default 85% quality to shrink it for email or social uploads.",
      },
      {
        title: "Batch a photo set",
        description:
          "Add several images and convert them at once; multiple outputs download together as converted-images.zip.",
      },
    ],
    faqs: [
      {
        question: "Does JPEG keep transparency?",
        answer:
          "No. JPEG has no alpha channel, so the tool fills the canvas with solid white before encoding. If you want transparency preserved, choose PNG or WebP.",
      },
      {
        question: "Does the quality slider affect every format?",
        answer:
          "No. It applies only to JPEG and WebP. PNG is lossless, so the quality control is ignored for that target and the full pixels are kept.",
      },
      {
        question: "What happens to animated GIFs?",
        answer:
          "The image is decoded by your browser and drawn to a canvas, so an animated GIF converts from its first frame only — the animation is not preserved.",
      },
      {
        question: "Why did multiple files download as a ZIP?",
        answer:
          "When you convert more than one image, they are packed into an archive named converted-images.zip. A single image downloads directly with its new extension.",
      },
    ],
    howTo: [
      {
        title: "Add your images",
        description:
          "Use Add images to pick one or more files. Anything your browser can decode is accepted — JPG, PNG, WebP, GIF, and more.",
      },
      {
        title: "Pick a target format and quality",
        description:
          "Choose PNG, JPEG (the default), or WebP. The quality slider (default 85%) applies to JPEG and WebP only.",
      },
      {
        title: "Convert and download",
        description:
          "Click Convert, then grab the downloaded file — or the ZIP when you converted more than one.",
      },
    ],
    workedExample: {
      input: "logo.png (with transparency) → target JPEG",
      output: "logo.jpg · transparent areas rendered solid white · quality 85%",
      note: "JPEG has no alpha channel, so the canvas is filled with white before encoding. Choosing PNG or WebP instead preserves the transparency.",
    },
    limits: [
      "Supported output formats are PNG, JPEG, and WebP; any file your browser cannot decode fails with the status 'One or more files could not be converted.'",
      "JPEG fills transparency with white — only PNG and WebP keep an alpha channel.",
      "Images are not resized: the output keeps the source pixel dimensions.",
      "Animated GIFs convert from their first frame, and very large images can hit browser memory limits during canvas encoding.",
    ],
    privacyNote:
      "Conversion happens entirely in your browser with the built-in canvas API. The images you pick are read locally and never uploaded.",
    related: [
      {
        slug: "image-to-pdf",
        note: "Package converted images into a single PDF document.",
      },
      {
        slug: "aspect-ratio-calculator",
        note: "Confirm the ratio before you export.",
      },
      {
        slug: "color-palette-generator",
        note: "Build a palette to match the converted image.",
      },
    ],
  },
  "video-converter": {
    examples: [
      {
        title: "Re-encode a file for the web",
        description:
          "Convert an MP4 to WebM (VP9) for a smaller, browser-friendly version.",
      },
      {
        title: "Turn a clip into an animated GIF",
        description:
          "Use the GIF target, which encodes at 12 fps scaled to a 480px-wide frame, for a quick preview loop.",
      },
      {
        title: "Pull the audio track",
        description:
          "Choose MP3 to drop the video stream and keep only the audio from a file.",
      },
    ],
    faqs: [
      {
        question: "Is this a real transcode?",
        answer:
          "Yes. Conversion runs FFmpeg compiled to WebAssembly inside your browser, so the video is genuinely re-encoded with libx264, VP9, or the target codec — not just repackaged.",
      },
      {
        question: "Why did the first conversion take so long?",
        answer:
          "Before the first conversion the tool downloads the FFmpeg engine (~30 MB) from a CDN. Later conversions reuse the engine held in memory.",
      },
      {
        question: "Do bigger files cause issues?",
        answer:
          "Encoding happens in the browser's memory, so very large or long files can fail or take noticeably longer depending on your device. There is no server-side fallback.",
      },
      {
        question: "What formats can I output?",
        answer:
          "MP4 (H.264), WebM (VP9), MOV (H.264), MKV (H.264), animated GIF (12 fps, scaled to 480px wide), and MP3 (audio only).",
      },
    ],
    howTo: [
      {
        title: "Choose a video file",
        description:
          "Pick a single file — MP4, WebM, MOV, AVI, MKV, and more are accepted.",
      },
      {
        title: "Select the target format",
        description:
          "MP4 is the default; choose WebM, MOV, MKV, GIF, or MP3 from the dropdown.",
      },
      {
        title: "Watch the progress and download",
        description:
          "A progress bar fills as FFmpeg runs; the converted file downloads with your original filename and the new extension.",
      },
    ],
    workedExample: {
      input: "clip.mp4 → target MP3",
      output: "clip.mp3 · video stream removed (-vn), audio re-encoded with libmp3lame",
      note: "The MP3 target runs FFmpeg with -vn, so the output contains only the audio stream; no video frames are included.",
    },
    limits: [
      "Conversion is real re-encoding with the FFmpeg core, delivered as WebAssembly; speed depends on your device, file length, and resolution.",
      "The output formats are fixed — MP4, WebM, MOV, MKV, GIF, and MP3 — with preset encoding settings (libx264 CRF 23, VP9 CRF 32, etc.).",
      "The GIF target always encodes at 12 fps and scales to a maximum width of 480px.",
      "Only one file converts at a time, and large files can hit browser memory limits.",
    ],
    privacyNote:
      "The video is processed locally by FFmpeg in WebAssembly, so its bytes stay in your browser. The engine itself (~30 MB) is fetched from a CDN on first use.",
    related: [
      {
        slug: "audio-converter",
        note: "Re-encode audio files with the same engine.",
      },
      {
        slug: "image-converter",
        note: "Convert still images or the first frame of a GIF.",
      },
      {
        slug: "ocr",
        note: "Pull selectable text from a recorded frame instead.",
      },
    ],
  },
  "audio-converter": {
    examples: [
      {
        title: "Shrink a voice note",
        description:
          "Convert an M4A recording to MP3 for a smaller, widely-compatible file.",
      },
      {
        title: "Hand off a WAV",
        description:
          "Decode a lossy source into an uncompressed WAV for editing in a DAW.",
      },
      {
        title: "Archive in FLAC",
        description:
          "Re-encode to FLAC for a file that loses nothing further during conversion.",
      },
    ],
    faqs: [
      {
        question: "Is this a real re-encode?",
        answer:
          "Yes. Audio is decoded and re-encoded in your browser by FFmpeg compiled to WebAssembly, with codec targets of MP3 (libmp3lame), WAV (16-bit PCM), OGG Vorbis, M4A (AAC 192 kbit/s), FLAC, and AAC.",
      },
      {
        question: "Is FLAC truly lossless here?",
        answer:
          "The FLAC target uses the FLAC encoder, so no further quality is lost during conversion — but the result is only as good as the source. Converting an MP3 to FLAC does not recover detail the MP3 already removed.",
      },
      {
        question: "Why does the first conversion download something?",
        answer:
          "The FFmpeg engine (~30 MB) is fetched from a CDN on first use and kept in memory afterwards.",
      },
      {
        question: "Can I convert multiple files at once?",
        answer:
          "No — this tool converts one audio file at a time.",
      },
    ],
    howTo: [
      {
        title: "Choose an audio file",
        description:
          "Pick a single file — MP3, WAV, OGG, M4A, FLAC, AAC, OPUS, and more.",
      },
      {
        title: "Pick the target format",
        description:
          "MP3 is the default; the other options are WAV, OGG (Vorbis), M4A (AAC), FLAC, and AAC.",
      },
      {
        title: "Convert and download",
        description:
          "Watch the progress bar, then grab the file, which keeps your original base name with the new extension.",
      },
    ],
    workedExample: {
      input: "podcast-episode.mp3 → target WAV",
      output: "podcast-episode.wav · decoded to uncompressed 16-bit PCM and downloaded",
      note: "The WAV target uses the pcm_s16le codec, producing an uncompressed file that is typically much larger than the source.",
    },
    limits: [
      "One file converts at a time — there is no batch mode.",
      "Output codecs are fixed: MP3, WAV, OGG Vorbis, M4A (AAC), FLAC, and AAC, with preset settings such as 192 kbit/s AAC.",
      "FLAC and WAV preserve the decoded audio but cannot add detail the source already lost — an MP3 converted to FLAC keeps the MP3's quality.",
      "Very long files can be slow or fail in browser memory; encoding speed depends on the device.",
    ],
    privacyNote:
      "Decoding and encoding run locally with FFmpeg WebAssembly, so the audio stays in your browser. The engine (~30 MB) downloads from a CDN the first time you convert.",
    related: [
      {
        slug: "video-converter",
        note: "Extract the audio track from a video file.",
      },
      {
        slug: "image-converter",
        note: "Batch-convert images alongside your audio.",
      },
      {
        slug: "ocr",
        note: "Read audio labels or transcripts from images.",
      },
    ],
  },
  "ocr": {
    examples: [
      {
        title: "Extract a screenshot",
        description:
          "Drop a screenshot of a message or error dialog and copy the text out for editing.",
      },
      {
        title: "Read a scanned page",
        description:
          "Scan a document, upload the image, and pull the printed text into a copyable output box.",
      },
      {
        title: "OCR a multi-page PDF",
        description:
          "Give the tool a PDF and it reads the first five pages, labeling each with a page marker.",
      },
    ],
    faqs: [
      {
        question: "Which OCR engine is used?",
        answer:
          "Tesseract.js — the Tesseract OCR engine compiled to run in your browser. There is no server call; the engine (~15 MB) is downloaded on first use.",
      },
      {
        question: "How accurate is it?",
        answer:
          "Accuracy depends heavily on image quality, resolution, and skew. Clean, well-lit, sharp text extracts best; blurry, rotated, or noisy scans can produce errors or no text at all.",
      },
      {
        question: "Does it support every language?",
        answer:
          "It offers 12 preset languages: English (default), Spanish, French, German, Italian, Portuguese, Dutch, Arabic, Hindi, Japanese, Chinese (Simplified), and Korean.",
      },
      {
        question: "Are PDFs fully processed?",
        answer:
          "No. PDFs are rendered page by page and OCR'd up to the first 5 pages only, with each block labeled as '--- Page N ---'.",
      },
    ],
    howTo: [
      {
        title: "Choose an image or PDF",
        description:
          "Pick a screenshot, scan, or photo. PDFs are handled too, but only the first 5 pages are read.",
      },
      {
        title: "Select the language",
        description:
          "English is the default; switch to the language that matches the text if it is not English.",
      },
      {
        title: "Extract and copy",
        description:
          "Click Extract text, watch the progress bar, then copy or download the result from the output box (ocr-text.txt).",
      },
    ],
    workedExample: {
      input: "screenshot containing the line: Subscribe for more videos",
      output: "Subscribe for more videos",
      note: "The recognized text fills the editable output box, and the status line reports the word count — 4 words in this case. No confidence score is displayed.",
    },
    limits: [
      "Accuracy is quality-dependent: blur, rotation, low resolution, and background noise all hurt results.",
      "PDFs are OCR'd to the first 5 pages only, rendered at 2× scale before recognition.",
      "Only the 12 listed languages are available; text in other scripts may come out garbled or empty.",
      "No confidence values are displayed, and handwriting cannot be relied on.",
      "The engine (~15 MB) downloads from a CDN on first use; long files can be slow and memory-heavy.",
    ],
    privacyNote:
      "Recognition happens in your browser with Tesseract.js, so the image or PDF is not uploaded. The engine itself (~15 MB) is fetched from a CDN the first time you run it.",
    related: [
      {
        slug: "pdf-to-word",
        note: "Extract selectable text from a text-based PDF.",
      },
      {
        slug: "image-to-pdf",
        note: "Package scanned images into a document first.",
      },
      {
        slug: "image-converter",
        note: "Clean or resize an image before OCR.",
      },
    ],
  },
  "pdf-split": {
    examples: [
      {
        title: "One PDF → one page per file",
        description:
          "Split a document into individual page PDFs, delivered together in a ZIP.",
      },
      {
        title: "Pull a chapter range",
        description:
          "Extract pages 2–4 of a long guide into a single smaller PDF.",
      },
      {
        title: "Share one section",
        description:
          "Export a single page number as its own PDF to send to a collaborator.",
      },
    ],
    faqs: [
      {
        question: "Which modes are available?",
        answer:
          "Two. 'Split into separate pages' writes every page as page-N.pdf inside a ZIP named {name}-pages.zip. 'Extract a page range' takes From and To numbers and outputs a single {name}-pages-{s}-{e}.pdf.",
      },
      {
        question: "What if I type a range outside the document?",
        answer:
          "The range is clamped to the document: the start is limited to between 1 and the page count, and the end is locked to at least the start and at most the total pages.",
      },
      {
        question: "Can I specify multiple ranges at once?",
        answer:
          "No — a single contiguous range only. To extract several ranges, run the tool once per range.",
      },
      {
        question: "Is this processed on a server?",
        answer:
          "No. Splitting uses pdf-lib entirely in your browser.",
      },
    ],
    howTo: [
      {
        title: "Choose a PDF",
        description:
          "Pick the file; the tool reads its page count and fills the To box with the last page.",
      },
      {
        title: "Pick a mode",
        description:
          "Choose 'Split into separate pages' or 'Extract a page range', and set From/To for a range.",
      },
      {
        title: "Split and download",
        description:
          "Click Split PDF or Extract range, then grab the ZIP or the single range PDF.",
      },
    ],
    workedExample: {
      input: "guide.pdf (6 pages) · mode: Extract range · From 2 · To 4",
      output: "guide-pages-2-4.pdf · 3 pages extracted",
      note: "The range is clamped to the document bounds (1..6), then pages 2, 3, and 4 are copied in order into a fresh PDF.",
    },
    limits: [
      "Only a single contiguous range is supported — no multiple ranges or custom output names.",
      "Encrypted, corrupted, or non-PDF files fail with 'That file is not a valid PDF.' or 'Failed to split this PDF.'",
      "Splitting copies pages and does not guarantee that interactive forms, annotations, or bookmarks survive.",
      "Large files can hit browser memory limits; there is no server-side fallback.",
    ],
    privacyNote:
      "Splitting runs locally with pdf-lib. The PDF you choose is read in your browser and never uploaded.",
    related: [
      {
        slug: "pdf-merge",
        note: "Combine the resulting pages back into one file.",
      },
      {
        slug: "pdf-compress",
        note: "Shrink the extracted PDF.",
      },
      {
        slug: "pdf-to-word",
        note: "Pull text out of a page instead.",
      },
    ],
  },
  "image-to-pdf": {
    examples: [
      {
        title: "Turn screenshots into a handout",
        description:
          "Add several screenshots in order and export them as one paginated PDF.",
      },
      {
        title: "Package a set of scans",
        description:
          "Bundle scanned pages into a single document with one image per page.",
      },
      {
        title: "Export at a fixed page size",
        description:
          "Choose A4 portrait, A4 landscape, or Letter so the PDF prints predictably.",
      },
    ],
    faqs: [
      {
        question: "Which image formats are supported?",
        answer:
          "JPG and PNG are embedded directly. Other formats your browser can decode (WebP, GIF, and more) are drawn to a canvas and stored as PNG first. Files that cannot be decoded fail the conversion.",
      },
      {
        question: "What are the page size options?",
        answer:
          "Fit image size (the default, one page per image at its own dimensions), A4 portrait, A4 landscape, or Letter. With a fixed page size, each image is scaled down to fit while keeping its aspect ratio.",
      },
      {
        question: "Why is the output always called images.pdf?",
        answer:
          "The tool names every result images.pdf and reports the page count in the status line; rename the downloaded file if you need a different name.",
      },
      {
        question: "Can I change the order?",
        answer:
          "Yes — each image row has up and down arrows to reorder the pages before you create the PDF, and an ✕ button to remove an image.",
      },
    ],
    howTo: [
      {
        title: "Add images in order",
        description:
          "Pick one or more images, then use the arrows to set the page order.",
      },
      {
        title: "Choose a page size",
        description:
          "Leave Fit image size for native dimensions, or pick A4 portrait, A4 landscape, or Letter.",
      },
      {
        title: "Create and download",
        description:
          "Click Create PDF — the result downloads as images.pdf with one page per image.",
      },
    ],
    workedExample: {
      input: "cover.jpg, diagram.png, appendix.png (in that order) · page size: A4 portrait",
      output: "images.pdf · 3 pages, each image scaled to fit a 595×842 pt page",
      note: "With a fixed page size each image is down-scaled to fit the page while keeping its aspect ratio; the output always downloads as images.pdf.",
    },
    limits: [
      "One page per image — images are not combined onto a single page.",
      "JPG and PNG are embedded directly; other formats go through a canvas re-encode to PNG, so their decode depends on your browser.",
      "There is no margins, compression, or quality control — images are embedded at their original bytes (or canvas PNG for other formats).",
      "The output is not an OCR or searchable PDF — no hidden text layer is added.",
      "Very large images can fail in browser memory.",
    ],
    privacyNote:
      "The PDF is built locally with pdf-lib and the browser canvas. Your images are not uploaded anywhere.",
    related: [
      {
        slug: "image-converter",
        note: "Convert images before packing them into a PDF.",
      },
      {
        slug: "pdf-merge",
        note: "Combine several PDFs into one.",
      },
      {
        slug: "ocr",
        note: "Extract text from the resulting scanned PDF.",
      },
    ],
  },
  "ai-prompt-tester": {
    examples: [
      {
        title: "Score a draft prompt",
        description:
          "Paste a prompt and read its 0–100 score plus a checklist of what's missing.",
      },
      {
        title: "Fix the weakest item",
        description:
          "Add a constraint or an example and watch the score move as the check passes.",
      },
      {
        title: "Compare two versions",
        description:
          "Run the same idea with and without detail to see which checks clear.",
      },
    ],
    faqs: [
      {
        question: "Does this run my prompt through an AI model?",
        answer:
          "No. There is no model, no API, and no network call. The tool applies six static rules to the text and scores how many pass.",
      },
      {
        question: "What are the six checks?",
        answer:
          "Clear instruction (an action verb like write or explain), Specific & detailed (numbers or detail words), Constraints given (must, avoid, limit, and similar), Examples included, Output format defined, and Good length (at least 30 characters, flagged above 1500).",
      },
      {
        question: "How is the score calculated?",
        answer:
          "Score is passed checks ÷ total checks × 100, rounded. Colors are applied by band: green at 80+, amber at 50+, red below 50.",
      },
      {
        question: "Does the score predict output quality?",
        answer:
          "No. It is a prompt-writing checklist, not a prediction of what a model will produce or how useful the result will be.",
      },
    ],
    howTo: [
      {
        title: "Paste your prompt",
        description:
          "Type or paste into the field; the score, characters, estimated tokens, and words update live.",
      },
      {
        title: "Read the checklist",
        description:
          "Each of the six checks shows a pass mark or a warning, with a tip for the failing ones.",
      },
      {
        title: "Iterate",
        description:
          "Fix a failing item and the score re-calculates immediately.",
      },
    ],
    workedExample: {
      input: "Write a short product description for my new cafe.",
      output: "Score: 50/100 · 3 of 6 checks passed · 9 words · ~13 est. tokens",
      note: "The verb write and the word new pass Clear instruction and Specific & detailed, and the 50-character length passes Good length. Constraints, an example, and an output format are each missing, leaving 3 of 6 checks.",
    },
    limits: [
      "The score is a fixed text heuristic — it does not call a model, predict quality, or judge fitness for a specific model.",
      "Checks key on simple word patterns, so a genuinely specific prompt written differently can score lower than a generic one that happens to match keywords.",
      "Good length requires at least 30 characters and warns above 1500; 'Est. tokens' is simply characters ÷ 4.",
    ],
    privacyNote:
      "Scoring runs entirely in your browser. Your prompt is never sent to a server or any AI provider.",
    related: [
      {
        slug: "prompt-comparator",
        note: "Compare two prompts' heuristics side by side.",
      },
      {
        slug: "prompt-optimizer",
        note: "Get improvement suggestions for a prompt.",
      },
      {
        slug: "ai-prompt-shortener",
        note: "Trim a long prompt before you test it.",
      },
    ],
  },
  "prompt-comparator": {
    examples: [
      {
        title: "A/B two prompt drafts",
        description:
          "Paste two versions and compare word counts, unique words, and specificity cues at a glance.",
      },
      {
        title: "Spot the weaker one",
        description:
          "The verdict names the more detailed prompt, so you know which draft to develop.",
      },
      {
        title: "See what 'detailed' means",
        description:
          "Each side lists its specificity cue matches — soft, golden, moody, cinematic, and a few more.",
      },
    ],
    faqs: [
      {
        question: "Does it use an AI model to judge?",
        answer:
          "No. It compares three heuristic metrics: total words, unique words, and how many of a fixed set of specificity words appear.",
      },
      {
        question: "How is the verdict decided?",
        answer:
          "Each prompt gets words + (2 × specificity cues) + (3 × unique ÷ words). The higher score is named 'more detailed and specific'; equal scores produce an 'equally detailed' verdict.",
      },
      {
        question: "Does word order matter?",
        answer:
          "No. All three metrics are order-insensitive: they count tokens, unique tokens, and whether word cues appear anywhere in the text.",
      },
      {
        question: "Is this an objective quality measure?",
        answer:
          "No. It measures detail signals only — not how well the prompt will perform with an image or text model.",
      },
    ],
    howTo: [
      {
        title: "Paste Prompt A and Prompt B",
        description:
          "Add both texts; the metrics update as you type.",
      },
      {
        title: "Read the three metrics",
        description:
          "Words, Unique, and Specificity cues are shown per panel.",
      },
      {
        title: "Check the verdict",
        description:
          "The result card states which prompt the heuristic judges more detailed.",
      },
    ],
    workedExample: {
      input: "A: a fox drinking tea in a Victorian library · B: a golden fox drinking soft tea in a Victorian library",
      output: "Prompt B is more detailed and specific · A: 8 words · 7 unique · 0 cues · B: 10 words · 9 unique · 2 cues",
      note: "golden and soft are both in the fixed specificity-word list, and B has more unique words, so its heuristic score (words + 2×cues + 3×unique ratio) is higher and the verdict names B.",
    },
    limits: [
      "This is a heuristic comparison, not an objective or AI-powered quality score.",
      "The specificity cue list is fixed at a small set of words, so specificity expressed differently is not counted.",
      "Metrics ignore word order, and very short prompts at near-equal scores can produce an 'equally detailed' verdict.",
    ],
    privacyNote:
      "Both prompts are compared locally in your browser and are never uploaded.",
    related: [
      {
        slug: "ai-prompt-tester",
        note: "Score either prompt against a six-point checklist.",
      },
      {
        slug: "prompt-optimizer",
        note: "Get rewrite suggestions for the losing draft.",
      },
      {
        slug: "prompt-library",
        note: "Find ready-made prompt structures to compare against.",
      },
    ],
  },
  "internal-link-suggestions": {
    examples: [
      {
        title: "Spot strong link candidates",
        description:
          "Paste an article plus labels and URLs; the tool ranks which links match the content best.",
      },
      {
        title: "Check an anchor phrase",
        description:
          "The label's words that appear in your content are suggested as anchor text.",
      },
      {
        title: "Re-run an old post",
        description:
          "Run the same page content against new candidate links to see which still fit.",
      },
    ],
    faqs: [
      {
        question: "Does it crawl or scan my website?",
        answer:
          "No. It only compares the content you paste with the candidate links you enter. There is no crawling, sitemap reading, or site-wide index.",
      },
      {
        question: "How is the match percentage calculated?",
        answer:
          "Each label is tokenized; words shorter than 3 characters and a stop-word list (the, and, or, for, of, to…) are ignored for matching. The score is matched-words ÷ the label's full word count, shown as a rounded percentage.",
      },
      {
        question: "What do the strength bands mean?",
        answer:
          "Greater than 50% is strong, greater than 0% is possible, and 0% is weak — based solely on word overlap, not on SEO value.",
      },
      {
        question: "Does it detect links already in my content?",
        answer:
          "No. Existing anchors or URLs in the pasted content are not detected or removed.",
      },
    ],
    howTo: [
      {
        title: "Paste your content",
        description:
          "Add the page or article text you plan to link from.",
      },
      {
        title: "Add candidate links",
        description:
          "One per line as label | url, for example About | /about. The default box holds three examples.",
      },
      {
        title: "Read the ranked list",
        description:
          "Each candidate shows a percentage badge, a suggested anchor (the first matching word), and the full Markdown-style output with strength labels.",
      },
    ],
    workedExample: {
      input: "Content: We share editing tips and thumbnail ideas on this blog every week. · Links: Video editing tips | /blog/editing-tips · About the blog | /about",
      output: "[editing](/blog/editing-tips) — strong (67% match) · [blog](/about) — possible (33% match)",
      note: "The first label matches 2 of its 3 words (editing, tips); the second matches 1 of 3 (blog) because the denominator is the label's full word count, so it lands in the possible band.",
    },
    limits: [
      "Matching is a token-overlap heuristic — it does not read meaning, context, or SEO value, and a match does not guarantee better ranking or traffic.",
      "The tool only works on the content you paste and the link list you supply; it cannot inspect your site or its other pages.",
      "Existing links in the content are not detected, and stop words plus 1–2 letter words are excluded from matching.",
      "Anchor suggestions reuse the first matching word of the label, which may not be the ideal phrase.",
    ],
    privacyNote:
      "All matching happens locally in your browser. Your content and link list are not uploaded.",
    related: [
      {
        slug: "keyword-density",
        note: "Understand which terms dominate your content first.",
      },
      {
        slug: "serp-preview",
        note: "Pair the page with a fitting title and description.",
      },
      {
        slug: "slug-generator",
        note: "Clean up the URLs you link to.",
      },
    ],
    blogLink: {
      slug: "creators-seo-checklist",
      title: "The creator's SEO checklist before you hit publish",
      readTime: "8 min read",
    },
  },
  "serp-preview": {
    examples: [
      {
        title: "Fit a meta title",
        description:
          "Type your title and keep the 60-character bar green to avoid truncation in search results.",
      },
      {
        title: "Tune the meta description",
        description:
          "Watch the 160-character bar stay in the Fits zone as you write.",
      },
      {
        title: "Check the URL display",
        description:
          "See how the path is shown in a Google-style result card.",
      },
    ],
    faqs: [
      {
        question: "Does it measure exact pixel width?",
        answer:
          "No. The fit checks are character-based against the 60- and 160-character guides, not actual pixel-width measurement of your chosen font.",
      },
      {
        question: "Is this what Google actually shows?",
        answer:
          "No. It is a static visual approximation of a search result — Google's truncation depends on the device, query, and its own layout, and the preview is not live data.",
      },
      {
        question: "Do the bars predict ranking or clicks?",
        answer:
          "No. They only report title and description length against the 60/160 guides.",
      },
      {
        question: "Is there a mobile and desktop toggle?",
        answer:
          "No. The preview is a single card rendered the same way regardless of viewport.",
      },
    ],
    howTo: [
      {
        title: "Enter title, description, and URL",
        description:
          "All three update the preview card live; the URL field defaults to a sample blog path.",
      },
      {
        title: "Watch the Snippet fit bars",
        description:
          "Each bar fills from 0–100% based on title ÷ 60 and description ÷ 160, labeled Fits or May truncate.",
      },
      {
        title: "Read the colors",
        description:
          "Lengths within the guides render in the normal preview colors; over-length text is highlighted amber as a truncation warning.",
      },
    ],
    workedExample: {
      input: "Title: 10 Editing Tips for Creators · Description: Learn faster edits, clean cuts, and better pacing in under ten minutes.",
      output: "Title · 28/60 chars · Fits · bar 47% · Description · 71/160 chars · Fits · bar 44%",
      note: "The bars are character ratios: 28 ÷ 60 rounds to 47% and 71 ÷ 160 to 44%. Both are within the guides, so the preview card keeps its default colors.",
    },
    limits: [
      "Fit checks are character-based, not pixel-width, and the 60/160 figures are common guides rather than guarantees of what Google shows.",
      "The preview is a static approximation — there is no device toggle and no live Google data, and it never predicts ranking or clicks.",
      "The description preview uses a two-line clamp, so over-long text can look similar to shorter text in the card even when the bar warns of truncation.",
    ],
    privacyNote:
      "Everything is computed locally in your browser. Your title, description, and URL are never uploaded.",
    related: [
      {
        slug: "meta-title-generator",
        note: "Write a title that fits the 60-character guide.",
      },
      {
        slug: "meta-description-generator",
        note: "Draft a description that fits the 160-character guide.",
      },
      {
        slug: "internal-link-suggestions",
        note: "Plan the page's internal links alongside its snippet.",
      },
    ],
    blogLink: {
      slug: "creators-seo-checklist",
      title: "The creator's SEO checklist before you hit publish",
      readTime: "8 min read",
    },
  },
  "chapter-generator": {
    examples: [
      {
        title: "Turn a script into chapter lines",
        description:
          "Paste timestamps with titles, one per line, and get a clean copy-ready list for your video description.",
      },
      {
        title: "Normalize messy times",
        description:
          "Times like 0:00, 1:35, and 5:20 are rewritten to zero-padded 00:00, 01:35, and 05:20 so the list reads consistently.",
      },
      {
        title: "Reorder or trim sections",
        description:
          "Edit or remove lines in the input box and the chapter count and output update instantly.",
      },
    ],
    faqs: [
      {
        question: "What time formats are supported?",
        answer:
          "A line is recognized when it starts with a timestamp in MM:SS or HH:MM:SS form, optionally followed by a dash. Times are rewritten to zero-padded form, so 0:00 becomes 00:00 and 1:35 becomes 01:35.",
      },
      {
        question: "What happens to lines without a timestamp?",
        answer:
          "They are skipped. The parser only keeps lines that begin with a timestamp followed by a title; anything else is ignored, including intro or notes lines.",
      },
      {
        question: "Does it import transcripts or analyze my video?",
        answer:
          "No. It only reformats the timestamps and titles you paste. There is no YouTube transcript import, video analysis, AI generation, or YouTube API integration — you paste the finished list into the video description yourself.",
      },
      {
        question: "What if a line has a time but no title?",
        answer:
          "The title defaults to the word Chapter, so the line still produces output instead of being dropped.",
      },
    ],
    howTo: [
      {
        title: "Paste timestamps and titles",
        description:
          "Type one chapter per line, time followed by the title, for example 0:00 Intro and 5:20 Editing workflow.",
      },
      {
        title: "Use a separator if you like",
        description:
          "An optional dash after the time (-, –, —) is stripped, so 1:35 – Tools I use and 1:35 Tools I use both work.",
      },
      {
        title: "Copy or download the list",
        description:
          "The output is a time + title line per chapter. Copy it into your video description or download chapters.txt.",
      },
    ],
    workedExample: {
      input: "0:00 Intro\n1:35 – Tools I use\n5:20 Editing workflow\nVoiceover notes",
      output: "00:00 Intro\n01:35 Tools I use\n05:20 Editing workflow",
      note: "Three chapters. Times are zero-padded (00:00, 01:35, 05:20), the dash after 1:35 is stripped, and the line Voiceover notes is ignored because it does not start with a timestamp.",
    },
    limits: [
      "Only lines that start with an MM:SS (or HH:MM:SS) timestamp become chapters; every other line is skipped.",
      "Times are always rewritten to zero-padded form, so the output keeps a uniform 00:00 or 00:00:00 shape even when your input is looser.",
      "Three-part HH:MM:SS timestamps are normalized with the same single pass as MM:SS, so an hour-long time like 1:02:03 reads as 01:01:02 — keep timestamps in MM:SS and verify the output.",
      "There is no transcript import, video analysis, or platform integration. The tool only structures the text you paste.",
    ],
    privacyNote:
      "Parsing happens entirely in your browser with JavaScript. The timestamps and titles you paste are not uploaded anywhere.",
    related: [
      {
        slug: "youtube-description-generator",
        note: "Assemble a full video description around your chapters.",
      },
      {
        slug: "script-timer",
        note: "Estimate how long a script reads before you record.",
      },
    ],
  },
  "linkedin-formatter": {
    examples: [
      {
        title: "Break up a wall of text",
        description:
          "Paste a long draft and turn it into one-sentence-per-line, the scannable style that works well in LinkedIn posts.",
      },
      {
        title: "Add a hashtag footer",
        description:
          "Leave the hashtag checkbox on to append the fixed LinkedIn hashtag line below your post.",
      },
      {
        title: "Clean a copied draft",
        description:
          "Reformat text pasted from a document or chat where line breaks and emphasis got mangled.",
      },
    ],
    faqs: [
      {
        question: "Does it add bullet points or emojis to every line?",
        answer:
          "No. It splits the text into sentences and puts each sentence on its own line. When the checkbox is on it also appends one hashtag line at the end. That is the full set of transformations.",
      },
      {
        question: "Which hashtags are added?",
        answer:
          "A fixed set of six: #contentcreation #creatoreconomy #productivity #marketing #growth #socialmedia. They are the same every time and are not generated from your text.",
      },
      {
        question: "How are sentences detected?",
        answer:
          "The shared text engine splits on . ! ? and …. Because it is a simple rule-based splitter, abbreviations and decimals are treated as sentence ends.",
      },
      {
        question: "Is there a character counter?",
        answer:
          "No. LinkedIn limits are not tracked and text is never truncated. Whatever you paste is what gets reformatted.",
      },
    ],
    howTo: [
      {
        title: "Paste your draft",
        description:
          "Enter a paragraph, several paragraphs, or a rough post into the text box.",
      },
      {
        title: "Decide on hashtags",
        description:
          "Keep Add trending hashtags at the end checked for the standard footer, or uncheck it for a hashtag-free version.",
      },
      {
        title: "Copy or download the post",
        description:
          "The one-sentence-per-line version is ready to copy into the LinkedIn composer, or download it as linkedin-post.txt.",
      },
    ],
    workedExample: {
      input: "This is a long paragraph. It has three sentences. See how they split!",
      output:
        "This is a long paragraph.\nIt has three sentences.\nSee how they split!\n\n#contentcreation #creatoreconomy #productivity #marketing #growth #socialmedia",
      note: "Each sentence lands on its own line and the fixed hashtag set is appended after a blank line. Unchecking the hashtag option produces only the first three lines.",
    },
    limits: [
      "The tool does not count characters, enforce LinkedIn limits, or truncate long posts.",
      "No bullets, emojis, bold, or other formatting is added — the output is one sentence per line plus the optional hashtag line.",
      "Sentences split on . ! ? and …, so abbreviations, decimals, and initials add extra lines.",
      "The hashtag set is fixed and generic; it is not derived from your text or audience.",
    ],
    privacyNote:
      "Formatting runs in your browser using the shared text engine. Your draft is not sent to any server.",
    related: [
      {
        slug: "thread-generator",
        note: "Split a long post into a numbered Twitter/X thread instead.",
      },
      {
        slug: "character-counter",
        note: "Check the length of the reformatted post before posting.",
      },
    ],
  },
  "instagram-caption-optimizer": {
    examples: [
      {
        title: "Break a long caption into short lines",
        description:
          "Turn a dense paragraph into lines of roughly 14 words each by leaving the Break into short lines option on.",
      },
      {
        title: "Build a niche hashtag set",
        description:
          "Type a niche like travel or fitness and the tool appends up to 12 related hashtags after your caption.",
      },
      {
        title: "Check the 2,200-character budget",
        description:
          "Watch the length counter update as you edit and confirm whether the output fits Instagram's 2,200-character caption limit.",
      },
    ],
    faqs: [
      {
        question: "Is this an AI optimizer?",
        answer:
          "No. It performs three deterministic transformations: it trims whitespace, optionally re-wraps sentences into short lines, and optionally appends hashtags derived from your niche. No model is called.",
      },
      {
        question: "How are the hashtags chosen?",
        answer:
          "Your niche is lowercased and stripped to letters and digits, then expanded with suffixes like tips, community, life, and 2026 plus a set of broad defaults. The combined list is de-duplicated and capped at 12.",
      },
      {
        question: "When are hashtags added?",
        answer:
          "Only when the Add hashtags box is checked and a niche is filled in. With an empty niche, no hashtags are generated.",
      },
      {
        question: "What does the / 2200 number mean?",
        answer:
          "It is the character length of the produced caption compared against 2200. The tool shows Fits within Instagram's limit or Over the limit — trim it down. It does not predict reach, ranking, or engagement.",
      },
    ],
    howTo: [
      {
        title: "Paste a caption draft",
        description:
          "Enter your caption. The trimmed, transformed version appears in the outputs below.",
      },
      {
        title: "Choose the transformations",
        description:
          "Keep Break into short lines on to wrap text at roughly 14 words per line, and fill in a niche and keep Add hashtags on for a hashtag set.",
      },
      {
        title: "Check the length and copy",
        description:
          "Confirm the / 2200 counter reads Fits, then copy the optimized caption or download instagram-caption.txt.",
      },
    ],
    workedExample: {
      input:
        "Caption: Loving this time in Porto. The food is incredible. The sunsets are unreal. Make sure you pack comfortable shoes. · Niche: travel",
      output:
        "Loving this time in Porto. The food is incredible. The sunsets are unreal.\nMake sure you pack comfortable shoes.\n\n#travel #traveltips #travelcommunity #travellife #travelgoals #travel2026 #viral #trending #explore #reels #fyp #foryou",
      note: "Sentences are packed into lines until a line would exceed 14 words, so the fourth sentence starts a new line. The niche travel expands to 12 hashtags. The final string is 233 characters, which reads as Fits within Instagram's limit.",
    },
    limits: [
      "There is no AI, no engagement prediction, and no guarantee of reach or ranking.",
      "The line-wrap target is about 14 words per line; a single sentence longer than 14 words stays on its own line and is not split.",
      "Hashtags are only added when a niche is filled in; the 12-tag cap and the suffix-based set are fixed rules.",
      "The 2200 figure is a character check against a caption limit. It does not reflect how Instagram renders or ranks the post.",
    ],
    privacyNote:
      "Transformation and length counting run locally in your browser. Your caption and niche are not uploaded.",
    related: [
      {
        slug: "caption-generator",
        note: "Draft a fresh caption before running it through the optimizer.",
      },
      {
        slug: "hashtag-generator",
        note: "Generate a broader hashtag set for other platforms.",
      },
    ],
  },
  "prompt-formatter": {
    examples: [
      {
        title: "Structure a one-liner prompt",
        description:
          "Split a single instruction into Role, Task, Context, Constraints, and Tone fields and get a labelled, paste-ready prompt.",
      },
      {
        title: "Turn constraints into bullets",
        description:
          "Type each constraint on its own line and the formatter renders them as a bulleted Constraints section.",
      },
      {
        title: "Keep prompts consistent",
        description:
          "Use the same section order for every prompt you send to a model so the structure looks uniform.",
      },
    ],
    faqs: [
      {
        question: "Does this call an AI model?",
        answer:
          "No. It is a formatting utility that assembles the fields you fill in into a markdown-style template. No model is called and no text is sent anywhere.",
      },
      {
        question: "What if I leave a field empty?",
        answer:
          "Empty fields are omitted from the output. Only the sections you actually fill in appear, in the fixed order Role, Task, Context, Constraints, Output Format, Examples, Tone.",
      },
      {
        question: "How are constraints formatted?",
        answer:
          "Each non-empty line is trimmed and prefixed with a hyphen, so the field becomes a bulleted list inside the Constraints section.",
      },
      {
        question: "What do the stats mean?",
        answer:
          "Sections counts the number of ## headings in the output, and Est. tokens is the character length divided by 4 — a rough estimate, not a real tokenizer result.",
      },
    ],
    howTo: [
      {
        title: "Fill in the fields",
        description:
          "Add the role, task, context, and any other detail. Constraints accepts one item per line.",
      },
      {
        title: "Watch the prompt build",
        description:
          "The formatted prompt updates live in the output box as you type, with each section labelled with a ## heading.",
      },
      {
        title: "Copy or download",
        description:
          "Copy the formatted prompt into your AI chat app, or download formatted-prompt.txt to keep a versioned copy.",
      },
    ],
    workedExample: {
      input:
        "Role: senior copywriter · Task: write a product description · Context: a sustainable sneaker brand · Constraints: no jargon, max 150 words · Tone: friendly and confident",
      output:
        "## Role\nsenior copywriter\n\n## Task\nwrite a product description\n\n## Context\na sustainable sneaker brand\n\n## Constraints\n- no jargon\n- max 150 words\n\n## Tone\nfriendly and confident",
      note: "Constraints lines become hyphen bullets, sections are separated by blank lines, and the Output Format and Examples sections are omitted because they were left empty. The stats read Sections: 5.",
    },
    limits: [
      "This is a template assembler, not an editor: it trims and labels your words but does not rewrite, expand, or improve them.",
      "The section order is fixed and empty fields are dropped, so you cannot reorder sections or force an empty heading.",
      "The Est. tokens stat is characters divided by 4 and can differ from a model's real token count.",
      "Formatting a prompt does not guarantee better model output; it only makes the structure consistent.",
    ],
    privacyNote:
      "Formatting happens in your browser using local templates. None of the fields you type are sent to a server or any AI service.",
    related: [
      {
        slug: "prompt-optimizer",
        note: "Apply heuristic upgrades on top of a formatted prompt.",
      },
      {
        slug: "prompt-generator",
        note: "Generate a complete prompt when you are starting from scratch.",
      },
    ],
  },
  "prompt-optimizer": {
    examples: [
      {
        title: "Upgrade a bare instruction",
        description:
          "Paste write a summary of this report and get back a version with a role prefix, constraints, an output-format line, and a self-review request.",
      },
      {
        title: "Spot vague wording",
        description:
          "The tool flags words like some, things, stuff, maybe, and whatever so you can replace them with concrete details.",
      },
      {
        title: "Review what changed",
        description:
          "Every applied improvement is listed in the Improvements applied card beneath your prompt.",
      },
    ],
    faqs: [
      {
        question: "Is this powered by an AI backend?",
        answer:
          "No. It applies a fixed set of deterministic rules with regular expressions — no language model, no API call, and no semantic understanding of your prompt.",
      },
      {
        question: "Which rules actually change the text?",
        answer:
          "Three additions modify the text: a You are… role prefix (only if the prompt does not already start with a role phrase), a Constraints block (only if no constraint keyword is present), and an Output block (only if no output/format keyword is present). A Review your work… line is always appended.",
      },
      {
        question: "Do the vague-word and example checks rewrite anything?",
        answer:
          "No. The vague-word check and the consider-an-example check are displayed as suggestions only. They never alter the prompt text.",
      },
      {
        question: "What if my prompt already has constraints and a format?",
        answer:
          "Those blocks are not added again, but the role prefix (if missing) and the self-review line are still applied, so the optimized output can still differ from the input.",
      },
    ],
    howTo: [
      {
        title: "Paste a prompt",
        description:
          "Enter any prompt. The optimized version and the improvement list update live as you type.",
      },
      {
        title: "Read the improvement card",
        description:
          "Each check that fired is listed with a short reason. This is the full list of rules that ran — nothing else is analyzed.",
      },
      {
        title: "Copy or download the result",
        description:
          "Use the optimized prompt in your AI chat app, or download optimized-prompt.txt.",
      },
    ],
    workedExample: {
      input: "write a summary of this report",
      output:
        "You are a helpful, precise assistant. write a summary of this report\n\nConstraints: Be specific, avoid fluff, and stay on topic.\n\nOutput: Provide a clear, well-structured answer.\n\nReview your work against the request before answering.",
      note: "Five improvements are reported: Added a role, Added constraints, Specified output format, Consider adding an example, and Added self-review step. The example check is advisory and changes no text. The stored token estimate rounds 233 ÷ 4 to 58.",
    },
    limits: [
      "Rules are regex-based, not semantic. A prompt that mentions formats or constraints in unusual phrasing may not be detected, and blocks may be added redundantly.",
      "The vague-word and example checks are advisory only; the optimized text is not reworded by the tool.",
      "It does not measure prompt quality or predict results, and there is no guarantee the optimized prompt performs better with any specific model.",
      "The prefix is inserted as-is, so a lowercase instruction like the worked example keeps its original casing after the role sentence.",
    ],
    privacyNote:
      "All rules run locally in your browser. Your prompt and the optimized text never leave the device, and no AI service is invoked.",
    related: [
      {
        slug: "prompt-formatter",
        note: "Structure the optimized prompt into labelled sections.",
      },
      {
        slug: "prompt-generator",
        note: "Create a fresh, structured prompt from a topic.",
      },
    ],
  },
  "ai-chat-export-cleaner": {
    examples: [
      {
        title: "Clean a copied chat",
        description:
          "Paste a conversation that has User: and Assistant: prefixes and timestamps, and get plain readable dialogue.",
      },
      {
        title: "Prepare text for repurposing",
        description:
          "Remove speaker labels so a conversation can be reused as a script, FAQ draft, or blog outline.",
      },
      {
        title: "Tighten spacing",
        description:
          "The blank-line collapse option replaces runs of empty lines with a single separator.",
      },
    ],
    faqs: [
      {
        question: "Which chat platforms are supported?",
        answer:
          "The tool works on plain text you paste: any conversation formatted with speaker prefixes and timestamps like the ones seen in ChatGPT and Claude copy-overs. It does not import the official export files from any platform — there is no file upload.",
      },
      {
        question: "What exactly is removed?",
        answer:
          "Speaker prefixes from a fixed list (user, assistant, human, ai, me, you, bot, chatgpt, system, model) before a colon, lines that are only a timestamp, and leading timestamp prefixes with or without square brackets. Line content is otherwise preserved.",
      },
      {
        question: "Does it keep metadata like dates or roles?",
        answer:
          "Speaker labels and timestamps are removed by default, and there is no option to preserve them. The remaining bullet points and text content are kept.",
      },
      {
        question: "Is my conversation uploaded?",
        answer:
          "No. All cleaning happens in your browser. The tool is a textarea — you paste text in and a cleaned version appears locally.",
      },
    ],
    howTo: [
      {
        title: "Paste the conversation",
        description:
          "Copy text from a chat export or history view and paste it into the box.",
      },
      {
        title: "Choose what to strip",
        description:
          "Toggle speaker removal, timestamp removal, and blank-line collapsing. All three are on by default.",
      },
      {
        title: "Copy or download the clean text",
        description:
          "The cleaned conversation appears in the output box for copying, or download it as cleaned-chat.txt.",
      },
    ],
    workedExample: {
      input:
        "User: Hi, how do I create a podcast?\n12:34\nAssistant: Great question! First you need a mic.\n3:45 You then record in a quiet room.\n[10:12] Finally, edit and publish.",
      output:
        "Hi, how do I create a podcast?\n\nGreat question! First you need a mic.\nYou then record in a quiet room.\nFinally, edit and publish.",
      note: "Speaker prefixes (User:, Assistant:) are stripped, the standalone 12:34 line disappears, and the 3:45 and [10:12] prefixes are removed from the start of their lines. The single blank line from collapsing is preserved.",
    },
    limits: [
      "This is a text-focused cleaner, not an export-file parser: paste text in, get text out. No .json or platform-export files are accepted.",
      "Only the fixed speaker list is stripped; prefixes like So: or Steve: are left in place.",
      "Timestamp removal targets whole-line timestamps and leading prefixes. A time further into a line, outside a prefix position, is not removed.",
      "Removal is order-sensitive: speaker stripping runs before timestamp stripping, so a line like 10:00 User: note only drops its leading timestamp, not the User: label. Blank-line collapsing keeps one blank separator between paragraphs.",
    ],
    privacyNote:
      "Cleaning runs entirely in your browser. The conversation text is never uploaded, and no file reader or network call is involved.",
    related: [
      {
        slug: "ai-prompt-translator",
        note: "Translate cleaned dialogue into another language's prompt vocabulary.",
      },
      {
        slug: "ai-prompt-shortener",
        note: "Condense the cleaned text into a tighter prompt.",
      },
    ],
  },
  "ai-prompt-shortener": {
    examples: [
      {
        title: "Tighten a wordy prompt",
        description:
          "Condense verbose phrasing like due to the fact that and it is important to note that into shorter equivalents.",
      },
      {
        title: "Drop filler words",
        description:
          "Remove weak intensifiers such as very, really, quite, and basically when they appear mid-sentence.",
      },
      {
        title: "Watch the savings",
        description:
          "The stats show characters before and after, how many were saved, and an estimated token count for each version.",
      },
    ],
    faqs: [
      {
        question: "Is this AI-powered?",
        answer:
          "No. Shortening is a fixed, deterministic set of phrase replacements and filler-word removals applied with regular expressions. No model is involved.",
      },
      {
        question: "What actually gets changed?",
        answer:
          "Ten verbose phrases are swapped for shorter ones (for example in order to becomes to and due to the fact that becomes because), and filler words like very and basically are deleted when surrounded by whitespace. Multiple spaces are then collapsed and the text trimmed.",
      },
      {
        question: "Does it guarantee the meaning is preserved?",
        answer:
          "No. The substitutions are mechanical, so phrasing that relies on the removed words can read differently. Review the output before sending it.",
      },
      {
        question: "What if no phrases or fillers match?",
        answer:
          "The output equals the input (including whitespace collapsing and trimming), and the Saved stat reads 0 because the original text is unchanged except for that normalization.",
      },
    ],
    howTo: [
      {
        title: "Paste a long prompt",
        description:
          "Anything wordy works — the replacements target phrasing, not topics.",
      },
      {
        title: "Read the four stats",
        description:
          "Chars before, Chars after, Saved, and an estimated Tokens count (chars ÷ 4) for both versions.",
      },
      {
        title: "Copy or download",
        description:
          "Take the shortened prompt into your AI chat app, or download shortened-prompt.txt. Check that the trimmed wording still says what you meant.",
      },
    ],
    workedExample: {
      input:
        "Due to the fact that this guide exists basically to help you, it is important to note that brevity helps.",
      output: "because this guide exists to help you, note that brevity helps.",
      note: "Due to the fact that becomes because and it is important to note that becomes note that, then basically is removed. The stats show 105 chars in, 63 out, 42 saved, and an estimated 26 → 16 tokens. The replacement is verbatim, so the sentence now starts lowercase.",
    },
    limits: [
      "Removal is whitespace-sensitive: a filler word at the very start of a line is not matched, and a filler directly before punctuation can leave a stray space in the output.",
      "The phrase-to-replacement mapping is fixed and literal, so matches keep the replacement wording exactly (case-insensitive replace, lowercase replacement).",
      "No meaning guarantee and no model-specific tuning. Token numbers are estimates from character counts, not real tokenization.",
      "Inputs with nothing to shorten come out essentially unchanged aside from whitespace collapsing.",
    ],
    privacyNote:
      "Shortening runs locally in your browser using built-in word and phrase lists. Your prompt is never uploaded to a server or AI service.",
    related: [
      {
        slug: "prompt-optimizer",
        note: "Expand a short prompt with structure and constraints.",
      },
      {
        slug: "ai-token-calculator",
        note: "Estimate token counts across specific models.",
      },
    ],
  },
  "json-compare": {
    examples: [
      {
        title: "Diff two config files",
        description:
          "Paste the old and new contents of a JSON config to see exactly which keys were added, removed, or changed.",
      },
      {
        title: "Compare API responses",
        description:
          "Run the same endpoint's response from two environments and find the fields that moved.",
      },
      {
        title: "Check empty versus missing",
        description:
          "Spot the difference between a field that is absent and one that is present but empty.",
      },
    ],
    faqs: [
      {
        question: "Is the comparison semantic or structural?",
        answer:
          "Structural. Both documents are parsed and flattened into leaf paths like user.name and tags[1]. Key order and whitespace do not matter, and equal leaf values count as matching paths.",
      },
      {
        question: "How are arrays handled?",
        answer:
          "Each element becomes an indexed path, so tags[0] and tags[1] are compared separately and appear in the report individually.",
      },
      {
        question: "When is 1 equal to 1.0?",
        answer:
          "After parsing, the number 1 and 1.0 are the same JavaScript number, so they match. The string \"1\" is a different type and is reported as changed.",
      },
      {
        question: "What if one input is invalid JSON?",
        answer:
          "The tool shows the parser error for the first invalid input and does not produce a comparison report.",
      },
    ],
    howTo: [
      {
        title: "Paste JSON A and JSON B",
        description:
          "Enter both documents. The Compare button is enabled once both boxes are non-empty.",
      },
      {
        title: "Read the four stats",
        description:
          "Matching paths, Only in A, Only in B, and Changed values summarize the difference.",
      },
      {
        title: "Review the report",
        description:
          "The comparison report lists only-in-A keys with - , only-in-B keys with + , and changed paths with both old (A) and new (B) values, and can be downloaded as json-diff.txt.",
      },
    ],
    workedExample: {
      input:
        "A: {name: Ada, age: 36, city: London, tags: [dev, math]} · B: {name: Ada, age: 37, country: UK, tags: [dev, music]}",
      output:
        "JSON Compare Report\n\n2 matching paths\nOnly in A (1):\n  - city\nOnly in B (1):\n  + country\nDifferent values (2):\n  ~ age\n      A: 36\n      B: 37\n  ~ tags[1]\n      A: \"math\"\n      B: \"music\"",
      note: "name and tags[0] match, city exists only in A, country only in B, and age plus tags[1] hold different values. String values appear quoted in the changed list because they are stored as JSON text.",
    },
    limits: [
      "The comparison is leaf-value only: identical structures with differently nested paths (for example a vs {b nested deeper}) never match.",
      "Number-vs-string distinctions are preserved (1 is not \"1\"), but 1 and 1.0 are the same number after parsing.",
      "Very large documents are flattened synchronously in the browser, so extreme inputs can be slow, and no file input is supported — paste only.",
      "Result values are compared as JSON text, so an empty object {} versus a missing key is reported structurally rather than semantically.",
    ],
    privacyNote:
      "Both documents are parsed and compared entirely in your browser. Nothing is uploaded, and no server-side processing is involved.",
    related: [
      {
        slug: "json-validator",
        note: "Validate either document before comparing.",
      },
      {
        slug: "json-formatter",
        note: "Pretty-print the JSON first to make differences easier to spot.",
      },
    ],
  },
  "jwt-decoder": {
    examples: [
      {
        title: "Inspect a token's header",
        description:
          "Decode the header segment to see the signing algorithm a token claims to use, such as {\"alg\":\"HS256\"}.",
      },
      {
        title: "Read payload claims",
        description:
          "View registered and custom claims like sub, exp, or iss as a key-value list, with large numeric values shown as UTC dates.",
      },
      {
        title: "Check whether a signature is present",
        description:
          "A two-part token shows Signature: missing, while a full three-part token reports its signature length.",
      },
    ],
    faqs: [
      {
        question: "Does this tool verify the signature?",
        answer:
          "No. It decodes and displays the base64url header and payload only. It never checks the signature, never validates the token, and does not use any cryptographic libraries.",
      },
      {
        question: "Does decoding prove the token is valid or authentic?",
        answer:
          "No. Anyone can base64-decode JSON. A readable header and payload mean only that the segments were valid base64url-encoded JSON — not that the token was issued by the signer or is still valid. Always verify on the issuing server before trusting it.",
      },
      {
        question: "How are timestamps shown?",
        answer:
          "Numeric claims above 100,000,000 (for example a Unix-seconds exp) are displayed as a UTC date string plus the original number. This is a display convenience only and is not a validity or expiry check.",
      },
      {
        question: "What happens with malformed tokens?",
        answer:
          "A token with fewer than two dot-separated parts shows Not a JWT — expected header.payload.signature. If the header or payload is not valid base64url JSON, the parse error is displayed instead.",
      },
    ],
    howTo: [
      {
        title: "Paste a token",
        description:
          "Enter a JWT with two or three dot-separated segments. Decoding starts as soon as you type.",
      },
      {
        title: "Read the header and claims",
        description:
          "The header JSON and the payload claims render side by side, with the signature reported as present (with its length) or missing.",
      },
      {
        title: "Copy the decoded output",
        description:
          "A formatted HEADER / PAYLOAD block is available in the output box for copying or download as decoded-jwt.txt.",
      },
    ],
    workedExample: {
      input: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature",
      output:
        'HEADER:\n{\n  "alg": "HS256"\n}\n\nPAYLOAD:\n{\n  "sub": "1234"\n}',
      note: "The header decodes to {\"alg\":\"HS256\"} and the payload to {\"sub\":\"1234\"}. The signature segment is reported as present (9 chars). None of this means the token is valid — the signature is never checked.",
    },
    limits: [
      "The tool decodes only. It does not verify signatures, expirations, issuers, or audiences — treat any decoded result as unverified data.",
      "Segments must be base64url with UTF-8 text; binary payloads or unusual encodings fail to decode.",
      "Large numeric claims (above 100,000,000) are auto-formatted as dates; other claim types are shown as their JSON text.",
      "Because the payload is displayed in plain text, decoding a live session token can expose sensitive claims on screen.",
    ],
    privacyNote:
      "Decoding happens entirely in your browser — no upload, no network call, and no signature or remote validation. Still, avoid pasting real session or access tokens: their claims appear in plain text in the output.",
    related: [
      {
        slug: "base64-encoder",
        note: "Encode or decode the base64 segments of a token manually.",
      },
      {
        slug: "uuid-generator",
        note: "Generate fresh identifiers for test tokens and payloads.",
      },
    ],
  },
  "html-to-markdown": {
    examples: [
      {
        title: "Convert an email or snippet",
        description:
          "Paste HTML from an email or CMS and get a markdown version with headings, bold, and links converted.",
      },
      {
        title: "Turn a list into markdown",
        description:
          "Convert ul and ol lists into - and 1. items for pasting into a markdown editor.",
      },
      {
        title: "Extract text from a page fragment",
        description:
          "Strip tags down to readable markdown headings, paragraphs, quotes, and code blocks.",
      },
    ],
    faqs: [
      {
        question: "Does it convert arbitrary HTML perfectly?",
        answer:
          "No. It is a small rule-based walker that maps a defined subset of tags: h1–h4, p, br, b/strong, i/em, code, a, lists, blockquote, img, and pre. Everything else falls through to its text content.",
      },
      {
        question: "How are text nodes handled?",
        answer:
          "Whitespace inside text is collapsed to single spaces and trimmed, then sibling fragments are joined with single spaces. Unsupported nesting can therefore produce flat or empty results.",
      },
      {
        question: "What happens to tables?",
        answer:
          "Tables are flattened to their cell text joined with spaces. There are no pipes, headers, or alignment — the column structure is lost.",
      },
      {
        question: "Where does the parsing run?",
        answer:
          "In your browser via the DOMParser API. Nothing is sent to a server, and no CSS, layout, or JavaScript is applied.",
      },
    ],
    howTo: [
      {
        title: "Paste HTML",
        description:
          "Enter a fragment, a full element, or loosely structured markup. The markdown renders live.",
      },
      {
        title: "Review the converted text",
        description:
          "Headings become # prefixes, paragraphs and blocks become separated text, lists become - or 1. items, and links/ images become markdown syntax.",
      },
      {
        title: "Copy or download",
        description:
          "Take the markdown straight into your editor, or download output.md.",
      },
    ],
    workedExample: {
      input: "<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>",
      output: "# Hello\n \n\nThis is **bold** text.",
      note: "The h1 becomes a # heading, strong becomes **bold**, and p wraps its text. Block elements are joined with single spaces, so a whitespace-only separator line appears between the heading and the paragraph — the same compaction happens for any two sibling blocks.",
    },
    limits: [
      "The converter handles a fixed subset of tags; unknown or complex elements are reduced to their text content, so markup like embedded scripts or style blocks in the body can leak raw text into the output.",
      "Tables and multi-column layouts are flattened to plain text with no structure.",
      "Attributes that are not used (class, id, style, target, etc.) are dropped; link URLs and image src/alt are copied verbatim.",
      "It is text-only conversion, not browser-equivalent rendering: no CSS, layout, images, or script execution.",
    ],
    privacyNote:
      "Parsing uses the DOMParser API entirely in your browser. The HTML you paste is never uploaded.",
    related: [
      {
        slug: "html-formatter",
        note: "Beautify or minify the source HTML before converting.",
      },
      {
        slug: "markdown-preview",
        note: "Preview the markdown output with proper rendering.",
      },
    ],
  },
  "timestamp-converter": {
    examples: [
      {
        title: "Decode an epoch from an API",
        description:
          "Paste a Unix-seconds value like 1754411234 from a JSON response and read the exact date and time.",
      },
      {
        title: "Check a millisecond timestamp",
        description:
          "Millisecond values are detected automatically, so 1754411234000 resolves to the same instant as the seconds form.",
      },
      {
        title: "Parse a date into epoch values",
        description:
          "Type an ISO string like 2026-08-07T10:00:00Z and get its Unix seconds and milliseconds for use in code.",
      },
    ],
    faqs: [
      {
        question: "How does it tell seconds from milliseconds?",
        answer:
          "A simple threshold: a numeric input greater than 1e12 (usually a 13-digit value) is treated as milliseconds; anything smaller is treated as seconds and multiplied by 1000.",
      },
      {
        question: "What date formats are accepted?",
        answer:
          "Both numbers and date strings. Date strings are parsed by JavaScript's Date parser, so an ISO string with a Z is read as UTC, while other formats follow the engine's conventions for that format.",
      },
      {
        question: "Which output lines are timezone-dependent?",
        answer:
          "Unix seconds, milliseconds, ISO 8601, and UTC are fixed for a given input. The Local line uses the browser's timezone via toLocaleString, so it varies by machine.",
      },
      {
        question: "What happens with invalid input?",
        answer:
          "The tool shows Could not parse that as a timestamp or date. and leaves the output empty.",
      },
    ],
    howTo: [
      {
        title: "Paste a timestamp or date",
        description:
          "Enter a number (seconds or milliseconds) or a date string. Conversion runs as you type.",
      },
      {
        title: "Read the five lines",
        description:
          "Unix seconds, Unix milliseconds, ISO 8601, UTC, and Local cover the common formats you need for code and logs.",
      },
      {
        title: "Copy or download",
        description:
          "Copy the block into your code or docs, or download timestamps.txt.",
      },
    ],
    workedExample: {
      input: "2026-08-07T10:00:00Z",
      output:
        "Unix timestamp (seconds): 1786096800\nUnix timestamp (milliseconds): 1786096800000\nISO 8601: 2026-08-07T10:00:00.000Z\nUTC: 2026-08-07T10:00:00.000Z\nLocal: (your browser's timezone)",
      note: "For this fixed input, the seconds, milliseconds, ISO, and UTC values are the same on every machine. The Local line renders using the browser's timezone — on a UTC-7 test machine it showed 8/7/2026, 3:00:00 PM.",
    },
    limits: [
      "Seconds-versus-milliseconds is decided by the single 1e12 threshold; unusual values around that boundary can be misread.",
      "There is no arbitrary timezone field. Only UTC (toISOString) and the browser's local timezone are reported.",
      "Date strings rely on JavaScript's Date parser, so the interpretation of a format depends on the engine's rules for that format.",
      "Extremely large or precise inputs are limited by JavaScript number precision.",
    ],
    privacyNote:
      "Conversion is computed locally in your browser with JavaScript Date APIs. The timestamp you enter is not sent anywhere.",
    related: [
      {
        slug: "json-formatter",
        note: "Pretty-print the JSON payload that contained your timestamp.",
      },
      {
        slug: "uuid-generator",
        note: "Create identifiers to pair with timestamped events.",
      },
    ],
  },
  "pdf-to-word": {
    examples: [
      {
        title: "Turn a text PDF into a Word file",
        description:
          "Pick a text-based PDF, extract its content, and download it as an editable .docx built from the extracted text.",
      },
      {
        title: "Reuse a report",
        description:
          "Convert a whitepaper or export into a Word document you can edit, quote, and re-publish.",
      },
      {
        title: "Preview before converting",
        description:
          "An extracted-text preview (first 2,000 characters) shows what the Word file will contain before you save it.",
      },
    ],
    faqs: [
      {
        question: "Is the downloaded file a real Word document?",
        answer:
          "Yes. The tool builds a minimal but valid .docx (OOXML) in your browser with JSZip — a document body with one paragraph per extracted text block plus the standard styles and content-type parts.",
      },
      {
        question: "Does it preserve the PDF layout?",
        answer:
          "No. Only text is extracted. Images, tables, columns, fonts, and formatting are not carried into the Word file — each page's extracted text becomes plain paragraphs.",
      },
      {
        question: "Why did a scanned PDF fail?",
        answer:
          "The source PDF must contain selectable text. Image-based or scanned PDFs have no text layer, so no content can be extracted and no .docx is produced.",
      },
      {
        question: "Are my files uploaded?",
        answer:
          "The PDF bytes are read in your browser and converted locally with PDF.js and JSZip. The PDF.js worker script is fetched from the unpkg CDN on first use, but your file itself is never uploaded.",
      },
    ],
    howTo: [
      {
        title: "Pick a PDF",
        description:
          "Use the file picker (accepts .pdf) and confirm the file name and size are shown.",
      },
      {
        title: "Click Convert to Word",
        description:
          "PDF.js extracts the text page by page, the preview appears, and the .docx builds locally.",
      },
      {
        title: "Save with your browser",
        description:
          "The generated file downloads automatically as <original-name>.docx; the status line reports how many paragraphs were converted.",
      },
    ],
    workedExample: {
      input: "report.pdf — a 3-page text-based PDF",
      output: "Downloads report.docx · status: Converted 3 paragraphs → report.docx",
      note: "Each page with selectable text becomes one paragraph in the Word file, joined with blank lines in the preview. A PDF with no text layer instead shows the status No selectable text found — this PDF may be image-based.",
    },
    limits: [
      "This is text extraction, not layout conversion: fonts, images, tables, multi-column structure, and formatting are not preserved in the .docx.",
      "Scanned or image-only PDFs have no selectable text and cannot be converted.",
      "The Word file is minimal — a paragraph per extracted block, with the standard Normal style applied; it is not a styled reconstruction of the original design.",
      "The PDF.js worker is loaded from the unpkg CDN at runtime, so the first conversion needs a network connection to fetch that script (the library itself is bundled and version-pinned).",
      "Very large PDFs are processed synchronously in the browser and can be slow or memory-heavy.",
    ],
    privacyNote:
      "The PDF is read and converted entirely in your browser: PDF.js extracts text and JSZip packages the .docx, so your document never leaves the device. Note that the PDF.js worker script is pulled from the unpkg CDN on first conversion.",
    related: [
      {
        slug: "word-to-pdf",
        note: "Go the other way and turn a Word document into a PDF.",
      },
      {
        slug: "ocr",
        note: "Extract text from scanned or image-only PDFs first.",
      },
    ],
  },
  "robots-txt-generator": {
    examples: [
      {
        title: "Gate off private paths",
        description:
          "Paste paths like /admin and /private into the Disallow list and the generator emits one Disallow line per path under a User-agent: * group.",
      },
      {
        title: "Block everything at once",
        description:
          "Turn on Block everything to replace the whole allow/disallow block with a single Disallow: / fallback.",
      },
      {
        title: "Add per-bot rules",
        description:
          "Paste raw directives like User-agent: Googlebot followed by Disallow: /api into Extra rules and they are appended verbatim.",
      },
    ],
    faqs: [
      {
        question: "What does this tool generate?",
        answer:
          "A complete robots.txt as plain text: always a User-agent: * line, then either Disallow / Allow lines built from your lists or a single Disallow: / when Block everything is on, then your extra rules and a Sitemap line.",
      },
      {
        question: "Does robots.txt guarantee that pages will not be indexed?",
        answer:
          "No. robots.txt is an advisory convention that well-behaved crawlers may choose to follow; it does not guarantee that any crawler obeys it, and search engines can still pick up a blocklisted URL through other means. This tool only formats the text — it cannot enforce behavior.",
      },
      {
        question: "Does it understand wildcards, comments, or Crawl-delay?",
        answer:
          "No. The input is never parsed or validated: wildcards, $, #-comments, and Crawl-delay are simply copied through in the Extra rules verbatim, and there is no dedicated Crawl-delay field.",
      },
      {
        question: "What happens to the Allow/Disallow fields when Block everything is on?",
        answer:
          "They are ignored entirely and replaced by a single Disallow: / line, so nothing else in those lists appears in the output.",
      },
    ],
    howTo: [
      {
        title: "Set crawl rules",
        description:
          "Type disallowed and allowed paths, one per line. Only non-empty, trimmed lines become rules, with Allow lines placed after Disallow lines.",
      },
      {
        title: "Add a Sitemap entry",
        description:
          "Fill the Sitemap URL field; if non-empty it is appended after all rules, separated by a blank line.",
      },
      {
        title: "Copy or download",
        description:
          "Grab the generated robots.txt, or download it as robots.txt and upload it to the root of your site.",
      },
    ],
    workedExample: {
      input: "Defaults: Disallow /admin and /private, no custom rules, Sitemap https://example.com/sitemap.xml",
      output:
        "User-agent: *\nDisallow: /admin\nDisallow: /private\n\nSitemap: https://example.com/sitemap.xml",
      note: "Each non-empty Disallow line becomes its own directive. The Allow list was empty (so nothing was emitted), Extra rules were empty, and the Sitemap line is appended after a blank line. Toggling Block everything instead yields User-agent: * followed by a single Disallow: /.",
    },
    limits: [
      "Rules are not validated — lines are emitted as typed, so typos, malformed paths, and spaces are passed straight through.",
      "There is a single fixed structure: one User-agent: * group. There is no UI for multiple full user-agent groups or fine-grained per-bot rules (paste those into Extra rules).",
      "No wildcard or $ handling, no Crawl-delay field, and no support for comments or sitemap validation.",
      "Directives are advisory: nothing guarantees indexing results or that every crawler will obey the file.",
    ],
    privacyNote:
      "Generation is a simple text assembly that runs entirely in your browser. The rules and sitemap URL you enter are never uploaded.",
    related: [
      {
        slug: "sitemap-generator",
        note: "Build the matching sitemap.xml that the Sitemap line points to.",
      },
      {
        slug: "extract-urls",
        note: "Collect candidate paths from a page or config to feed into Allow/Disallow or sitemap lists.",
      },
    ],
  },
  "sitemap-generator": {
    examples: [
      {
        title: "Add a homepage-first sitemap",
        description:
          "Paste /, /blog, and /about on separate lines to build an XML sitemap where the first URL gets priority 1.0.",
      },
      {
        title: "Toggle lastmod and priority",
        description:
          "Uncheck Include lastmod for a fully deterministic file, or leave it on to stamp today's date on every URL.",
      },
      {
        title: "Organize before a redesign",
        description:
          "Paste your target paths while restructuring a site and copy the ready-to-host sitemap when you ship.",
      },
    ],
    faqs: [
      {
        question: "What exactly does this tool generate?",
        answer:
          "An XML sitemap (urlset with the sitemaps.org 0.9 namespace) built from the paths you paste. Each pasted line becomes one <url> entry with a <loc>, an optional <lastmod>, and an optional <priority>. It does not crawl or analyze your site.",
      },
      {
        question: "What is the accepted URL/input format?",
        answer:
          "Paths, one per line — they are trimmed and, if missing, get a leading slash, then joined onto the domain. Full URLs pasted as paths are not recognized and simply get appended to the domain (for example blog paths become <loc>https://example.com/blog</loc>).",
      },
      {
        question: "What date does <lastmod> contain?",
        answer:
          "Today's date in yyyy-mm-dd form, computed at generation time and applied to every URL. There is no way to set a custom or per-URL date, and enabling the checkbox makes the output time-dependent.",
      },
      {
        question: "How are changefreq and priority handled?",
        answer:
          "There is no changefreq field at all. Priority is either omitted or the fixed scheme 1.0 for the first URL and 0.8 for every other URL — there is no per-URL control.",
      },
    ],
    howTo: [
      {
        title: "Enter the domain",
        description:
          "Type your site domain. Trailing slashes are stripped, and the rest of each line is prepended unless it already starts with /.",
      },
      {
        title: "Paste the paths",
        description:
          "Add one path per line. The URL count stat updates as you type and counts the non-empty, trimmed lines.",
      },
      {
        title: "Copy or download the XML",
        description:
          "Copy the generated sitemap.xml or download it into the public folder of your site before submitting it to search engines.",
      },
    ],
    workedExample: {
      input: "Domain https://example.com · Paths: /, /blog, /about · Include lastmod OFF · Include priority ON",
      output:
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n<url>\n  <loc>https://example.com/</loc>\n  <priority>1.0</priority>\n</url>\n<url>\n  <loc>https://example.com/blog</loc>\n  <priority>0.8</priority>\n</url>\n<url>\n  <loc>https://example.com/about</loc>\n  <priority>0.8</priority>\n</url>\n</urlset>",
      note: "With Include lastmod off this output is fully deterministic: the first URL always gets 1.0 and the rest get 0.8. Turning lastmod on adds a <lastmod> line with the current date, which changes daily, so that version cannot be reproduced exactly on another day.",
    },
    limits: [
      "It does not discover, crawl, or validate your site's URLs — it only wraps whatever paths you paste.",
      "Full URLs are concatenated onto the domain instead of used as-is, so paste paths only.",
      "No changefreq field, no per-URL priority or lastmod, and duplicate lines are not removed.",
      "The <loc> value escapes only &, <, and >; there is no URL-length or encoding validation.",
    ],
    privacyNote:
      "XML generation is local to your browser — the domain and paths stay on your device and nothing is submitted to search engines or any server.",
    related: [
      {
        slug: "robots-txt-generator",
        note: "Generate the robots.txt that points search engines at your sitemap.",
      },
      {
        slug: "extract-urls",
        note: "Scrape candidate URLs from a page to seed the path list.",
      },
    ],
  },
  "expand-text": {
    examples: [
      {
        title: "Expand everyday contractions",
        description:
          "Paste text containing don't, it's, we're, or can't and the tool rewrites them to do not, it is, we are, and cannot.",
      },
      {
        title: "Spell out abbreviations",
        description:
          "Tick Also expand abbreviations so tokens like info, asap, and e.g. become information, as soon as possible, and for example.",
      },
      {
        title: "Watch the word delta",
        description:
          "The Words before / Words after stats show exactly how many tokens the expansion added to your copy.",
      },
    ],
    faqs: [
      {
        question: "Is this AI-generated expansion?",
        answer:
          "No. Expansion is deterministic and dictionary-driven: a fixed table of 25 contractions is expanded first, and a fixed table of 22 abbreviations can additionally be expanded. No model is called and no text is generated from scratch.",
      },
      {
        question: "What changes when text is expanded?",
        answer:
          "Only the exact tokens that appear in the two lookup tables. Contractions are always expanded; abbreviation expansion is off by default. Everything else — wording, order, punctuation — is left untouched, so this is token substitution, not sentence expansion.",
      },
      {
        question: "Is the result deterministic?",
        answer:
          "Yes. The same input and same checkbox state always produce the same output. Replacement is case-aware: if the matched token starts with an uppercase letter, the first letter of the replacement is capitalized.",
      },
      {
        question: "Does it understand context or improve writing quality?",
        answer:
          "No. It has no context or grammar awareness, and words not in the tables are never changed. It only makes the listed shorthand forms longer.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Enter any text containing contractions like don't, it's, we're, can't, or abbreviations like info or asap.",
      },
      {
        title: "Choose whether to expand abbreviations",
        description:
          "Leave the checkbox off for contractions only, or turn it on to also expand the 22-token abbreviation list.",
      },
      {
        title: "Compare and copy",
        description:
          "Check the Words before / Words after stats and the live output, then copy the expanded text or download expanded.txt.",
      },
    ],
    workedExample: {
      input: "I don't think it's ready.",
      output: "I do not think it is ready.",
      note: "don't → do not and it's → it is. The words counter changes from 5 to 7. With the abbreviation option on, an input like please send the info asap becomes please send the information as soon as possible (5 → 8 words).",
    },
    limits: [
      "Only the 25 contractions and 22 abbreviations in the lookup tables are expanded; no other tokens change.",
      "It does not add detail, rephrase, or lengthen sentences beyond those substitutions.",
      "Case handling inheres in the tables: matches whose first character is uppercase get a capitalized replacement, which can alter sentence flow (e.g., an added mid-sentence capitalized word).",
      "Replacement inserts a trailing space and runs of spaces are later collapsed, so spacing is normalized even when no expansion matches.",
    ],
    privacyNote:
      "Expansion runs locally in your browser against the bundled tables — your text is never uploaded.",
    related: [
      {
        slug: "shorten-text",
        note: "Do the reverse and tighten wordy text.",
      },
      {
        slug: "text-statistics",
        note: "See detailed word, sentence, and reading metrics after expanding.",
      },
    ],
  },
  "shorten-text": {
    examples: [
      {
        title: "Replace wordy phrases",
        description:
          "Paste sentences with in order to, due to the fact that, or a majority of and they become to, because, and most.",
      },
      {
        title: "Strip filler words",
        description:
          "Weak intensifiers like basically, very, and actually are removed when they follow a space inside a sentence.",
      },
      {
        title: "Track characters saved",
        description:
          "The Chars saved stat reports exactly how many characters the tightening removed from your text.",
      },
    ],
    faqs: [
      {
        question: "Is this semantic summarization?",
        answer:
          "No. It applies a fixed set of 14 phrase replacements and removes filler words from a fixed list of 18, then collapses extra whitespace. It is deterministic and has no understanding of the content.",
      },
      {
        question: "Which filler words are removed?",
        answer:
          "A fixed list: actually, basically, really, very, quite, just, simply, literally, totally, absolutely, definitely, extremely, pretty, super, honestly, frankly, obviously, and clearly — removed only when they are preceded by whitespace.",
      },
      {
        question: "Is the result deterministic?",
        answer:
          "Yes. Same input, same output. Phrase matches are word-boundary and case-insensitive with literal lowercase replacements, so a phrase at the start of a sentence can leave the sentence starting lowercase (In order to → to).",
      },
      {
        question: "What if nothing matches?",
        answer:
          "The output is the input with only whitespace collapsed and trimmed, and Chars saved reads 0 or a small number from that normalization.",
      },
    ],
    howTo: [
      {
        title: "Paste wordy text",
        description:
          "Enter a draft containing phrases like due to the fact that or filler words like basically.",
      },
      {
        title: "Review the stats",
        description:
          "Compare Words before and Words after plus Chars saved to see the tightening each pass performed.",
      },
      {
        title: "Copy or download",
        description:
          "Take the tightened version into your editor or download shortened.txt. Check that the phrase-level cuts still read naturally.",
      },
    ],
    workedExample: {
      input: "Due to the fact that the meeting was long, we basically decided to cut it short.",
      output: "because the meeting was long, we decided to cut it short.",
      note: "due to the fact that → because, and basically is removed from mid-sentence. The stats show Words 16 → 11 and 23 characters saved. Because the replacement is verbatim and lowercase, the sentence now starts with because in lowercase.",
    },
    limits: [
      "Only the 14 wordy phrases and 18 filler words are touched; anything not in those lists is unchanged.",
      "Filler words are only removed when preceded by whitespace, so one at the very start of the text is not matched.",
      "It is phrase-level tightening, not a rewrite, and does not preserve emphasis, tone, or rhetorical intent.",
      "A phrase at the start of a sentence produces a lowercase replacement verbatim (e.g., In order to → to).",
    ],
    privacyNote:
      "Shortening runs fully in your browser against the bundled phrase and filler lists. Your text is never uploaded.",
    related: [
      {
        slug: "expand-text",
        note: "Reverse the process and expand contractions and abbreviations.",
      },
      {
        slug: "ai-token-calculator",
        note: "Estimate how much the shorter text saves in model tokens.",
      },
    ],
  },
  "syllable-counter": {
    examples: [
      {
        title: "Check a poem for 5-7-5",
        description:
          "Paste a line and read the Total syllables stat plus the per-word breakdown to judge a haiku structure.",
      },
      {
        title: "Compare near-homophones",
        description:
          "Type words like table, alone, and beautiful to see the rule-based counts and spot edge cases such as baked staying at 2.",
      },
      {
        title: "Audit a script's rhythm",
        description:
          "Run whole sentences through and use the top-50 per-word list to find heavy or light words before recording.",
      },
    ],
    faqs: [
      {
        question: "How does the counting algorithm work?",
        answer:
          "It lowercases the word, strips non-letters, counts runs of the letters a, e, i, o, u, and y as vowel groups, then applies a silent-e rule: a trailing e is dropped when the word ends in a consonant-e pattern that is not -le or -ed and the count exceeds one. Every word counts at least 1.",
      },
      {
        question: "Is the count linguistically exact?",
        answer:
          "Not always. The rule-based heuristic can differ from dictionary or pronunciation counts — for example baked is scored 2, rhythm scores 1, and created scores 2. Treat results as estimates and verify critical lines.",
      },
      {
        question: "What is the Total syllables number?",
        answer:
          "It is countSyllables applied to the entire text after stripping non-letters, which effectively counts the concatenated letters as one stream. Because of that, the total can occasionally differ from adding up the per-word column for the same input.",
      },
      {
        question: "How is the per-word list built?",
        answer:
          "Words are tokenized with the shared splitter (letters, digits, apostrophes, and hyphens), lowercased, de-duplicated, sorted by syllable count descending, and the top 50 are shown. Unique words scanned reports how many distinct words that list has.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Type a line, poem, or paragraph. The stats appear as soon as there is non-whitespace text.",
      },
      {
        title: "Read the totals",
        description:
          "Total syllables covers the whole text and Unique words scanned counts distinct tokens in the per-word list.",
      },
      {
        title: "Use the per-word table",
        description:
          "Scan the top-50 list (descending by count) to find the heaviest words, copy the results, or download them as a file.",
      },
    ],
    workedExample: {
      input: "The table was beautiful. Hello world.",
      output:
        "Total syllables: 10 · Unique words scanned: 6 · Per word: beautiful 3 · table 2 · hello 2 · the 1 · was 1 · world 1",
      note: "beautiful shows 3 groups (eau, i, u), table 2 (its trailing -le exempts the silent-e rule), and hello 2. Ties keep first-seen order, so table sorts before hello and the, was, world follow. These counts are the literal output of countSyllables.",
    },
    limits: [
      "The vowel-group + silent-e heuristic only approximates pronunciation; words like baked, rhythm, and created differ from dictionary counts.",
      "Only the top 50 unique words are displayed; longer texts are truncated in the per-word list.",
      "Not stripped per token for the total: the total syllable value is computed on the concatenated letter stream and can differ from summing the per-word column.",
      "Non-Latin scripts contribute nothing, because the cleaner strips anything outside a-z and hyphens keep concatenated words joined.",
    ],
    privacyNote:
      "Counting is done locally in your browser with the shared syllable algorithm — your text is not sent anywhere.",
    related: [
      {
        slug: "reading-time",
        note: "Convert the word and syllable estimates into reading minutes.",
      },
      {
        slug: "haiku-generator",
        note: "Struggle with 5-7-5 structure? Grab a ready-made haiku instead.",
      },
    ],
  },
  "acronym-generator": {
    examples: [
      {
        title: "Initials from a phrase",
        description:
          "Type Search Engine Optimization and get SEO with the spelled-out form S. E. O. and a count of 3 words.",
      },
      {
        title: "Filter the words it uses",
        description:
          "Words that do not start with a letter are dropped, so 3rd Place AI sprint skips 3rd and yields PAS from Place, AI, and sprint.",
      },
      {
        title: "Cycle style variations",
        description:
          "Press Vary to shuffle the five templates (joiners, suffixes like System, and prefixes like The) into a new deterministic order for the same initials.",
      },
    ],
    faqs: [
      {
        question: "How are words extracted?",
        answer:
          "The phrase is split on whitespace, words that do not start with a letter are dropped, non-letter characters are stripped from the survivors, and the first letter of each becomes the acronym — always uppercase. There is no stop-word list and no semantic understanding of the phrase.",
      },
      {
        question: "Why could the acronym look odd?",
        answer:
          "Punctuation is stripped before taking the first letter — AI-powered contributes A from AIpowered — and the style templates are mechanical placeholders, so a generated acronym is not guaranteed to be a real or meaningful word.",
      },
      {
        question: "What happens with fewer than two words?",
        answer:
          "Nothing is generated. With fewer than two usable words the card and the variant list stay empty.",
      },
      {
        question: "Are the style variants random?",
        answer:
          "They are deterministic per seed. A seeded shuffle picks 5 of the 6 fixed templates, so Vary (or any seed change) reorders them rather than choosing new lines. Templates reference up to four letters, so a two-letter acronym fills patterns with blanks.",
      },
    ],
    howTo: [
      {
        title: "Type a phrase",
        description:
          "Enter two or more words — the initials card appears immediately with the letters, the spelled-out form, and the word count.",
      },
      {
        title: "Press Vary for variants",
        description:
          "Click Vary to re-shuffle the five acronym style templates (e.g., S-E, S E O System, The S E Framework).",
      },
      {
        title: "Copy or download",
        description:
          "Grab the variant lines from the output box or download acronym-variants.txt.",
      },
    ],
    workedExample: {
      input: "Search Engine Optimization",
      output: "SEO · S. E. O. · Initials from 3 words",
      note: "Each word contributes its capitalized first letter, giving the letters SEO and the spellings S. E. O. The style variants below reorder fixed templates around those letters (first variant at the default seed is S-E).",
    },
    limits: [
      "It produces initials only — no dictionary matching and no attempt to make the letters spell a pronounceable or existing word.",
      "Words must start with a Latin letter and non-letters are stripped before taking initials, so punctuation-heavy or non-Latin phrases produce unexpected output.",
      "At least two usable words are required; otherwise nothing is generated.",
      "Style templates assume up to four initials, so shorter phrases leave blank slots and longer phrases are truncated after four positions.",
    ],
    privacyNote:
      "Initials and variants are computed in your browser — the phrase is never sent to a server.",
    related: [
      {
        slug: "case-converter",
        note: "Normalize the phrase casing before or after abbreviating.",
      },
      {
        slug: "slug-generator",
        note: "Build URL-safe slugs from the same kind of phrase.",
      },
    ],
  },
  "word-frequency-counter": {
    examples: [
      {
        title: "Catch case-folded duplicates",
        description:
          "Type The fox and the dog — the counts collapse The/the into a single lowercase the, so frequency is case-insensitive.",
      },
      {
        title: "Watch punctuation break tokens",
        description:
          "Paste a sentence with words split by punctuation and each side counts separately (hello, and hello count hello twice).",
      },
      {
        title: "Change the top words",
        description:
          "Adjust Top words to raise or lower the number of ranked entries shown (clamped between 1 and 100).",
      },
    ],
    faqs: [
      {
        question: "How is text tokenized?",
        answer:
          "With the shared word splitter: runs of letters, digits, apostrophes, curly apostrophes, and hyphens. Spaces and punctuation split tokens. It is a simple regex tokenizer, not linguistic analysis, so hyphenated words stay as one token while quoted text splits.",
      },
      {
        question: "Is counting case-sensitive?",
        answer:
          "No. Every token is lowercased before counting, so The, THE, and the all increment the same key.",
      },
      {
        question: "Are stop words removed?",
        answer:
          "There is no stop-word list. The only filter is that tokens of length 1 are skipped, so single-character words like a and I never appear.",
      },
      {
        question: "Is the ordering deterministic?",
        answer:
          "Yes. Results are sorted by count descending, and ties keep first-seen order (the first occurrence in the text wins). The list is truncated to the chosen limit.",
      },
    ],
    howTo: [
      {
        title: "Paste or type text",
        description:
          "Enter any text — the frequency bars and counts render automatically.",
      },
      {
        title: "Adjust the rank size",
        description:
          "Set Top words to the number of rows you want (default 20, clamped to 1–100).",
      },
      {
        title: "Read the bars",
        description:
          "Each row shows the word, a bar scaled to the top word, and its count, from most frequent to least.",
      },
    ],
    workedExample: {
      input: "The quick brown fox jumps over the lazy dog. The fox is quick!",
      output:
        "the 3 · quick 2 · fox 2 · brown 1 · jumps 1 · over 1 · lazy 1 · dog 1 · is 1",
      note: "All three occurrences of the (The, the, The) fold into one lowercase key, punctuation sticks are removed, and ties keep first-seen order: quick before fox, then brown, jumps, over, lazy, dog, is. No stop words are filtered here.",
    },
    limits: [
      "Tokenization is regex-based, so apostrophes and hyphens are kept inside words (don't counts as one token) and non-Latin text splits character-by-character.",
      "Single-character tokens are always skipped, even when their count would matter.",
      "Numbers count as words too — for example 2026 counts once with length filter, but 3 never appears because its length is 1.",
      "Only the top-limit rows are shown (max 100); the underlying full frequency table is not exposed.",
    ],
    privacyNote:
      "Counting is computed locally in your browser. The text you enter is never uploaded.",
    related: [
      {
        slug: "character-frequency-counter",
        note: "Switch from words to the individual characters that make them up.",
      },
      {
        slug: "text-statistics",
        note: "Combine frequency with counts, readability, and reading time.",
      },
    ],
  },
  "character-frequency-counter": {
    examples: [
      {
        title: "Fold case by default",
        description:
          "Type Hello World and H and W are counted together with h and w, producing l 3, o 2, and the rest at 1.",
      },
      {
        title: "Split case when you need it",
        description:
          "Turn on Case sensitive to keep H separate from h, W from w, and so on.",
      },
      {
        title: "Show that spaces are skipped",
        description:
          "Enter text with spaces, tabs, or newlines and confirm they never appear in the tally — only non-whitespace characters are counted.",
      },
    ],
    faqs: [
      {
        question: "Does it count spaces?",
        answer:
          "No. Any character whose trimmed form is empty — spaces, tabs, and newlines — is skipped entirely and never appears in the list.",
      },
      {
        question: "Is counting case-sensitive?",
        answer:
          "By default no: the text is lowercased before counting, so A and a share one row. The Case sensitive checkbox keeps them separate.",
      },
      {
        question: "How are digits and punctuation handled?",
        answer:
          "They are counted like any other non-whitespace character. Only whitespace is excluded — 1 and ! appear as rows with their own counts.",
      },
      {
        question: "How is ordering determined?",
        answer:
          "Rows are sorted by count descending and ties keep first-seen order. Only the top 30 characters are displayed.",
      },
    ],
    howTo: [
      {
        title: "Paste or type text",
        description:
          "The frequency bar chart renders instantly from whatever text is in the box.",
      },
      {
        title: "Toggle case sensitivity",
        description:
          "Leave Case sensitive off to fold cases together, or turn it on to isolate uppercase from lowercase letters.",
      },
      {
        title: "Read the normalized bars",
        description:
          "Each bar's width is the count relative to the most frequent character, with the absolute count beside it.",
      },
    ],
    workedExample: {
      input: "Hello World",
      output: "l 3 · o 2 · h 1 · e 1 · w 1 · r 1 · d 1",
      note: "With case sensitivity off, the space is skipped and H/W are folded into h/w, so the tally covers 8 counted characters instead of the 11 typed. With Case sensitive on, the output becomes l 3, o 2, H 1, e 1, W 1, r 1, d 1.",
    },
    limits: [
      "Whitespace is always excluded — there is no option to include spaces, tabs, or newlines in the tally.",
      "Only the top 30 characters are shown; the remainder of the distribution is not visible.",
      "Characters are iterated as Unicode code points, so an emoji counts as one entry and combining characters can split a visually single glyph.",
      "Tie ordering is first-seen, which depends on the order characters first appear in your text.",
    ],
    privacyNote:
      "Counting runs locally in your browser — the text is never sent to a server.",
    related: [
      {
        slug: "word-frequency-counter",
        note: "Count the words those characters form instead.",
      },
      {
        slug: "case-converter",
        note: "Normalize casing first to steer the case-sensitive tallies.",
      },
    ],
  },
  "base64-encoder": {
    examples: [
      {
        title: "Encode and decode text",
        description:
          "Encode Hello, World! to SGVsbG8sIFdvcmxkIQ==, switch to Decode, paste it back, and recover the original text.",
      },
      {
        title: "Keep Unicode intact",
        description:
          "Non-ASCII text is encoded as its UTF-8 bytes, so héllo café round-trips through aMOpbGxvIGNhZsOp unchanged.",
      },
      {
        title: "Spot the encoding distinction",
        description:
          "Compare the readable original with its scrambled-looking Base64 form to see that this is a representation, not obfuscation.",
      },
    ],
    faqs: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is a reversible encoding scheme that represents binary or text bytes as ASCII characters. It provides no confidentiality, and anyone can decode it. Do not use it to hide sensitive data.",
      },
      {
        question: "How is Unicode handled?",
        answer:
          "Encoding first converts the text to UTF-8 bytes with TextEncoder and then encodes those bytes, so accented letters and other scripts survive a round trip. Decoding reverses the same steps with atob and TextDecoder.",
      },
      {
        question: "Does decoding clean up whitespace?",
        answer:
          "The input is trimmed before decoding, so a leading or trailing newline or space does not break it. Invalid characters, bad padding, or a corrupted string raise an error and the tool shows Invalid Base64 string — check your input.",
      },
      {
        question: "Does this tool handle files or binary data?",
        answer:
          "No. Working with the device clipboard and history. It only takes and produces text in the textarea — there is no file, image, or binary upload support.",
      },
    ],
    howTo: [
      {
        title: "Type or paste text",
        description:
          "Enter plain text for encoding, or a Base64 string for decoding, into the input box.",
      },
      {
        title: "Pick a direction",
        description:
          "Press Encode to build the Base64 text or Decode to reverse it. Results update instantly.",
      },
      {
        title: "Copy or download",
        description:
          "Grab the output to paste into configs, scripts, or APIs, or download it as base64.txt.",
      },
    ],
    workedExample: {
      input: "Plain text: Hello, World!",
      output: "Encoded: SGVsbG8sIFdvcmxkIQ==",
      note: "The UTF-8 bytes of Hello, World! become SGVsbG8sIFdvcmxkIQ==, and decoding that string returns Hello, World! exactly. The same encode path turns héllo café into aMOpbGxvIGNhZsOp.",
    },
    limits: [
      "Text only — no file, image, or binary upload; browser clipboard text and typed input are the entire interface.",
      "Decoding requires valid Base64 characters and padding; malformed input errors without partial output.",
      "Very large text is converted synchronously in the browser and can be slow or memory-heavy.",
      "It is an encoding, not a security mechanism — the output is trivially reversible by design.",
    ],
    privacyNote:
      "Encoding and decoding use the standard TextEncoder, TextDecoder, btoa, and atob APIs entirely in your browser. Nothing is uploaded.",
    related: [
      {
        slug: "url-encoder",
        note: "Percent-encode text for URLs instead of Base64.",
      },
      {
        slug: "sha256-generator",
        note: "Compute a one-way hash rather than a reversible encoding when you need integrity.",
      },
    ],
  },
  "url-encoder": {
    examples: [
      {
        title: "Encode a query value",
        description:
          "Type text with spaces and special characters and get back the percent-encoded form for use as a query parameter value.",
      },
      {
        title: "See component-level output",
        description:
          "Paste a full URL and watch : / ? & = get encoded too — proof that this uses component encoding, not whole-URL encoding.",
      },
      {
        title: "Decode an encoded string",
        description:
          "Switch to Decode and convert an encoded value like cafe%20porto back into its readable text.",
      },
    ],
    faqs: [
      {
        question: "Which encoding function is used?",
        answer:
          "encodeURIComponent for encoding and decodeURIComponent for decoding. That means the entire input is percent-encoded as one component: reserved characters such as :, /, ?, &, and = are also converted to % sequences.",
      },
      {
        question: "Does it encode an entire URL or a component?",
        answer:
          "A component. A full URL passed in comes out fully encoded (https://example.com/search?q=x becomes https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dx), which is correct for a query value but not for a ready-to-use address bar URL — for that you would keep the scheme and slashes intact.",
      },
      {
        question: "How is Unicode handled?",
        answer:
          "Text is encoded to its UTF-8 percent sequences, so café becomes caf%C3%A9 and Japanese text becomes its %E6%9D%B1%… form. Decoding reassembles the original characters.",
      },
      {
        question: "What happens with malformed percent sequences?",
        answer:
          "A % not followed by two hex digits (for example %zz) throws a URI error. The tool shows the message Invalid input — could not decode., which is used for both directions.",
      },
    ],
    howTo: [
      {
        title: "Paste your text",
        description:
          "Enter a value to encode or an encoded string to decode.",
      },
      {
        title: "Choose the direction",
        description:
          "Press Encode for percent-encoding or Decode to reverse it; the result renders live.",
      },
      {
        title: "Copy the result",
        description:
          "Use the encoded value inside a URL, an API call, or a data attribute, or download url.txt.",
      },
    ],
    workedExample: {
      input: "https://example.com/search?q=creator tools&page=1",
      output:
        "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcreator%20tools%26page%3D1",
      note: "encodeURIComponent is used, so the scheme colons, slashes, ?, &, and = are all percent-encoded along with the space (%20). decodeURIComponent restores the original string exactly. The alternative encodeURI would have left ://?&= untouched — that is not what this tool does.",
    },
    limits: [
      "Component-level encoding: the entire input is encoded, so a pasted URL becomes a data string rather than a clickable URL.",
      "Unsafe characters like ? / = & are always percent-encoded; there is no option to preserve parts of a URL.",
      "Malformed input throws instead of partial decode, and the same generic error message is shown for either direction.",
      "It only transforms text — it does not validate or fix real-world URLs.",
    ],
    privacyNote:
      "Both functions run locally in your browser via encodeURIComponent/decodeURIComponent. The input never leaves the page.",
    related: [
      {
        slug: "base64-encoder",
        note: "Encode text in an ASCII-safe form that keeps more characters intact.",
      },
      {
        slug: "json-formatter",
        note: "Pretty-print a payload that contains percent-encoded or Base64 values.",
      },
    ],
  },
  "uuid-generator": {
    examples: [
      {
        title: "Bulk identifiers",
        description:
          "Set Count to 10 (the default) and press Generate for a column of UUIDs to use as database keys or test fixtures.",
      },
      {
        title: "Choose random or time-ordered",
        description:
          "Default to UUID v4 for pure randomness, or pick UUID v7 to get time-prefixed values that sort chronologically and cluster on a timestamp.",
      },
      {
        title: "Formats for different systems",
        description:
          "Toggle No hyphens (compact), Braces, or Uppercase to match the shape a given API, config, or lint rule expects.",
      },
    ],
    faqs: [
      {
        question: "Which UUID versions are generated?",
        answer:
          "Two: v4 via crypto.randomUUID() (random) and v7 from a small custom function built on crypto.getRandomValues + a millisecond timestamp. v4 sets the version nibble to 4; v7 sets it to 7.",
      },
      {
        question: "What is the randomness source?",
        answer:
          "The Web Crypto API. v4 delegates to crypto.randomUUID() and v7 fills 16 bytes with crypto.getRandomValues before stamping in the timestamp and version/variant bits. In browsers these are cryptographically strong, but the tool does not add any independent guarantees.",
      },
      {
        question: "Is the output deterministic?",
        answer:
          "No — the value itself is random on every run. The only fixed things are the format, the version/variant nibbles, and the option order (compact → braces → uppercase).",
      },
      {
        question: "Are there any limits?",
        answer:
          "Count is clamped to 1–100 (default 10), output is never validated or de-duplicated, and crypto.randomUUID() requires a secure context (HTTPS or localhost) in browsers.",
      },
    ],
    howTo: [
      {
        title: "Set the count and version",
        description:
          "Enter a count from 1–100 and choose v4 or v7.",
      },
      {
        title: "Tune the format",
        description:
          "Toggle Uppercase, No hyphens, or Braces — applied in that order — to shape every generated line.",
      },
      {
        title: "Generate and reuse",
        description:
          "Press Generate to fill the box, generate again for more, or download the current set as uuids.txt.",
      },
    ],
    workedExample: {
      input: "Count 2, version v4, defaults (lowercase, hyphenated)",
      output:
        "0f8c3d2a-1b4e-4a9f-8c7d-5e6f1a2b3c4d\n9e2a4b6c-7d8f-4e1a-9b3c-2d5f6a7b8c9d",
      note: "Each line is a fresh random value, so these exact strings will never repeat. The fixed markers are the shape (8-4-4-4-12 hex) and the nibbles: position 15 is 4 for v4, and v7 output carries a 7 there with a variant of 8, 9, a, or b. With No hyphens + Braces + Uppercase the same v4 sample renders as {0F8C3D2A1B4E4A9F8C7D5E6F1A2B3C4D}.",
    },
    limits: [
      "Values are random, so reproducibility is limited to format, version, and variant bits — the strings themselves differ every run.",
      "Up to 100 per generation, no de-duplication, and no collision detection on the output list.",
      "crypto.randomUUID() only works in secure contexts such as HTTPS or localhost; the custom v7 path has no such dependency.",
      "Format toggles combine in a fixed order (compact → braces → uppercase), so braces wrap the hyphenless form when both are on.",
    ],
    privacyNote:
      "UUIDs are generated locally with the browser's Web Crypto API. No network request is made and nothing is stored.",
    related: [
      {
        slug: "url-encoder",
        note: "Percent-encode these identifiers when embedding them in URLs.",
      },
      {
        slug: "json-formatter",
        note: "Pretty-print the JSON you paste the generated IDs into.",
      },
    ],
  },
  "pdf-compress": {
    examples: [
      {
        title: "Strip metadata-heavy bloat",
        description:
          "Pick a PDF with a long author/title/keywords footprint and let the default Strip document metadata pass remove those fields before re-saving.",
      },
      {
        title: "Rewrite structure for redundancy",
        description:
          "Files with duplicated or scattered objects shrink most, because the pass re-saves the document using cross-reference object streams.",
      },
      {
        title: "Check realistic expectations",
        description:
          "Run a compact PDF and watch the status — some files barely shrink, and the percentage is clamped so it never reports a negative value.",
      },
    ],
    faqs: [
      {
        question: "How does the compression actually work?",
        answer:
          "The PDF is loaded with the client-side pdf-lib library, optionally stripped of its metadata (title, author, subject, keywords, producer, and creator), and re-saved with useObjectStreams: true. It does not recompress images, fonts, or content streams.",
      },
      {
        question: "Will every PDF get smaller?",
        answer:
          "No. The size reduction comes from metadata removal plus the structural rewrite. PDFs with little metadata and already-compact objects may shrink only slightly or not at all, and an output that comes out larger is reported as 0% smaller because the percentage is floored at zero.",
      },
      {
        question: "Does the visual content change?",
        answer:
          "Page content objects are passed through untouched, so text, images, and layout are preserved. What changes is the document structure and, when enabled, the metadata fields.",
      },
      {
        question: "Is the original file modified?",
        answer:
          "No. The compressed file downloads as <name>-compressed.pdf and the source file you picked is never overwritten. The status line reports the before → after sizes and the rounded percentage. Corrupt or unsupported files show Could not compress this PDF.",
      },
    ],
    howTo: [
      {
        title: "Choose a PDF",
        description:
          "Use the file picker (accepts .pdf). The file name and size are shown before anything is processed.",
      },
      {
        title: "Decide on metadata",
        description:
          "Keep Strip document metadata on to clear author/title/keywords, or uncheck it to preserve them along with the rewrite.",
      },
      {
        title: "Compress and download",
        description:
          "Press Compress PDF; when done, the rewritten file downloads automatically as <name>-compressed.pdf and the status shows the size delta.",
      },
    ],
    workedExample: {
      input: "report.pdf (a metadata-heavy, single-file PDF)",
      output: "Downloads report-compressed.pdf · status reports before → after and % smaller",
      note: "Sizes depend entirely on the input. As a deterministic illustration, an original of exactly 1,048,576 bytes that re-saves to 943,718 bytes produces the status 1.00 MB → 921.6 KB (10% smaller). A file that re-saves larger still shows 0% smaller. No exact output size can be promised in advance.",
    },
    limits: [
      "This is a structural/optimization pass, not lossy image or font compression — the biggest savings come from stripping metadata and redundant structure.",
      "Only one PDF at a time, and processing happens synchronously in the browser, so very large documents can be slow or memory-heavy.",
      "The reduction percentage is floored at 0%, and gains vary from file to file; some PDFs will not shrink noticeably.",
      "pdf-lib must be able to load the file; unsupported or corrupted inputs hit the generic Could not compress this PDF. error with no partial download.",
    ],
    privacyNote:
      "The PDF is processed entirely in your browser by the bundled pdf-lib library — the file is never uploaded and no external worker or CDN resource is fetched for this tool.",
    related: [
      {
        slug: "pdf-merge",
        note: "Combine files first, then compress the merged result.",
      },
      {
        slug: "pdf-split",
        note: "Extract just the pages you need before optimizing size.",
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
