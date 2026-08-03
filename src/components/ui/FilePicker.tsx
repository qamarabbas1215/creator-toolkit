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
        className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition-colors hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-violet-500 dark:hover:bg-violet-950/30"
      >
        <span className="text-2xl">📂</span>
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
