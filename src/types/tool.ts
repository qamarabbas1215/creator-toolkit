export type CategorySlug =
  | "ai"
  | "writing"
  | "youtube"
  | "seo"
  | "social"
  | "image"
  | "text"
  | "developer"
  | "pdf"
  | "file";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  icon: string;
  keywords: string[];
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  addedAt?: string;
  popularity: number;
  pro?: boolean;
}

export interface ToolExample {
  title: string;
  description: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  title: string;
  description: string;
}

export interface ToolWorkedExample {
  input: string;
  output: string;
  note?: string;
}

export interface ToolRelated {
  slug: string;
  note: string;
}

export interface ToolBlogLink {
  slug: string;
  title: string;
  readTime: string;
}

export interface ToolExtras {
  examples: ToolExample[];
  faqs: ToolFaq[];
  howTo?: ToolHowToStep[];
  workedExample?: ToolWorkedExample;
  limits?: string[];
  privacyNote?: string;
  related?: ToolRelated[];
  blogLink?: ToolBlogLink;
}
