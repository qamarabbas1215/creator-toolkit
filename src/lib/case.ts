export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "alternating"
  | "reverse"
  | "inverse";

export function toWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .split(/\s+/)
        .map(capitalize)
        .join(" ");
    case "sentence":
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) =>
        c.toUpperCase()
      );
    case "camel":
      return toWords(text)
        .map((w, i) =>
          i === 0 ? w.toLowerCase() : capitalize(w)
        )
        .join("");
    case "pascal":
      return toWords(text).map(capitalize).join("");
    case "snake":
      return toWords(text).map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return toWords(text).map((w) => w.toLowerCase()).join("-");
    case "alternating":
      return [...text]
        .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join("");
    case "reverse":
      return [...text].reverse().join("");
    case "inverse":
      return [...text]
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join("");
  }
}

export const CASE_TYPES: { id: CaseType; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "alternating", label: "aLtErNaTiNg" },
  { id: "reverse", label: "Reverse" },
  { id: "inverse", label: "inVERSE cASE" },
];
