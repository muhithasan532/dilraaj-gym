"use client";

import { useRef } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";

export function BackupPanel() {
  const { content, replace, save, resetToDefaults, notify } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dilraaj-content-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify("Content exported as JSON.");
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as typeof content;
      if (!parsed || typeof parsed !== "object" || !parsed.pages) throw new Error("Unrecognised file");
      replace(parsed);
      notify("Imported. Review the values, then press Save changes to persist.");
    } catch (error) {
      notify((error as Error).message || "Import failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <button type="button" onClick={exportJson} className="rounded-2xl border border-line bg-surface/50 p-6 text-left transition-colors hover:border-accent">
          <Download className="h-5 w-5 text-accent" />
          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.16em]">Export JSON</p>
          <p className="mt-2 text-xs text-muted">Download the full content document — settings, pages and collections.</p>
        </button>

        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-2xl border border-line bg-surface/50 p-6 text-left transition-colors hover:border-accent">
          <Upload className="h-5 w-5 text-accent" />
          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.16em]">Import JSON</p>
          <p className="mt-2 text-xs text-muted">Restore a previously exported content file. Nothing is written until you save.</p>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!window.confirm("Reset all demo content to the shipped defaults? Unsaved edits will be lost.")) return;
            resetToDefaults();
          }}
          className="rounded-2xl border border-accent/40 bg-accent/10 p-6 text-left transition-colors hover:border-accent"
        >
          <RotateCcw className="h-5 w-5 text-accent" />
          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.16em]">Reset demo content</p>
          <p className="mt-2 text-xs text-muted">Restore every field to the original illustrative demo values.</p>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void importJson(file);
        }}
      />

      <div className="rounded-2xl border border-line bg-surface/40 p-6 text-xs leading-relaxed text-muted">
        <p className="mb-2 font-semibold uppercase tracking-[0.16em] text-ink">What is included</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Website settings, header, footer, WhatsApp and theme configuration</li>
          <li>Every page section, SEO entry and collection record</li>
          <li>Image <em>paths</em> (not the binary files themselves)</li>
        </ul>
        <p className="mt-3">
          Uploaded images live in the media database, so an exported JSON file references them by URL. Keep a copy of any
          files you upload if you plan to move to another environment. In the Supabase version, use a storage export
          alongside this JSON backup.
        </p>
      </div>

      <button type="button" onClick={() => void save()} className="btn btn-primary">
        Save restored content
      </button>
    </div>
  );
}
