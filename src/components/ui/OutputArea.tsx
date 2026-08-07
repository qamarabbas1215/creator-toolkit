"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { SaveProjectButton } from "@/components/ui/SaveProjectButton";

export function OutputArea({
  value,
  onChange,
  label = "Output",
  filename = "output.txt",
  placeholder = "Results appear here…",
  rows = 12,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  filename?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const editable = Boolean(onChange);
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <SaveProjectButton value={value} filename={filename} />
          <CopyButton text={value} />
          <DownloadButton text={value} filename={filename} />
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!editable}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-6 text-zinc-900 shadow-sm transition-colors duration-150 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600",
          !value && "text-zinc-400 dark:text-zinc-600"
        )}
      />
    </div>
  );
}
