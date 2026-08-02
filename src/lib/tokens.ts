export interface TokenModel {
  id: string;
  name: string;
  provider: string;
  charsPerToken: number;
  inputPerMillion: number;
  outputPerMillion: number;
}

export const TOKEN_MODELS: TokenModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    charsPerToken: 4,
    inputPerMillion: 2.5,
    outputPerMillion: 10,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    charsPerToken: 4,
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    charsPerToken: 4,
    inputPerMillion: 10,
    outputPerMillion: 30,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    charsPerToken: 4,
    inputPerMillion: 0.5,
    outputPerMillion: 1.5,
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    charsPerToken: 3.5,
    inputPerMillion: 3,
    outputPerMillion: 15,
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    charsPerToken: 3.5,
    inputPerMillion: 0.8,
    outputPerMillion: 4,
  },
  {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    charsPerToken: 4,
    inputPerMillion: 1.25,
    outputPerMillion: 5,
  },
  {
    id: "gemini-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    charsPerToken: 4,
    inputPerMillion: 0.075,
    outputPerMillion: 0.3,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    charsPerToken: 3.5,
    inputPerMillion: 0.27,
    outputPerMillion: 1.1,
  },
  {
    id: "llama-3",
    name: "Llama 3.1 70B",
    provider: "Meta",
    charsPerToken: 4,
    inputPerMillion: 0.7,
    outputPerMillion: 0.7,
  },
  {
    id: "mistral-large",
    name: "Mistral Large 2",
    provider: "Mistral",
    charsPerToken: 4,
    inputPerMillion: 2,
    outputPerMillion: 6,
  },
  {
    id: "qwen",
    name: "Qwen 2.5 72B",
    provider: "Alibaba",
    charsPerToken: 3.5,
    inputPerMillion: 0.4,
    outputPerMillion: 0.4,
  },
  {
    id: "generic",
    name: "Generic (average)",
    provider: "—",
    charsPerToken: 4,
    inputPerMillion: 0,
    outputPerMillion: 0,
  },
];

export function estimateTokens(text: string, model: TokenModel): number {
  const chars = text.length;
  return Math.max(0, Math.round(chars / model.charsPerToken));
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: TokenModel
): number {
  return (
    (inputTokens / 1_000_000) * model.inputPerMillion +
    (outputTokens / 1_000_000) * model.outputPerMillion
  );
}
