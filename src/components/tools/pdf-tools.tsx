"use client";

import { useState } from "react";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import {
  Button,
  Card,
  Field,
  FilePicker,
  OptionRow,
  OutputArea,
  Select,
  Stat,
  StatGrid,
} from "@/components/ui";
import { downloadBlob } from "@/lib/download";

const PDFJS_VERSION = "4.10.38";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function baseName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  function addFiles(next: File[]) {
    setFiles((prev) => [...prev, ...next]);
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const to = index + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    setStatus("Merging…");
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save({ useObjectStreams: true });
      downloadBlob(new Blob([new Uint8Array(out)], { type: "application/pdf" }), "merged.pdf");
      setStatus(`Merged ${files.length} files → merged.pdf (${formatBytes(out.length)})`);
    } catch {
      setStatus("Failed to merge. Make sure every file is a valid PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker
        accept="application/pdf,.pdf"
        multiple
        label="Add PDFs"
        hint="Pick two or more PDFs in the order you want them merged."
        onChange={addFiles}
      />

      {files.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Files ({files.length})
          </h3>
          <ol className="space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="w-5 shrink-0 text-right font-mono text-xs text-zinc-400">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-zinc-800 dark:text-zinc-200">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-zinc-400">
                  {formatBytes(file.size)}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={i === files.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(i)}
                    aria-label="Remove file"
                  >
                    ✕
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={merge} disabled={files.length < 2 || busy}>
          {busy ? "Merging…" : "Merge PDFs"}
        </Button>
        {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
      </div>
    </div>
  );
}

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<"every" | "range">("every");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function pick(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus("Reading page count…");
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const count = pdf.getPageCount();
      setPages(count);
      setEnd(count);
      setStatus("");
    } catch {
      setStatus("That file is not a valid PDF.");
    }
  }

  async function split() {
    if (!file) return;
    setBusy(true);
    setStatus("Splitting…");
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      if (mode === "range") {
        const s = Math.max(1, Math.min(start, pages));
        const e = Math.min(pages, Math.max(s, end));
        const doc = await PDFDocument.create();
        const copies = await doc.copyPages(
          pdf,
          Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i)
        );
        copies.forEach((p) => doc.addPage(p));
        const out = await doc.save();
        downloadBlob(new Blob([new Uint8Array(out)], { type: "application/pdf" }), `${baseName(file.name)}-pages-${s}-${e}.pdf`);
        setStatus(`Extracted pages ${s}–${e} → ${formatBytes(out.length)}`);
      } else {
        const zip = new JSZip();
        for (let i = 0; i < pdf.getPageCount(); i++) {
          const doc = await PDFDocument.create();
          const [p] = await doc.copyPages(pdf, [i]);
          doc.addPage(p);
          zip.file(`page-${i + 1}.pdf`, await doc.save());
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${baseName(file.name)}-pages.zip`);
        setStatus(`Split ${pdf.getPageCount()} pages into a ZIP archive`);
      }
    } catch {
      setStatus("Failed to split this PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker accept="application/pdf,.pdf" label="Choose a PDF" onChange={pick} />

      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
            <Stat label="Pages" value={pages} accent="#f43f5e" />
          </StatGrid>

          <OptionRow>
            <Field label="Split mode" className="min-w-52 flex-1">
              <Select value={mode} onChange={(e) => setMode(e.target.value as "every" | "range")}>
                <option value="every">Split into separate pages</option>
                <option value="range">Extract a page range</option>
              </Select>
            </Field>
          </OptionRow>

          {mode === "range" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From page">
                <input
                  type="number"
                  min={1}
                  max={pages}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </Field>
              <Field label="To page">
                <input
                  type="number"
                  min={1}
                  max={pages}
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                  className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </Field>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={split} disabled={busy}>
              {busy ? "Working…" : mode === "every" ? "Split PDF" : "Extract range"}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [stripMeta, setStripMeta] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function compress() {
    if (!file) return;
    setBusy(true);
    setStatus("Optimizing…");
    try {
      const before = file.size;
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      if (stripMeta) {
        pdf.setTitle("");
        pdf.setAuthor("");
        pdf.setSubject("");
        pdf.setKeywords([]);
        pdf.setProducer("");
        pdf.setCreator("");
      }
      const out = await pdf.save({ useObjectStreams: true });
      const diff = before - out.length;
      const pct = before > 0 ? Math.max(0, Math.round((diff / before) * 100)) : 0;
      downloadBlob(new Blob([new Uint8Array(out)], { type: "application/pdf" }), `${baseName(file.name)}-compressed.pdf`);
      setStatus(`${formatBytes(before)} → ${formatBytes(out.length)} (${pct}% smaller)`);
    } catch {
      setStatus("Could not compress this PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker accept="application/pdf,.pdf" label="Choose a PDF" onChange={(f) => setFile(f[0] ?? null)} />

      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={stripMeta}
              onChange={(e) => setStripMeta(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
            Strip document metadata (author, title, keywords)
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={compress} disabled={busy}>
              {busy ? "Working…" : "Compress PDF"}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            This rewrites the PDF structure and removes bloat. Best results on
            PDFs with heavy metadata or redundant objects.
          </p>
        </>
      )}
    </div>
  );
}

const DOCX_CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const DOCX_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const DOCX_DOCUMENT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const DOCX_STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
  </w:style>
</w:styles>`;

const DOCX_CORE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Creator Toolkit</dc:creator>
  <cp:lastModifiedBy>Creator Toolkit</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-01-01T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-01-01T00:00:00Z</dcterms:modified>
</cp:coreProperties>`;

const DOCX_APP = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Creator Toolkit</Application>
</Properties>`;

function buildDocumentXml(paragraphs: string[]): string {
  const body = paragraphs
    .map(
      (p) =>
        `<w:p><w:r><w:t xml:space="preserve">${escapeXml(p)}</w:t></w:r></w:p>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

async function buildDocx(paragraphs: string[]): Promise<JSZip> {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", DOCX_CONTENT_TYPES);
  zip.file("_rels/.rels", DOCX_RELS);
  zip.file("word/document.xml", buildDocumentXml(paragraphs));
  zip.file("word/_rels/document.xml.rels", DOCX_DOCUMENT_RELS);
  zip.file("word/styles.xml", DOCX_STYLES);
  zip.file("docProps/core.xml", DOCX_CORE);
  zip.file("docProps/app.xml", DOCX_APP);
  return zip;
}

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState("");

  async function convert() {
    if (!file) return;
    setBusy(true);
    setStatus("Extracting text…");
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.worker.min.mjs`;
      const doc = await pdfjs.getDocument({ data }).promise;
      const paragraphs: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (text) paragraphs.push(text);
      }
      await doc.destroy();
      const joined = paragraphs.join("\n\n");
      setPreview(joined);
      if (!joined.trim()) {
        setStatus("No selectable text found — this PDF may be image-based.");
        return;
      }
      setStatus("Building Word document…");
      const zip = await buildDocx(paragraphs);
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${baseName(file.name)}.docx`);
      setStatus(`Converted ${paragraphs.length} paragraph${paragraphs.length === 1 ? "" : "s"} → ${baseName(file.name)}.docx`);
    } catch {
      setStatus("Failed to convert this PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker accept="application/pdf,.pdf" label="Choose a PDF" onChange={(f) => setFile(f[0] ?? null)} />

      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <div className="flex items-center gap-3">
            <Button onClick={convert} disabled={busy}>
              {busy ? "Working…" : "Convert to Word"}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
          {preview && (
            <Card>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Extracted text preview
              </h3>
              <p className="max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {preview.slice(0, 2000)}
              </p>
            </Card>
          )}
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Scanned or image-only PDFs have no selectable text and cannot be
            converted.
          </p>
        </>
      )}
    </div>
  );
}

const PRINT_STYLES = `<style>
  @page { size: auto; margin: 2cm; }
  body { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; color: #1a1a1a; max-width: 720px; margin: 0 auto; padding: 24px; }
  h1, h2, h3 { line-height: 1.3; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ccc; padding: 6px 8px; }
  img { max-width: 100%; height: auto; }
  ul, ol { padding-left: 24px; }
</style>`;

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [html, setHtml] = useState("");
  const [name, setName] = useState("");

  async function convert() {
    if (!file) return;
    setBusy(true);
    setStatus("Reading document…");
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      setHtml(result.value);
      setName(file.name.replace(/\.docx?$/i, ""));
      setStatus("Preview ready. Click Print / Save as PDF and choose the target printer.");
    } catch {
      setStatus("Could not read this Word document.");
    } finally {
      setBusy(false);
    }
  }

  function printToPdf() {
    const w = window.open("", "_blank", "width=900,height=720");
    if (!w) return;
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeXml(name)}</title>${PRINT_STYLES}</head><body>${html}</body></html>`
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  }

  return (
    <div className="space-y-6">
      <FilePicker
        accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        label="Choose a Word document"
        hint="Supports .docx and .doc files."
        onChange={(f) => setFile(f[0] ?? null)}
      />

      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <div className="flex items-center gap-3">
            <Button onClick={convert} disabled={busy}>
              {busy ? "Reading…" : "Read document"}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
          {html && (
            <>
              <Card>
                <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Preview
                </h3>
                <div
                  className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </Card>
              <Button onClick={printToPdf}>Print / Save as PDF</Button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function loadImageFile(file: File): Promise<HTMLImageElement> {
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

async function imageBytesForPdf(file: File): Promise<{ bytes: Uint8Array; type: "jpg" | "png" }> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return { bytes: new Uint8Array(await file.arrayBuffer()), type: "jpg" };
  }
  if (name.endsWith(".png")) {
    return { bytes: new Uint8Array(await file.arrayBuffer()), type: "png" };
  }
  const img = await loadImageFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encoding failed"))),
      "image/png"
    )
  );
  return { bytes: new Uint8Array(await blob.arrayBuffer()), type: "png" };
}

export function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "a4l" | "letter">("fit");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  function addFiles(next: File[]) {
    setFiles((prev) => [...prev, ...next]);
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const to = index + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }

  async function createPdf() {
    if (files.length === 0) return;
    setBusy(true);
    setStatus("Building PDF…");
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const { bytes, type } = await imageBytesForPdf(file);
        const img = type === "jpg" ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);
        const ratio = img.width / img.height;
        let width: number;
        let height: number;
        if (pageSize === "fit") {
          width = img.width;
          height = img.height;
        } else if (pageSize === "a4") {
          width = 595;
          height = 842;
        } else if (pageSize === "a4l") {
          width = 842;
          height = 595;
        } else {
          width = 612;
          height = 792;
        }
        if (pageSize !== "fit") {
          if (ratio > width / height) {
            height = width / ratio;
          } else {
            width = height * ratio;
          }
        }
        const page = pdf.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      const out = await pdf.save({ useObjectStreams: true });
      downloadBlob(new Blob([new Uint8Array(out)], { type: "application/pdf" }), "images.pdf");
      setStatus(`Created images.pdf with ${files.length} page${files.length === 1 ? "" : "s"} (${formatBytes(out.length)})`);
    } catch {
      setStatus("Could not convert these images. Only JPG and PNG are fully supported.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker
        accept="image/*"
        multiple
        label="Add images"
        hint="Pick JPG, PNG, WebP and more. Order them with the arrows below."
        onChange={addFiles}
      />

      {files.length > 0 && (
        <>
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Images ({files.length})
            </h3>
            <ol className="space-y-2">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-zinc-400">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-zinc-800 dark:text-zinc-200">
                    {file.name}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-400">{formatBytes(file.size)}</span>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                      ↑
                    </Button>
                    <Button variant="ghost" size="sm" disabled={i === files.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                      ↓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} aria-label="Remove image">
                      ✕
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <OptionRow>
            <Field label="Page size" className="min-w-52 flex-1">
              <Select value={pageSize} onChange={(e) => setPageSize(e.target.value as typeof pageSize)}>
                <option value="fit">Fit image size</option>
                <option value="a4">A4 portrait</option>
                <option value="a4l">A4 landscape</option>
                <option value="letter">Letter</option>
              </Select>
            </Field>
          </OptionRow>

          <div className="flex items-center gap-3">
            <Button onClick={createPdf} disabled={busy}>
              {busy ? "Creating…" : `Create PDF (${files.length})`}
            </Button>
            {status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

const OCR_LANGUAGES: { code: string; label: string }[] = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "nld", label: "Dutch" },
  { code: "ara", label: "Arabic" },
  { code: "hin", label: "Hindi" },
  { code: "jpn", label: "Japanese" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "kor", label: "Korean" },
];

export function OcrTool() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");

  async function run() {
    if (!file) return;
    setBusy(true);
    setText("");
    setProgress(0);
    setStatus("Preparing…");
    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    try {
      const pages: string[] = [];
      if (isPdf) {
        const data = new Uint8Array(await file.arrayBuffer());
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.worker.min.mjs`;
        const doc = await pdfjs.getDocument({ data }).promise;
        const pageCount = Math.min(doc.numPages, 5);
        for (let i = 1; i <= pageCount; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("No canvas context");
          await page.render({ canvasContext: ctx, viewport }).promise;
          setStatus(`Reading page ${i} of ${pageCount}…`);
          const blob = await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed"))), "image/png")
          );
          const result = await TesseractRecognize(blob, lang, (p) => setProgress(Math.round(p)));
          pages.push(result.trim());
        }
        await doc.destroy();
      } else {
        setStatus("Reading text…");
        const result = await TesseractRecognize(file, lang, (p) => setProgress(Math.round(p)));
        pages.push(result.trim());
      }
      const output = pages.map((p, i) => (pages.length > 1 ? `--- Page ${i + 1} ---\n${p}` : p)).join("\n\n");
      setText(output);
      setStatus(
        output.trim()
          ? `Extracted ${output.trim().split(/\s+/).length} words.`
          : "No text was detected. Try a sharper image or a different language."
      );
    } catch {
      setStatus("OCR failed. Make sure the image is clear and well-lit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FilePicker
        accept="image/*,.pdf"
        label="Choose an image or PDF"
        hint="Extract text from screenshots, scans, and photos. Images are processed in your browser."
        onChange={(f) => {
          setFile(f[0] ?? null);
          setText("");
          setStatus("");
        }}
      />

      {file && (
        <>
          <StatGrid>
            <Stat label="File" value={file.name} />
            <Stat label="Size" value={formatBytes(file.size)} />
          </StatGrid>
          <OptionRow>
            <Field label="Language" className="min-w-52 flex-1">
              <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                {OCR_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </Select>
            </Field>
          </OptionRow>
          {busy && (
            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-zinc-400">{status}</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={run} disabled={busy}>
              {busy ? "Working…" : "Extract text"}
            </Button>
            {!busy && status && <p className="text-sm text-zinc-500 dark:text-zinc-400">{status}</p>}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            PDFs are converted from the first 5 pages. The OCR engine (~15 MB) downloads on first use.
          </p>
          <OutputArea value={text} onChange={setText} filename="ocr-text.txt" rows={12} />
        </>
      )}
    </div>
  );
}

async function TesseractRecognize(
  image: Blob,
  lang: string,
  onProgress: (p: number) => void
): Promise<string> {
  const Tesseract = (await import("tesseract.js")).default;
  const result = await Tesseract.recognize(image, lang, {
    logger: (m: { status?: string; progress?: number }) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress(m.progress * 100);
      }
    },
  });
  return result.data.text;
}
