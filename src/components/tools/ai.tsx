"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  OptionRow,
  Select,
  Stat,
  StatGrid,
  TextInput,
  Textarea,
} from "@/components/ui";
import { OutputArea } from "@/components/ui/OutputArea";
import {
  TOKEN_MODELS,
  estimateCost,
  estimateTokens,
} from "@/lib/tokens";
import { formatNumber, wordCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function AiTokenCalculator() {
  const [text, setText] = useState("");

  const chars = text.length;
  const words = wordCount(text);
  const maxTokens = useMemo(() => {
    const all = TOKEN_MODELS.map((m) => estimateTokens(text, m));
    return Math.max(0, ...all);
  }, [text]);

  return (
    <div className="space-y-6">
      <Textarea
        label="Your prompt or text"
        placeholder="Paste your prompt here to estimate token usage…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        hint="Estimates vary by model — characters ÷ chars-per-token."
      />
      <StatGrid>
        <Stat label="Characters" value={formatNumber(chars)} />
        <Stat label="Words" value={formatNumber(words)} />
        <Stat label="Est. tokens (avg)" value={formatNumber(Math.ceil(chars / 4))} accent="#8b5cf6" />
      </StatGrid>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Tokens by model
        </h3>
        <div className="mt-4 space-y-3">
          {TOKEN_MODELS.map((model) => {
            const tokens = estimateTokens(text, model);
            const pct = maxTokens ? (tokens / maxTokens) * 100 : 0;
            return (
              <div key={model.id} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {model.name}
                  </div>
                  <div className="text-[11px] text-zinc-400">{model.provider}</div>
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
                  {formatNumber(tokens)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function AiCostCalculator() {
  const [prompt, setPrompt] = useState("");
  const [outputChars, setOutputChars] = useState(500);
  const [modelId, setModelId] = useState("gpt-4o");

  const selected = useMemo(
    () => TOKEN_MODELS.find((m) => m.id === modelId) ?? TOKEN_MODELS[0],
    [modelId]
  );

  const inputTokens = estimateTokens(prompt, selected);
  const outputTokens = Math.round(outputChars / selected.charsPerToken);
  const cost = estimateCost(inputTokens, outputTokens, selected);

  return (
    <div className="space-y-6">
      <Textarea
        label="Prompt (input)"
        placeholder="Paste your prompt to count input tokens…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
      />
      <OptionRow>
        <Field label="Estimated output length (chars)">
          <TextInput
            type="number"
            min={0}
            value={outputChars}
            onChange={(e) => setOutputChars(Number(e.target.value) || 0)}
            className="w-32"
          />
        </Field>
        <Field label="Model" className="min-w-48">
          <Select value={modelId} onChange={(e) => setModelId(e.target.value)}>
            {TOKEN_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.provider}
              </option>
            ))}
          </Select>
        </Field>
      </OptionRow>

      <Card>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(inputTokens)}
            </div>
            <div className="text-xs text-zinc-500">Input tokens</div>
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatNumber(outputTokens)}
            </div>
            <div className="text-xs text-zinc-500">Output tokens</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ${cost.toFixed(6)}
            </div>
            <div className="text-xs text-zinc-500">Est. cost</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Cost across models
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs text-zinc-400 dark:border-zinc-800">
                <th className="pb-2 pr-4 font-medium">Model</th>
                <th className="pb-2 pr-4 font-medium">Provider</th>
                <th className="pb-2 pr-4 font-medium">Input $/1M</th>
                <th className="pb-2 pr-4 font-medium">Output $/1M</th>
                <th className="pb-2 text-right font-medium">Est. cost</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_MODELS.map((m) => {
                const inTokens = estimateTokens(prompt, m);
                const outTokens = Math.round(outputChars / m.charsPerToken);
                const c = estimateCost(inTokens, outTokens, m);
                return (
                  <tr
                    key={m.id}
                    className={cn(
                      "border-b border-zinc-100 last:border-0 dark:border-zinc-800",
                      m.id === selected.id && "bg-violet-50 dark:bg-violet-500/10"
                    )}
                  >
                    <td className="py-2 pr-4 font-medium text-zinc-800 dark:text-zinc-200">
                      {m.name}
                    </td>
                    <td className="py-2 pr-4 text-zinc-500">{m.provider}</td>
                    <td className="py-2 pr-4 tabular-nums text-zinc-500">
                      ${m.inputPerMillion.toFixed(3)}
                    </td>
                    <td className="py-2 pr-4 tabular-nums text-zinc-500">
                      ${m.outputPerMillion.toFixed(3)}
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                      ${c.toFixed(6)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <OutputArea
        value={`Prompt: ${formatNumber(inputTokens)} input tokens\nOutput: ${formatNumber(outputTokens)} tokens\nModel: ${selected.name} (${selected.provider})\nEst. cost: $${cost.toFixed(6)}`}
        label="Cost summary"
        filename="ai-cost.txt"
        rows={5}
      />
    </div>
  );
}
