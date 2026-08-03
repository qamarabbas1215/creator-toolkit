"use client";

import { useState } from "react";
import JSZip from "jszip";
import {
  Button,
  Card,
  Field,
  FilePicker,
  OptionRow,
  Select,
  Stat,
  StatGrid,
  TextInput,
} from "@/components/ui";
import { downloadBlob } from "@/lib/download";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function stemName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot > 0 ? fileName.slice(0, dot) : fileName;
}

export function ZipCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function compress() {
    if (files.length === 0) return;
    setBusy(true);
    setStatus("Creating archive…");
    try {
      const zip = new JSZip();
      files.forEach((f) => zip.file(f.name, f));
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "archive.zip");
      setStatus(`Created archive.zip with ${files.length} file${files.length === 1 ? "" : "s"}`);
    } catch {
      setStatus("Failed to create the archive.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker multiple label="Add files to zip" onChange={setFiles} hint="Choose any files to bundle into a ZIP archive." />
      {files.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Files ({files.length})
          </h3>
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="min-w-0 truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-zinc-400">{formatBytes(f.size)}</span>
                <Button variant="ghost" size="sm" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <div className="flex items-center gap-3">
        <Button onClick={compress} disabled={files.length === 0 || busy}>
          {busy ? "Zipping…" : "Create ZIP"}
        </Button>
        {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
      </div>
    </div>
  );
}

export function FileCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function compress() {
    if (!file) return;
    setBusy(true);
    setStatus("Compressing…");
    try {
      const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
      const blob = await new Response(stream).blob();
      downloadBlob(blob, `${file.name}.gz`);
      setStatus(`${formatBytes(file.size)} → ${formatBytes(blob.size)} (${file.name}.gz)`);
    } catch {
      setStatus("Your browser does not support this compression method.");
    } finally {
      setBusy(false);
    }
  }

  async function decompress() {
    if (!file) return;
    setBusy(true);
    setStatus("Decompressing…");
    try {
      const stream = file.stream().pipeThrough(new DecompressionStream("gzip"));
      const blob = await new Response(stream).blob();
      const outName = file.name.endsWith(".gz") ? file.name.slice(0, -3) : `${stemName(file.name)}-extracted`;
      downloadBlob(blob, outName);
      setStatus(`Decompressed ${formatBytes(file.size)} → ${formatBytes(blob.size)} (${outName})`);
    } catch {
      setStatus("Could not decompress this file. Is it valid gzip?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker label="Choose a file" onChange={(f) => setFile(f[0] ?? null)} hint="Compress any file with gzip, or decompress a .gz file." />
      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={compress} disabled={busy}>{busy ? "Working…" : "Compress (gzip)"}</Button>
            <Button variant="secondary" onClick={decompress} disabled={busy}>{busy ? "Working…" : "Decompress"}</Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export function BulkRenamer() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"prefix" | "suffix" | "replace" | "pattern">("prefix");
  const [prefix, setPrefix] = useState("img_");
  const [suffix, setSuffix] = useState("_final");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [pattern, setPattern] = useState("photo_{i}");
  const [pad, setPad] = useState(false);
  const [status, setStatus] = useState("");

  function nextName(f: File, i: number): string {
    const stem = stemName(f.name);
    const dot = f.name.lastIndexOf(".");
    const ext = dot > 0 ? f.name.slice(dot + 1) : "";
    if (mode === "prefix") return `${prefix}${f.name}`;
    if (mode === "suffix") return `${stem}${suffix}.${ext}`;
    if (mode === "replace") return f.name.split(find).join(replace);
    let next = pattern
      .replace("{i}", String(i + 1).padStart(pad ? 2 : 1, "0"))
      .replace("{name}", stem)
      .replace("{ext}", ext);
    if (ext && !/\.[^.]+$/.test(next)) next = `${next}.${ext}`;
    return next;
  }

  async function rename() {
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      downloadBlob(files[i], nextName(files[i], i));
      if (i < files.length - 1) await new Promise((r) => setTimeout(r, 400));
    }
    setStatus(`Queued ${files.length} renamed download${files.length === 1 ? "" : "s"}. Allow multiple downloads if prompted.`);
  }

  return (
    <div className="space-y-6">
      <FilePicker multiple label="Add files" onChange={setFiles} hint="Rename copies of your files and download them with the new names." />
      {files.length > 0 && (
        <>
          <OptionRow>
            <Field label="Rename by" className="min-w-52 flex-1">
              <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                <option value="prefix">Add prefix</option>
                <option value="suffix">Add suffix</option>
                <option value="replace">Find & replace</option>
                <option value="pattern">Pattern</option>
              </Select>
            </Field>
          </OptionRow>

          {mode === "prefix" && (
            <Field label="Prefix">
              <TextInput value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </Field>
          )}
          {mode === "suffix" && (
            <Field label="Suffix (before extension)">
              <TextInput value={suffix} onChange={(e) => setSuffix(e.target.value)} />
            </Field>
          )}
          {mode === "replace" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Find">
                <TextInput value={find} onChange={(e) => setFind(e.target.value)} />
              </Field>
              <Field label="Replace with">
                <TextInput value={replace} onChange={(e) => setReplace(e.target.value)} />
              </Field>
            </div>
          )}
          {mode === "pattern" && (
            <>
              <Field label="Pattern">
                <TextInput value={pattern} onChange={(e) => setPattern(e.target.value)} />
              </Field>
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={pad}
                  onChange={(e) => setPad(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                />
                Pad numbers ({`{i}`} → 01, 02, …)
              </label>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Tokens: {`{i}`} index, {`{name}`} original name, {`{ext}`} extension.
              </p>
            </>
          )}

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Preview</h3>
            <ul className="space-y-1.5 text-sm">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  <span aria-hidden="true">→</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">{nextName(f, i)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex items-center gap-3">
            <Button onClick={rename} disabled={files.length === 0}>
              Rename {files.length} file{files.length === 1 ? "" : "s"}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

const IMAGE_TARGETS = {
  png: { label: "PNG", ext: "png", mime: "image/png" },
  jpeg: { label: "JPEG", ext: "jpg", mime: "image/jpeg" },
  webp: { label: "WebP", ext: "webp", mime: "image/webp" },
} as const;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed"))),
      mime,
      quality
    );
  });
}

export function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<keyof typeof IMAGE_TARGETS>("jpeg");
  const [quality, setQuality] = useState(0.85);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function convert() {
    if (files.length === 0) return;
    setBusy(true);
    setStatus("Converting…");
    const target = IMAGE_TARGETS[format];
    try {
      const results: { file: File; before: number }[] = [];
      for (const file of files) {
        const img = await loadImage(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No canvas context");
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(canvas, target.mime, format === "png" ? undefined : quality);
        results.push({
          file: new File([blob], `${stemName(file.name)}.${target.ext}`, { type: target.mime }),
          before: file.size,
        });
      }
      if (results.length === 1) {
        downloadBlob(results[0].file, results[0].file.name);
      } else {
        const zip = new JSZip();
        results.forEach((r) => zip.file(r.file.name, r.file));
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, "converted-images.zip");
      }
      const totalBefore = results.reduce((a, r) => a + r.before, 0);
      const totalAfter = results.reduce((a, r) => a + r.file.size, 0);
      setStatus(
        `Converted ${results.length} image${results.length === 1 ? "" : "s"} to ${target.label} (${formatBytes(totalBefore)} → ${formatBytes(totalAfter)})`
      );
    } catch {
      setStatus("One or more files could not be converted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker
        multiple
        accept="image/*"
        label="Add images"
        onChange={setFiles}
        hint="JPG, PNG, WebP, GIF and more. GIFs convert from the first frame."
      />
      {files.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <OptionRow>
              <Field label="Target format" className="min-w-44 flex-1">
                <Select value={format} onChange={(e) => setFormat(e.target.value as keyof typeof IMAGE_TARGETS)}>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </Select>
              </Field>
            </OptionRow>
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
              <input
                type="range"
                min={0.4}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={convert} disabled={busy}>
              {busy ? "Converting…" : `Convert ${files.length} file${files.length === 1 ? "" : "s"} to ${IMAGE_TARGETS[format].label}`}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

const VIDEO_FORMATS: Record<string, { label: string; ext: string; mime: string; args: string[] }> = {
  mp4: { label: "MP4 (H.264)", ext: "mp4", mime: "video/mp4", args: ["-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac"] },
  webm: { label: "WebM (VP9)", ext: "webm", mime: "video/webm", args: ["-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-c:a", "libopus"] },
  mov: { label: "MOV (H.264)", ext: "mov", mime: "video/quicktime", args: ["-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac"] },
  mkv: { label: "MKV (H.264)", ext: "mkv", mime: "video/x-matroska", args: ["-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac"] },
  gif: { label: "GIF (animated)", ext: "gif", mime: "image/gif", args: ["-vf", "fps=12,scale=480:-1:flags=lanczos"] },
  mp3: { label: "MP3 (audio only)", ext: "mp3", mime: "audio/mpeg", args: ["-vn", "-c:a", "libmp3lame", "-q:a", "2"] },
};

const AUDIO_FORMATS: Record<string, { label: string; ext: string; mime: string; args: string[] }> = {
  mp3: { label: "MP3", ext: "mp3", mime: "audio/mpeg", args: ["-c:a", "libmp3lame", "-q:a", "2"] },
  wav: { label: "WAV", ext: "wav", mime: "audio/wav", args: ["-c:a", "pcm_s16le"] },
  ogg: { label: "OGG (Vorbis)", ext: "ogg", mime: "audio/ogg", args: ["-c:a", "libvorbis", "-q:a", "5"] },
  m4a: { label: "M4A (AAC)", ext: "m4a", mime: "audio/mp4", args: ["-c:a", "aac", "-b:a", "192k"] },
  flac: { label: "FLAC", ext: "flac", mime: "audio/flac", args: ["-c:a", "flac"] },
  aac: { label: "AAC", ext: "aac", mime: "audio/aac", args: ["-c:a", "aac", "-b:a", "192k"] },
};

let ffmpegReady: Promise<{ ffmpeg: unknown; fetchFile: (file: Blob) => Promise<Uint8Array> }> | null = null;

async function getFFmpeg() {
  if (!ffmpegReady) {
    ffmpegReady = (async () => {
      const [{ FFmpeg }, { toBlobURL, fetchFile }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);
      const ffmpeg = new FFmpeg();
      const base = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return { ffmpeg, fetchFile };
    })();
  }
  return ffmpegReady;
}

async function ffmpegConvert(
  input: File,
  args: string[],
  outputName: string,
  onProgress: (p: number) => void
): Promise<Uint8Array<ArrayBuffer>> {
  const { ffmpeg, fetchFile } = await getFFmpeg();
  const inputName = `in_${Date.now().toString(36)}`;
  const handler = ({ progress }: { progress: number }) =>
    onProgress(Math.min(99, Math.round(progress * 100)));
  (ffmpeg as { on: (event: string, cb: (data: { progress: number }) => void) => void }).on("progress", handler);
  try {
    await (ffmpeg as { writeFile: (name: string, data: Uint8Array) => Promise<void> }).writeFile(
      inputName,
      await fetchFile(input)
    );
    await (ffmpeg as { exec: (args: string[]) => Promise<void> }).exec(["-i", inputName, ...args, outputName]);
    const data = new Uint8Array(
      (await (ffmpeg as { readFile: (name: string) => Promise<Uint8Array> }).readFile(outputName))
    );
    await (ffmpeg as { deleteFile: (name: string) => Promise<void> }).deleteFile(inputName).catch(() => undefined);
    await (ffmpeg as { deleteFile: (name: string) => Promise<void> }).deleteFile(outputName).catch(() => undefined);
    return data;
  } finally {
    (ffmpeg as { off: (event: string, cb: (data: { progress: number }) => void) => void }).off("progress", handler);
  }
}

function useConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  return { file, setFile, busy, setBusy, status, setStatus, progress, setProgress };
}

function ConverterPanel({
  title,
  accept,
  formats,
  defaultFormat,
  onChange,
}: {
  title: string;
  accept: string;
  formats: Record<string, { label: string; ext: string; mime: string; args: string[] }>;
  defaultFormat: string;
  onChange?: (
    file: File,
    target: (typeof formats)[string],
    onProgress: (p: number) => void
  ) => Promise<void>;
}) {
  const { file, setFile, busy, setBusy, status, setStatus, progress, setProgress } = useConverter();
  const [format, setFormat] = useState(defaultFormat);

  async function run() {
    if (!file || !onChange) return;
    setBusy(true);
    setProgress(0);
    setStatus("Loading converter engine…");
    try {
      await onChange(file, formats[format], setProgress);
      setProgress(100);
      setStatus(`Converted to ${formats[format].label}`);
    } catch {
      setStatus("Conversion failed. The format may not be supported by the browser engine.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker accept={accept} label={`Choose a ${title.toLowerCase()} file`} onChange={(f) => setFile(f[0] ?? null)} />
      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <OptionRow>
            <Field label="Target format" className="min-w-44 flex-1">
              <Select value={format} onChange={(e) => setFormat(e.target.value)}>
                {Object.entries(formats).map(([key, f]) => (
                  <option key={key} value={key}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </Field>
          </OptionRow>
          {busy && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={run} disabled={busy}>
              {busy ? "Converting…" : `Convert to ${formats[format].label}`}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Runs entirely in your browser with WebAssembly. Large files take longer; the first conversion downloads the engine (~30 MB).
          </p>
        </>
      )}
    </div>
  );
}

export function VideoConverter() {
  return (
    <ConverterPanel
      title="Video"
      accept="video/*,.mkv,.mov,.avi,.webm,.mp4"
      formats={VIDEO_FORMATS}
      defaultFormat="mp4"
      onChange={async (file, target, onProgress) => {
        const data = await ffmpegConvert(file, target.args, `out.${target.ext}`, onProgress);
        downloadBlob(new Blob([data], { type: target.mime }), `${stemName(file.name)}.${target.ext}`);
      }}
    />
  );
}

export function AudioConverter() {
  return (
    <ConverterPanel
      title="Audio"
      accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac,.opus"
      formats={AUDIO_FORMATS}
      defaultFormat="mp3"
      onChange={async (file, target, onProgress) => {
        const data = await ffmpegConvert(file, target.args, `out.${target.ext}`, onProgress);
        downloadBlob(new Blob([data], { type: target.mime }), `${stemName(file.name)}.${target.ext}`);
      }}
    />
  );
}
