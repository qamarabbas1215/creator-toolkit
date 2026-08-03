"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface FilePickerProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onChange: (files: File[]) => void;
  className?: string;
}

export function FilePicker({
  accept,
  multiple,
  label,
  hint,
  onChange,
  className,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-b from-zinc-50 to-white px-4 py-8 text-center transition-all duration-150 hover:border-violet-400 hover:from-violet-50 hover:to-white dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950 dark:hover:border-violet-500 dark:hover:from-violet-950/30 dark:hover:to-zinc-950"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg transition-colors group-hover:bg-violet-100 dark:bg-zinc-800 dark:group-hover:bg-violet-500/20">
          📂
        </span>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Click to choose {multiple ? "files" : "a file"}
        </span>
        {hint && <span className="text-xs text-zinc-400">{hint}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onChange(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
