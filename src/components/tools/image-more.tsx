"use client";

import { useMemo, useState } from "react";
import { Field, Select, Textarea } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

const LIGHT_TYPES = {
  golden: {
    label: "Golden hour",
    prompt: "golden hour lighting, warm soft sunlight, long shadows",
  },
  soft: {
    label: "Soft diffused",
    prompt: "soft diffused lighting, overcast sky, gentle even illumination",
  },
  studio: {
    label: "Studio strobes",
    prompt: "professional studio lighting, softbox key light, crisp highlights",
  },
  neon: {
    label: "Neon / cyberpunk",
    prompt: "neon lighting, cyan and magenta glow, reflective surfaces",
  },
  dramatic: {
    label: "Dramatic / chiaroscuro",
    prompt: "dramatic chiaroscuro lighting, strong contrast, deep shadows",
  },
  backlight: {
    label: "Backlight",
    prompt: "backlit silhouette, rim light, glowing outline",
  },
  candle: {
    label: "Candlelight",
    prompt: "warm candlelight, flickering amber glow, intimate mood",
  },
};

export function LightingPromptGenerator() {
  const [type, setType] = useState<keyof typeof LIGHT_TYPES>("golden");
  const [subject, setSubject] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const base = subject.trim() || "the subject";
    const light = LIGHT_TYPES[type].prompt;
    const intros = [
      `A photo of ${base}, ${light}, photorealistic, 8k`,
      `${light}, ${base}, captured on a 50mm lens, shallow depth of field`,
    ];
    return `${intros[Math.abs(seed) % 2]}`;
  }, [type, subject, seed]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Subject">
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. a portrait of a woman" className={INPUT_CLS} />
        </Field>
        <Field label="Lighting style">
          <Select value={type} onChange={(e) => setType(e.target.value as keyof typeof LIGHT_TYPES)}>
            {Object.entries(LIGHT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
      <OutputArea value={output} label="Lighting prompt" filename="lighting-prompt.txt" rows={4} />
    </div>
  );
}

const CAMERA_SETTINGS = [
  {
    label: "Portrait 50mm",
    prompt: "50mm f/1.8, ISO 200, 1/250s, shallow depth of field, eye-level angle",
  },
  {
    label: "Wide landscape 24mm",
    prompt: "24mm f/8, ISO 100, 1/125s, deep focus, high dynamic range",
  },
  {
    label: "Street 35mm",
    prompt: "35mm f/4, ISO 800, 1/500s, candid framing, natural perspective",
  },
  {
    label: "Macro 100mm",
    prompt: "100mm macro f/2.8, ISO 400, 1/200s, extreme close-up detail",
  },
  {
    label: "Telephoto 135mm",
    prompt: "135mm f/2, ISO 100, 1/1000s, compressed background, creamy bokeh",
  },
];

export function CameraSettingsGenerator() {
  const [subject, setSubject] = useState("");
  const [preset, setPreset] = useState(0);

  const output = useMemo(() => {
    const base = subject.trim() || "the scene";
    const cam = CAMERA_SETTINGS[preset];
    return `${base}, ${cam.prompt}`;
  }, [subject, preset]);

  return (
    <div className="space-y-6">
      <Field label="Subject or scene">
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. a car in the rain" className={INPUT_CLS} />
      </Field>
      <Field label="Camera preset">
        <Select value={preset} onChange={(e) => setPreset(Number(e.target.value))}>
          {CAMERA_SETTINGS.map((c, i) => (
            <option key={c.label} value={i}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>
      <OutputArea value={output} label="Camera prompt" filename="camera-prompt.txt" rows={3} />
      <div className="flex flex-wrap gap-2">
        {CAMERA_SETTINGS.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setPreset(i)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              i === preset
                ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LoraPromptGenerator() {
  const [style, setStyle] = useState("");
  const [trigger, setTrigger] = useState("trigger words");
  const [weight, setWeight] = useState(1);

  const output = useMemo(() => {
    const base = style.trim() || "my style";
    const triggerWords = trigger.trim() || "trigger words";
    const wrapped = weight !== 1 ? `((${triggerWords}))` : triggerWords;
    return `${base}, ${wrapped}, detailed, high quality`;
  }, [style, trigger, weight]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Style / subject">
          <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="e.g. anime portrait" className={INPUT_CLS} />
        </Field>
        <Field label="Trigger words">
          <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="e.g. pixelart style" className={INPUT_CLS} />
        </Field>
        <Field label={`LoRA weight: ${weight.toFixed(1)}`}>
          <input type="range" min={0.2} max={2} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-violet-600" />
        </Field>
      </div>
      <OutputArea value={output} label="LoRA prompt" filename="lora-prompt.txt" rows={3} />
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Weight 1.0 = neutral. Weights above 1.0 strengthen the LoRA; below 1.0 weaken it.
      </p>
    </div>
  );
}

const EXTENSIONS = [
  "intricate details, ultra detailed",
  "dramatic lighting, cinematic atmosphere",
  "masterpiece, best quality, 8k",
  "sharp focus, high contrast",
  "professional color grading, film grain",
  "smooth gradients, rich textures",
  "wide dynamic range, lifelike",
  "subtle reflections, ambient occlusion",
];

export function PromptExtender() {
  const [base, setBase] = useState("");
  const [seed, setSeed] = useState(1);

  const output = useMemo(() => {
    const core = base.trim();
    if (!core) return "";
    const extras = [...EXTENSIONS];
    const picked: string[] = [];
    let s = Math.abs(seed) || 1;
    for (let i = 0; i < 3 && extras.length; i++) {
      s = (s * 9301 + 49297) % 233280;
      const idx = s % extras.length;
      picked.push(extras.splice(idx, 1)[0]);
    }
    return `${core}, ${picked.join(", ")}`;
  }, [base, seed]);

  return (
    <div className="space-y-6">
      <Textarea label="Base prompt" value={base} onChange={(e) => setBase(e.target.value)} rows={4} placeholder="a red sports car parked in a neon-lit alley" />
      <Button onClick={() => setSeed((s) => s + 1)} disabled={!base.trim()}>Extend prompt</Button>
      <OutputArea value={output} label="Extended prompt" filename="extended-prompt.txt" rows={4} />
    </div>
  );
}
