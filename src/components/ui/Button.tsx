import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-sm shadow-violet-600/20 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-600/30 focus-visible:ring-violet-500 active:from-violet-700 active:to-violet-800",
  secondary:
    "bg-white text-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-zinc-400 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
  danger:
    "bg-gradient-to-b from-red-600 to-red-700 text-white shadow-sm shadow-red-600/20 hover:from-red-500 hover:to-red-600 focus-visible:ring-red-500 active:from-red-700 active:to-red-800",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
