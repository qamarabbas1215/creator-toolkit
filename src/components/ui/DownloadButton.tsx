"use client";

import { downloadText } from "@/lib/download";
import { DownloadIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export function DownloadButton({
  text,
  filename,
  label = "Download",
}: {
  text: string;
  filename: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => downloadText(filename, text)}
    >
      <DownloadIcon width={14} height={14} />
      {label}
    </Button>
  );
}
