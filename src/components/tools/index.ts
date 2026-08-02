import type { ComponentType } from "react";
import {
  CharacterCounter,
  ParagraphCounter,
  ReadingTime,
  SentenceCounter,
  SpeakingTime,
  WordCounter,
} from "./writing";
import {
  CaseConverter,
  ExtractEmails,
  ExtractNumbers,
  ExtractUrls,
  FindReplace,
  LineSorter,
  PrefixSuffix,
  RemoveDuplicateLines,
  RemoveEmptyLines,
  ReverseText,
} from "./text-tools";
import {
  ThumbnailTextChecker,
  YoutubeHookGenerator,
  YoutubeTagGenerator,
  YoutubeTitleGenerator,
} from "./youtube";
import {
  KeywordDensity,
  MetaDescriptionGenerator,
  MetaTitleGenerator,
  SlugGenerator,
} from "./seo";
import { BioGenerator, HashtagGenerator } from "./social";
import {
  AspectRatioCalculator,
  ImagePromptEnhancer,
  NegativePromptGenerator,
} from "./image";
import {
  Base64Encoder,
  JsonFormatter,
  UrlEncoder,
  UuidGenerator,
} from "./developer";
import { AiCostCalculator, AiTokenCalculator } from "./ai";

export const toolComponents: Record<string, ComponentType> = {
  "character-counter": CharacterCounter,
  "word-counter": WordCounter,
  "sentence-counter": SentenceCounter,
  "paragraph-counter": ParagraphCounter,
  "reading-time": ReadingTime,
  "speaking-time": SpeakingTime,
  "case-converter": CaseConverter,
  "find-and-replace": FindReplace,
  "remove-duplicate-lines": RemoveDuplicateLines,
  "remove-empty-lines": RemoveEmptyLines,
  "line-sorter": LineSorter,
  "prefix-suffix": PrefixSuffix,
  "reverse-text": ReverseText,
  "extract-urls": ExtractUrls,
  "extract-emails": ExtractEmails,
  "extract-numbers": ExtractNumbers,
  "youtube-title-generator": YoutubeTitleGenerator,
  "youtube-tag-generator": YoutubeTagGenerator,
  "youtube-hook-generator": YoutubeHookGenerator,
  "thumbnail-text-checker": ThumbnailTextChecker,
  "keyword-density": KeywordDensity,
  "meta-title-generator": MetaTitleGenerator,
  "meta-description-generator": MetaDescriptionGenerator,
  "slug-generator": SlugGenerator,
  "hashtag-generator": HashtagGenerator,
  "bio-generator": BioGenerator,
  "image-prompt-enhancer": ImagePromptEnhancer,
  "negative-prompt-generator": NegativePromptGenerator,
  "aspect-ratio-calculator": AspectRatioCalculator,
  "json-formatter": JsonFormatter,
  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "uuid-generator": UuidGenerator,
  "ai-token-calculator": AiTokenCalculator,
  "ai-cost-calculator": AiCostCalculator,
};
