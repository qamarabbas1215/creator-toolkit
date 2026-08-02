"use client";

import { useMemo, useState } from "react";
import {
  Card,
  Field,
  OptionRow,
  Select,
  TextInput,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { OutputArea } from "@/components/ui/OutputArea";
import { cn } from "@/lib/utils";

const PLATFORMS: Record<
  string,
  { label: string; max: number; icon: string }
> = {
  all: { label: "All platforms", max: 20, icon: "🌐" },
  instagram: { label: "Instagram", max: 30, icon: "📸" },
  tiktok: { label: "TikTok", max: 8, icon: "🎵" },
  youtube: { label: "YouTube", max: 5, icon: "▶️" },
  x: { label: "X / Twitter", max: 3, icon: "🐦" },
  linkedin: { label: "LinkedIn", max: 5, icon: "💼" },
  facebook: { label: "Facebook", max: 5, icon: "📘" },
  threads: { label: "Threads", max: 30, icon: "🧵" },
};

const VIRAL_TAGS = [
  "viral",
  "trending",
  "explore",
  "reels",
  "shorts",
  "fyp",
  "foryou",
  "contentcreator",
  "creator",
  "instagood",
  "mustwatch",
];

const MODIFIERS = [
  "",
  "tips",
  "ideas",
  "inspo",
  "community",
  "life",
  "love",
  "goals",
  "content",
  "creator",
  "2026",
  "oftheday",
  "hacks",
  "motivation",
  "madeeasy",
  "tutorial",
  "tipsandtricks",
  "guide",
  "essentials",
  "daily",
];

function cleanTag(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildPool(keywords: string[]): string[] {
  const pool = new Set<string>();
  for (const kw of keywords) {
    const base = cleanTag(kw);
    if (!base) continue;
    for (const mod of MODIFIERS) {
      pool.add(mod ? `#${base}${mod}` : `#${base}`);
    }
  }
  for (const v of VIRAL_TAGS) pool.add(`#${v}`);
  return [...pool];
}

export function HashtagGenerator() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [generated, setGenerated] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const max = PLATFORMS[platform].max;

  function generate() {
    const keywords = text
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    const pool = buildPool(keywords);
    const tags = pool.slice(0, Math.max(max, 15));
    setGenerated(tags);
    setSelected(new Set(tags));
  }

  const selectedList = useMemo(
    () => generated.filter((t) => selected.has(t)),
    [generated, selected]
  );
  const output = selectedList.join(" ");

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Niche / keywords" className="min-w-52 flex-1">
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. fitness, workout, home gym"
          />
        </Field>
        <Field label="Platform">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {Object.entries(PLATFORMS).map(([id, p]) => (
              <option key={id} value={id}>
                {p.icon} {p.label} (max {p.max})
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={generate} disabled={!text.trim()} className="h-9">
          Generate
        </Button>
      </OptionRow>

      {generated.length > 0 && (
        <>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Tap to select hashtags
              </h3>
              <span className="text-xs text-zinc-400">
                {selectedList.length} / {max} recommended
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {generated.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggle(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected.has(tag)
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </Card>
          <OutputArea
            value={output}
            onChange={(v) => {
              setSelected(new Set(v.split(/\s+/).filter(Boolean)));
            }}
            label={`Selected hashtags (${selectedList.length})`}
            filename="hashtags.txt"
            rows={4}
          />
        </>
      )}
    </div>
  );
}

function generateBios(name: string, role: string, extra: string): string[] {
  const n = name.trim();
  const r = role.trim();
  const e = extra.trim();
  const bios: string[] = [];

  if (n && r) {
    bios.push(
      `${n} — ${r}${e ? ` helping creators like you ${e}` : ""}. Let's build something great together. 🚀`
    );
  }
  bios.push(
    `${r ? `${cap(r)}` : "Creator"} by day, ${e || "dreamer"} by night. Sharing what I learn so you don't have to. ✨`
  );
  bios.push(
    `${n || "I"} help brands & creators ${e ? e : "grow and connect"} through ${r.toLowerCase() || "great content"}. DM for collabs! 📩`
  );
  bios.push(
    `${r ? cap(r) : "Creator"} • ${e ? e + " • " : ""}Making the internet a little more interesting, one post at a time.`
  );
  bios.push(
    n
      ? `${n} ✦ ${r.toLowerCase() || "creator"} ✦ ${e ? e + " ✦ " : ""}New content weekly 👇`
      : `Creator ✦ ${e ? e + " ✦ " : ""}New content weekly 👇`
  );
  return bios.filter((b) => b.length <= 160).slice(0, 4);
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function BioGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [extra, setExtra] = useState("");
  const [bios, setBios] = useState<string[]>([]);

  function generate() {
    if (!name && !role && !extra) return;
    setBios(generateBios(name, role, extra));
  }

  return (
    <div className="space-y-6">
      <OptionRow>
        <Field label="Name (optional)" className="min-w-36 flex-1">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
          />
        </Field>
        <Field label="Role / niche" className="min-w-36 flex-1">
          <TextInput
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. travel blogger"
          />
        </Field>
        <Button onClick={generate} className="h-9">
          Generate bios
        </Button>
      </OptionRow>
      <Field label="What do you help with? (optional)">
        <TextInput
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="e.g. find cheap flights"
        />
      </Field>

      {bios.length > 0 && (
        <div className="space-y-2">
          {bios.map((bio, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm leading-6 text-zinc-900 dark:text-zinc-100">
                {bio}
              </p>
              <CopyButton text={bio} className="shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
