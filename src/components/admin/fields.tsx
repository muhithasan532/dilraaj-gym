"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, RefreshCw, X } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";
import { SmartImage } from "@/components/common/ui";
import { cn } from "@/lib/utils";
import type { FieldDef } from "@/lib/admin/config";
import type { MediaAssetMeta } from "@/types/content";

export interface MediaLibraryItem {
  id?: number;
  title: string;
  alt: string;
  category: string;
  mimeType: string;
  size: number;
  url: string;
  source: "upload" | "static";
}

/**
 * Loads the media library. `enabled` lets closed pickers (there is one per
 * image field) skip the request until they are actually opened.
 */
export function useMediaLibrary(enabled = true) {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/media", { cache: "no-store" });
      const data = (await response.json()) as { uploads?: MediaLibraryItem[]; staticImages?: MediaLibraryItem[] };
      setItems([...(data.uploads ?? []), ...(data.staticImages ?? [])]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) void load();
  }, [enabled]);

  return { items, loading, reload: load };
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const { notify } = useAdmin();
  const { items, loading, reload } = useMediaLibrary(open);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))).sort(), [items]);
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide">Select an image</h2>
            <p className="text-xs text-muted">Uploaded files and the bundled public/images assets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void reload()} className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-ink">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-line px-6 py-3">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn("rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]", filter === "all" ? "border-accent bg-accent text-white" : "border-line text-muted")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn("rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]", filter === category ? "border-accent bg-accent text-white" : "border-line text-muted")}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <label className="mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line px-6 py-8 text-center text-sm text-muted transition-colors hover:border-accent">
            <ImagePlus className="h-6 w-6 text-accent" />
            <span>{uploading ? "Uploading…" : "Upload a new image (max 6 MB)"}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={async (event) => {
                const input = event.target;
                const file = input.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const body = new FormData();
                  body.append("file", file);
                  body.append("title", file.name);
                  body.append("category", filter === "all" ? "general" : filter);
                  const response = await fetch("/api/media", { method: "POST", body });
                  const data = (await response.json()) as { asset?: MediaAssetMeta; error?: string };
                  if (!response.ok || !data.asset) {
                    notify(data.error ?? `Upload failed (${response.status}). Sign in again and retry.`);
                    return;
                  }
                  await reload();
                  notify(`${file.name} uploaded.`);
                  onSelect(data.asset.url);
                  onClose();
                } catch (error) {
                  notify((error as Error).message || "Upload failed. Check the connection and try again.");
                } finally {
                  // Allow re-selecting the same file straight after a failure.
                  input.value = "";
                  setUploading(false);
                }
              }}
            />
          </label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((item) => (
              <button
                key={item.url}
                type="button"
                onClick={() => {
                  onSelect(item.url);
                  onClose();
                }}
                className="group overflow-hidden rounded-xl border border-line text-left transition-colors hover:border-accent"
              >
                <SmartImage bare src={item.url} alt={item.alt || item.title} className="h-28 w-full object-cover" />
                <span className="block truncate px-3 py-2 text-[0.68rem] text-muted">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalizedInput({
  value,
  onChange,
  rows,
}: {
  value: { en: string; bn: string };
  onChange: (next: { en: string; bn: string }) => void;
  rows?: number;
}) {
  const shared = rows && rows > 1;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["en", "bn"] as const).map((locale) => (
        <label key={locale} className="block">
          <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {locale === "en" ? "English" : "বাংলা"}
          </span>
          {shared ? (
            <textarea
              value={value?.[locale] ?? ""}
              rows={rows}
              onChange={(event) => onChange({ ...(value ?? { en: "", bn: "" }), [locale]: event.target.value })}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          ) : (
            <input
              value={value?.[locale] ?? ""}
              onChange={(event) => onChange({ ...(value ?? { en: "", bn: "" }), [locale]: event.target.value })}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          )}
        </label>
      ))}
    </div>
  );
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const label = (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">{field.label}</span>
      {field.demo ? (
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-amber-500">
          demo content
        </span>
      ) : null}
    </div>
  );

  const wrapperClass = "rounded-xl border border-line bg-card/40 p-4";

  switch (field.type) {
    case "localized":
      return (
        <div className={wrapperClass}>
          {label}
          <LocalizedInput value={(value as { en: string; bn: string }) ?? { en: "", bn: "" }} onChange={onChange} />
        </div>
      );

    case "localizedText":
      return (
        <div className={wrapperClass}>
          {label}
          <LocalizedInput value={(value as { en: string; bn: string }) ?? { en: "", bn: "" }} onChange={onChange} rows={field.rows ?? 4} />
        </div>
      );

    case "textarea":
      return (
        <div className={wrapperClass}>
          {label}
          <textarea
            value={String(value ?? "")}
            rows={field.rows ?? 4}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      );

    case "boolean":
      return (
        <div className={wrapperClass}>
          <label className="flex items-center justify-between gap-4">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">{field.label}</span>
            <button
              type="button"
              onClick={() => onChange(!value)}
              className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", value ? "bg-accent" : "bg-muted/30")}
              aria-pressed={Boolean(value)}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", value ? "translate-x-5" : "translate-x-0.5")} />
            </button>
          </label>
          {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
        </div>
      );

    case "select":
      return (
        <div className={wrapperClass}>
          {label}
          <select
            value={String(value ?? "")}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <div className={wrapperClass}>
          {label}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={String(value ?? "#000000")}
              onChange={(event) => onChange(event.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-surface"
            />
            <input
              value={String(value ?? "")}
              onChange={(event) => onChange(event.target.value)}
              className="w-32 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-accent"
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className={wrapperClass}>
          {label}
          <div className="flex flex-wrap items-center gap-3">
            {value ? (
              <SmartImage bare src={String(value)} alt={field.label} className="h-16 w-24 rounded-lg border border-line object-cover" />
            ) : (
              <div className="grid h-16 w-24 place-items-center rounded-lg border border-dashed border-line text-[0.6rem] text-muted">none</div>
            )}
            <input
              value={String(value ?? "")}
              onChange={(event) => onChange(event.target.value)}
              placeholder="/images/..."
              className="min-w-[12rem] flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-accent"
            />
            <button type="button" onClick={() => setPickerOpen(true)} className="rounded-full border border-line px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted hover:border-accent hover:text-ink">
              Browse
            </button>
          </div>
          {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
          <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} />
        </div>
      );

    case "lines": {
      const list = Array.isArray(value) ? (value as { en: string; bn: string }[]) : [];
      const text = list.map((item) => `${item?.en ?? ""}|${item?.bn ?? ""}`).join("\n");
      return (
        <div className={wrapperClass}>
          {label}
          <textarea
            value={text}
            rows={field.rows ?? 6}
            onChange={(event) =>
              onChange(
                event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [en, bn] = line.split("|");
                    return { en: (en ?? "").trim(), bn: (bn ?? en ?? "").trim() };
                  }),
              )
            }
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-accent"
          />
          <p className="mt-2 text-xs text-muted">{field.help ?? "One feature per line. Use English|Bangla to fill both languages."}</p>
        </div>
      );
    }

    case "number":
      return (
        <div className={wrapperClass}>
          {label}
          <input
            type="number"
            value={Number(value ?? 0)}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-32 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      );

    default:
      return (
        <div className={wrapperClass}>
          {label}
          <input
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          {field.help ? <p className="mt-2 text-xs text-muted">{field.help}</p> : null}
        </div>
      );
  }
}
