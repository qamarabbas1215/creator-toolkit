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
