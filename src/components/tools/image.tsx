"use client";

import { useMemo, useState } from "react";
import { Card, Field, OptionRow, Select, Stat, StatGrid, Textarea } from "@/components/ui";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  photorealistic:
    "ultra photorealistic, shot on a full-frame camera, 85mm lens, f/1.8, shallow depth of field, natural skin texture",
  cinematic:
    "cinematic film still, anamorphic lens, dramatic lighting, rich color grading, movie-quality composition",
  anime:
    "beautiful anime art style, Studio Ghibli inspired, cel shading, expressive eyes, vibrant color palette",
  "3d":
    "high-quality 3D render, octane render, soft global illumination, Pixar-style character design",
  digital:
    "detailed digital painting, intricate matte painting, concept art, high polish, fantasy art",
  watercolor:
    "delicate watercolor painting, soft color washes, textured paper grain, hand-painted feel",
  isometric:
    "clean isometric illustration, bold vector shapes, flat colors with subtle gradients, modern minimal",
  minimalist:
    "minimalist composition, negative space, clean lines, muted color palette, elegant simplicity",
};

const LIGHTING: Record<string, string> = {
  golden: "golden hour lighting, warm directional sunlight, long soft shadows",
  studio: "soft professional studio lighting, ring light catchlights, even exposure",
  dramatic: "dramatic chiaroscuro lighting, strong contrast, deep shadows",
  neon: "vibrant neon lighting, cyberpunk atmosphere, reflective surfaces",
  natural: "soft natural daylight, diffused window light, airy and bright",
  night: "moody night scene, moonlight, subtle rim lighting, atmospheric haze",
};

const QUALITIES = [
  "highly detailed, 8K, sharp focus, masterpiece",
  "professional, crisp details, best quality",
  "detailed, 4K, clean edges, high fidelity",
];

function buildPrompt(idea: string, style: string, lighting: string, quality: string) {
  return [idea.trim(), STYLES[style], LIGHTING[lighting], quality]
    .filter(Boolean)
    .join(", ");
}

export function ImagePromptEnhancer() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [lighting, setLighting] = useState("golden");
  const [quality, setQuality] = useState(QUALITIES[0]);

  const [prompt, setPrompt] = useState("");

  function handleIdeaChange(value: string) {
    setIdea(value);
    setPrompt(buildPrompt(value, style, lighting, quality));
  }

  function handleStyleChange(value: string) {
    setStyle(value);
    setPrompt(buildPrompt(idea, value, lighting, quality));
  }

  function handleLightingChange(value: string) {
    setLighting(value);
    setPrompt(buildPrompt(idea, style, value, quality));
  }

  function handleQualityChange(value: string) {
    setQuality(value);
    setPrompt(buildPrompt(idea, style, lighting, value));
  }

  return (
    <div className="space-y-6">
      <Textarea
        label="Your idea"
        placeholder="e.g. a fox reading a book in a forest"
        value={idea}
        onChange={(e) => handleIdeaChange(e.target.value)}
        rows={4}
      />
      <OptionRow>
        <Field label="Style" className="min-w-40">
          <Select value={style} onChange={(e) => handleStyleChange(e.target.value)}>
            {Object.keys(STYLES).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Lighting" className="min-w-40">
          <Select value={lighting} onChange={(e) => handleLightingChange(e.target.value)}>
            {Object.keys(LIGHTING).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quality" className="min-w-48">
          <Select value={quality} onChange={(e) => handleQualityChange(e.target.value)}>
            {QUALITIES.map((q) => (
              <option key={q} value={q}>
                {q.length > 40 ? q.slice(0, 40) + "…" : q}
              </option>
            ))}
          </Select>
        </Field>
      </OptionRow>
      <StatGrid>
        <Stat label="Prompt length" value={`${prompt.length} chars`} />
        <Stat label="Estimated tokens" value={Math.round(prompt.length / 4)} />
      </StatGrid>
      <OutputArea
        value={prompt}
        onChange={setPrompt}
        label="Enhanced prompt"
        filename="image-prompt.txt"
        rows={6}
      />
    </div>
  );
}

const STYLE_NEGATIVES: Record<string, string[]> = {
  portrait: [
    "deformed hands",
    "extra fingers",
    "distorted face",
    "bad anatomy",
    "crossed eyes",
  ],
  animal: ["malformed legs", "extra limbs", "deformed paws", "wrong anatomy"],
  landscape: ["oversaturated sky", "distorted horizon", "fused elements"],
  general: ["disfigured", "poorly drawn", "extra limbs", "body out of frame"],
};

const COMMON_NEGATIVES = [
  "blurry",
  "low quality",
  "low resolution",
  "jpeg artifacts",
  "watermark",
  "text",
  "signature",
  "logo",
  "duplicate",
  "morphed",
  "ugly",
  "deformed",
  "worst quality",
  "bad composition",
  "oversaturated",
  "cluttered background",
];

export function NegativePromptGenerator() {
  const [subject, setSubject] = useState("portrait");
  const [custom, setCustom] = useState("");

  const prompt = useMemo(() => {
    const extras = STYLE_NEGATIVES[subject] ?? STYLE_NEGATIVES.general;
    const all = [...COMMON_NEGATIVES, ...extras];
    if (custom.trim()) {
      all.push(
        ...custom
          .split(/[\n,]/)
          .map((c) => c.trim())
          .filter(Boolean)
      );
    }
    return all.join(", ");
  }, [subject, custom]);

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Subject type">
          <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {Object.keys(STYLE_NEGATIVES).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Custom negatives (optional)" className="min-w-48 flex-1">
          <input
            className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. busy background, red eyes"
          />
        </Field>
      </OptionRow>
      <OutputArea
        value={prompt}
        label="Negative prompt"
        filename="negative-prompt.txt"
        rows={6}
      />
    </div>
  );
}

const COMMON_RATIOS: { name: string; ratio: number }[] = [
  { name: "16:9", ratio: 16 / 9 },
  { name: "9:16", ratio: 9 / 16 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "3:4", ratio: 3 / 4 },
  { name: "3:2", ratio: 3 / 2 },
  { name: "2:3", ratio: 2 / 3 },
  { name: "1:1", ratio: 1 },
  { name: "21:9", ratio: 21 / 9 },
  { name: "5:4", ratio: 5 / 4 },
  { name: "4:5", ratio: 4 / 5 },
];

const PRESETS = [
  { label: "16:9", w: 1920, h: 1080 },
  { label: "9:16", w: 1080, h: 1920 },
  { label: "4:3", w: 1600, h: 1200 },
  { label: "1:1", w: 1080, h: 1080 },
  { label: "21:9", w: 3440, h: 1440 },
  { label: "3:2", w: 1500, h: 1000 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function AspectRatioCalculator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const result = useMemo(() => {
    const g = gcd(width, height);
    const simplified = `${width / g}:${height / g}`;
    const decimal = width / height;
    let nearest = COMMON_RATIOS[0];
    let diff = Math.abs(nearest.ratio - decimal);
    for (const r of COMMON_RATIOS) {
      const d = Math.abs(r.ratio - decimal);
      if (d < diff) {
        diff = d;
        nearest = r;
      }
    }
    return { simplified, decimal, nearest };
  }, [width, height]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setWidth(p.w);
              setHeight(p.h);
            }}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              width === p.w && height === p.h
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <OptionRow>
        <Field label="Width (px)">
          <input
            type="number"
            min={1}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 0)}
            className="h-9 w-32 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </Field>
        <Field label="Height (px)">
          <input
            type="number"
            min={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 0)}
            className="h-9 w-32 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </Field>
      </OptionRow>

      <Card>
        <div className="flex items-center justify-center gap-4">
          <div
            className="rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
            style={{ width: "100%", maxWidth: 320, aspectRatio: `${width} / ${height || 1}` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {result.simplified}
            </div>
            <div className="text-xs text-zinc-500">Simplified ratio</div>
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {result.decimal.toFixed(4)}
            </div>
            <div className="text-xs text-zinc-500">Decimal</div>
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {result.nearest.name}
            </div>
            <div className="text-xs text-zinc-500">Closest standard</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
