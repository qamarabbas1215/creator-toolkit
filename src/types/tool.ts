export type CategorySlug =
  | "ai"
  | "writing"
  | "youtube"
  | "seo"
  | "social"
  | "image"
  | "text"
  | "developer";

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
