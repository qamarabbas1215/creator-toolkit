export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "youtube-titles-that-get-clicked",
    title: "How to write YouTube titles that actually get clicked",
    category: "YouTube",
    readTime: "6 min read",
    date: "2026-07-18",
    excerpt:
      "The first 50 characters decide whether your video gets clicked. Here's the exact formula we use.",
    content: [
      "Your title has one job: earn the click. Viewers scan thumbnails and titles in a fraction of a second, so every word counts.",
      "Start with the outcome — what will the viewer get? Then add specificity with a number or a concrete result. Finally, tease the method: curiosity that isn't cheap trickery.",
      "Our YouTube Title Generator scores every title for character count, outcome keywords, and curiosity triggers, then lets you click-tune individual suggestions. Run three rounds of variations and pick the winner.",
    ],
  },
  {
    slug: "creators-seo-checklist",
    title: "The creator's SEO checklist before you hit publish",
    category: "SEO",
    readTime: "8 min read",
    date: "2026-06-30",
    excerpt:
      "A 10-minute pre-publish routine that helps every blog post, video, and description rank better.",
    content: [
      "Most creators skip SEO because it feels like a separate job. It doesn't have to be. Ten minutes with the right tools is enough.",
      "Check keyword density in your post, write a title and meta description that fit the preview boxes, and generate a clean slug. Our tools do all three instantly.",
      "The Keyword Density tool shows you over- and under-optimized terms, the Meta Title and Description generators fit your copy to search results, and the Slug Generator keeps URLs tidy.",
    ],
  },
  {
    slug: "most-used-text-tools",
    title: "Our 5 most used text tools (and how to use them)",
    category: "Text Tools",
    readTime: "4 min read",
    date: "2026-05-22",
    excerpt:
      "From deduplication to case conversion, these quiet workhorses save creators hours every week.",
    content: [
      "Some tools are showy; others just quietly save you time. These five text tools are the ones our team uses every single day.",
      "Remove Duplicate Lines cleans exported lists in one click. Find & Replace handles bulk edits without regex headaches. Prefix/Suffix adds formatting to every line. Line Sorter alphabetizes tags and keywords. And Case Converter fixes mismatched headlines.",
      "They all run in your browser — paste, transform, copy. No uploads, no waiting.",
    ],
  },
];
