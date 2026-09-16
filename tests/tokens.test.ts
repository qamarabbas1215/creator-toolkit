import { describe, expect, it } from "vitest";
import { estimateCost, estimateTokens, TOKEN_MODELS } from "@/lib/tokens";

describe("token estimation", () => {
  it("estimates tokens from characters", () => {
    const model = TOKEN_MODELS.find((m) => m.id === "gpt-4o")!;
    expect(estimateTokens("abcd", model)).toBe(1);
    expect(estimateTokens("abcdefgh", model)).toBe(2);
  });

  it("never returns negative counts", () => {
    const model = TOKEN_MODELS[0];
    expect(estimateTokens("", model)).toBe(0);
  });

  it("estimates cost by token volumes", () => {
    const model = TOKEN_MODELS.find((m) => m.id === "gpt-4o")!;
    // 1M input tokens at $2.5 + 1M output at $10
    expect(estimateCost(1_000_000, 1_000_000, model)).toBeCloseTo(12.5);
  });
});