"use client";

import { useState } from "react";
import { copyText } from "@/lib/download";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function CopyButton({
  text,
  className,
  label = "Copy",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={cn(copied && "text-emerald-600 dark:text-emerald-400", className)}
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      {copied ? "Copied!" : label}
    </Button>
  );
}
