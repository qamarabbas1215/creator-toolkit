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
