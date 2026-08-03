"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Field, OptionRow, Select, TextInput, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

interface PromptStyle {
  name: string;
  medium: string;
  fragment: string;
  example: string;
}

const PROMPT_STYLES: PromptStyle[] = [
  {
    name: "Photorealistic",
    medium: "Photography",
    fragment: "ultra photorealistic, shot on a full-frame camera, 85mm lens, f/1.8, shallow depth of field, natural skin texture, professional retouching",
    example: "a portrait of a woman in a sunlit cafe",
  },
  {
    name: "Cinematic",
    medium: "Film still",
    fragment: "cinematic film still, anamorphic lens, dramatic lighting, rich color grading, movie-quality composition, 35mm film grain",
    example: "a lone figure walking through rain-soaked neon streets",
  },
  {
    name: "Anime",
    medium: "Anime",
    fragment: "beautiful anime art style, Studio Ghibli inspired, cel shading, expressive eyes, vibrant color palette, detailed background",
    example: "a young girl flying a kite over a grassy hill",
  },
  {
    name: "3D Render",
    medium: "3D render",
    fragment: "high-quality 3D render, octane render, soft global illumination, Pixar-style character design, subsurface scattering",
    example: "a friendly robot tending a rooftop garden",
  },
  {
    name: "Digital Painting",
    medium: "Concept art",
    fragment: "detailed digital painting, intricate matte painting, concept art, high polish, fantasy art, rich textures",
    example: "an ancient floating city above the clouds",
  },
  {
    name: "Watercolor",
    medium: "Watercolor painting",
    fragment: "delicate watercolor painting, soft color washes, textured paper grain, hand-painted feel, gentle color bleed",
    example: "a cozy cabin in a snowy pine forest",
  },
  {
    name: "Isometric",
    medium: "Illustration",
    fragment: "clean isometric illustration, bold vector shapes, flat colors with subtle gradients, modern minimal, crisp edges",
    example: "a tiny workspace desk with plants and a laptop",
  },
  {
    name: "Minimalist",
    medium: "Design",
    fragment: "minimalist composition, negative space, clean lines, muted color palette, elegant simplicity, editorial design",
    example: "a single white vase on a beige pedestal",
  },
  {
    name: "Cyberpunk",
    medium: "Digital art",
    fragment: "cyberpunk aesthetic, neon lights, futuristic cityscape, holographic elements, high contrast, rainy reflective streets",
    example: "a cyber-enhanced courier on a neon-lit motorcycle",
  },
  {
    name: "Fantasy",
    medium: "Concept art",
    fragment: "epic fantasy concept art, sweeping vistas, magical atmosphere, painterly style, dramatic scale, luminous details",
    example: "a wizard standing before a glowing portal",
  },
  {
    name: "Sci-Fi",
    medium: "Concept art",
    fragment: "hard sci-fi concept art, futuristic technology, sleek design, spacecraft interior, volumetric lighting, cinematic scale",
    example: "a space station docking bay at golden hour",
  },
  {
    name: "Vintage",
    medium: "Film photography",
    fragment: "vintage film photograph, 1970s aesthetic, Kodak Portra, warm faded tones, soft grain, nostalgic mood",
    example: "a classic car at a roadside diner",
  },
  {
    name: "Low Poly",
    medium: "3D art",
    fragment: "low poly 3D art, faceted geometry, bright pastel colors, clean minimal shapes, stylized, soft shadows",
    example: "a low poly mountain range with a river",
  },
  {
    name: "Pixel Art",
    medium: "Pixel art",
    fragment: "detailed pixel art, 16-bit retro style, crisp pixels, vibrant limited palette, game sprite aesthetic",
    example: "a tiny village market in the evening",
  },
  {
    name: "Line Art",
    medium: "Illustration",
    fragment: "clean line art, bold black outlines, minimal shading, flat color fills, modern sticker style",
    example: "a fox with geometric patterns",
  },
  {
    name: "Surrealism",
    medium: "Surreal art",
    fragment: "surrealist composition, dreamlike atmosphere, impossible perspectives, melding organic forms, ethereal lighting",
    example: "an elephant with a floating island on its back",
  },
];

export function PromptStyleLibrary() {
  const [subject, setSubject] = useState("");
  const [selected, setSelected] = useState(0);

  const style = PROMPT_STYLES[selected];
  const prompt = useMemo(() => {
    const parts = [subject.trim(), style.fragment].filter(Boolean);
    return parts.join(", ");
  }, [subject, style]);

  return (
    <div className="space-y-6">
      <Field label="Subject (optional)">
        <TextInput
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={style.example}
        />
      </Field>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPT_STYLES.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              selected === i
                ? "border-amber-500 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/10"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            )}
          >
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {s.name}
            </span>
            <span className="block text-xs text-zinc-400">{s.medium}</span>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {s.fragment}
            </p>
          </button>
        ))}
      </div>
      <OutputArea
        value={prompt}
        label={`Prompt · ${style.name}`}
        filename={`prompt-${style.name.toLowerCase().replace(/\s+/g, "-")}.txt`}
        rows={6}
        placeholder="Generated prompt appears here…"
      />
    </div>
  );
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

type SchemeId = "analogous" | "complementary" | "triadic" | "monochromatic";

const SCHEMES: Record<SchemeId, string> = {
  analogous: "Analogous",
  complementary: "Complementary",
  triadic: "Triadic",
  monochromatic: "Monochromatic",
};

function buildPalette(hue: number, scheme: SchemeId): string[] {
  switch (scheme) {
    case "analogous":
      return [hue, hue + 30, hue - 30, hue + 60, hue - 60].map((h) =>
        hslToHex(h, 65, 55)
      );
    case "complementary":
      return [
        hue,
        hue + 180,
        hue + 30,
        hue + 210,
        hue + 180,
      ].map((h, i) => hslToHex(h, 60 + (i === 4 ? 15 : 0), 55));
    case "triadic":
      return [hue, hue + 120, hue + 240, hue + 60, hue + 180].map((h) =>
        hslToHex(h, 65, 55)
      );
    case "monochromatic":
      return [0, 1, 2, 3, 4].map((i) =>
        hslToHex(hue, 25 + i * 12, 30 + i * 14)
      );
  }
}

export function ColorPaletteGenerator() {
  const [hue, setHue] = useState(262);
  const [scheme, setScheme] = useState<SchemeId>("analogous");

  const palette = useMemo(() => buildPalette(hue, scheme), [hue, scheme]);

  function randomize() {
    setHue(Math.floor(Math.random() * 360));
  }

  const cssOutput = palette
    .map((c, i) => `  --color-${i + 1}: ${c};`)
    .join("\n");
  const downloadOutput = [
    `/* Creator Toolkit palette · ${SCHEMES[scheme]} */`,
    `:root {`,
    cssOutput,
    `}`,
  ].join("\n");

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Base hue">
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="h-9 w-56 accent-violet-600"
          />
        </Field>
        <Field label="Scheme">
          <Select value={scheme} onChange={(e) => setScheme(e.target.value as SchemeId)}>
            {Object.entries(SCHEMES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={randomize} variant="secondary" className="h-9">
          Shuffle
        </Button>
      </OptionRow>

      <div className="grid gap-3 sm:grid-cols-5">
        {palette.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => navigator.clipboard.writeText(color).catch(() => undefined)}
            className="group overflow-hidden rounded-xl border border-zinc-200 text-left dark:border-zinc-800"
            title="Click to copy"
          >
            <div className="h-24 w-full" style={{ backgroundColor: color }} />
            <div className="flex items-center justify-between bg-white px-3 py-2 dark:bg-zinc-900">
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {color}
              </span>
              <span className="text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
                Copy
              </span>
            </div>
          </button>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          CSS variables
        </h3>
        <div className="mt-3 flex items-center justify-end gap-2">
          <CopyButton text={downloadOutput} label="Copy CSS" />
        </div>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-6 text-emerald-400 dark:bg-black/40">
          {downloadOutput}
        </pre>
      </Card>
      <OutputArea value={palette.join(" ")} label="Hex codes (space separated)" filename="palette.txt" rows={3} />
    </div>
  );
}

const RANDOM_SUBJECTS = [
  "a fox reading a book in a forest",
  "a astronaut floating above a coral reef",
  "a tiny dragon warming itself by a campfire",
  "a barista serving coffee in a floating café",
  "a cat astronaut on the moon",
  "a lighthouse on a cliff during a storm",
  "a robot chef cooking in a cozy kitchen",
  "a samurai watching cherry blossoms fall",
  "a fox sleeping on a stack of old books",
  "a hot air balloon over lavender fields",
  "a street musician playing in neon rain",
  "a whale swimming through clouds",
];

const RANDOM_STYLES = PROMPT_STYLES.map((s) => s.fragment);

const RANDOM_LIGHTING = [
  "golden hour lighting",
  "soft studio lighting",
  "dramatic chiaroscuro lighting",
  "vibrant neon lighting",
  "soft natural daylight",
  "moody night scene with moonlight",
  "warm candlelight",
  "overcast diffused light",
];

const RANDOM_CAMERAS = [
  "shot on a full-frame camera, 85mm lens",
  "shot on a medium format camera, 50mm lens",
  "wide angle 24mm lens",
  "telephoto 200mm lens",
  "shot on 35mm film",
  "aerial drone shot",
];

const RANDOM_ARTISTS = [
  "inspired by studio Ghibli",
  "in the style of cinematic concept art",
  "reminiscent of classic Dutch masters",
  "inspired by modern impressionism",
  "in the style of retro sci-fi posters",
  "inspired by fashion editorial photography",
];

const RANDOM_QUALITY = [
  "highly detailed, 8K, sharp focus, masterpiece",
  "professional, crisp details, best quality",
  "detailed, 4K, clean edges, high fidelity",
];

export function PromptRandomizer() {
  const [prompts, setPrompts] = useState<string[]>([]);

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generate() {
    setPrompts(
      Array.from({ length: 3 }, () =>
        [
          pick(RANDOM_SUBJECTS),
          pick(RANDOM_STYLES),
          pick(RANDOM_LIGHTING),
          pick(RANDOM_CAMERAS),
          pick(RANDOM_ARTISTS),
          pick(RANDOM_QUALITY),
        ].join(", ")
      )
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Can&apos;t decide what to generate? Let chance assemble a complete
          prompt — subject, style, lighting, camera, artist and quality.
        </p>
        <div className="mt-4">
          <Button onClick={generate}>
            Randomize prompts
          </Button>
        </div>
      </Card>

      {prompts.length > 0 && (
        <div className="space-y-3">
          {prompts.map((p, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Prompt {i + 1}
                </span>
                <CopyButton text={p} />
              </div>
              <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">{p}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PromptHistory() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("ctk-prompt-history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ctk-prompt-history", JSON.stringify(history.slice(0, 50)));
    } catch {
      /* ignore */
    }
  }, [history]);

  function save() {
    const value = prompt.trim();
    if (!value) return;
    setHistory((prev) => [value, ...prev.filter((p) => p !== value)].slice(0, 50));
    setPrompt("");
  }

  function remove(index: number) {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  }

  const output = history.join("\n\n———\n\n");

  return (
    <div className="space-y-6">
      <Field label="Save a prompt">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Paste a prompt you want to keep…"
        />
      </Field>
      <Button onClick={save} disabled={!prompt.trim()}>
        Save prompt
      </Button>

      {history.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Saved prompts ({history.length})
            </h3>
            <div className="flex items-center gap-2">
              <CopyButton text={output} label="Copy all" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Clear all saved prompts?")) setHistory([]);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {history.map((p, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="whitespace-pre-line text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                  {p}
                </p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <CopyButton text={p} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(i)}
                    aria-label="Delete prompt"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
