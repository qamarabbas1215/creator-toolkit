import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-6 text-zinc-900 shadow-sm transition-colors duration-150 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
