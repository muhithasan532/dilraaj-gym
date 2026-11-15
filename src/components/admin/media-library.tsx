"use client";

import { useState } from "react";
import { RefreshCw, Trash2, Upload } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";
import { MediaPicker, useMediaLibrary, type MediaLibraryItem } from "@/components/admin/fields";
import { SmartImage } from "@/components/common/ui";
import { cn } from "@/lib/utils";

const CATEGORIES = ["hero", "brand", "about", "programs", "trainers", "transformations", "general"];

export function MediaLibraryPanel() {
  const { items, loading, reload } = useMediaLibrary();
  const { notify } = useAdmin();
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<MediaLibraryItem | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const uploads = items.filter((item) => item.source === "upload");
  const categories = Array.from(new Set(items.map((item) => item.category))).sort();
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);

  const upload = async (file: File, category: string) => {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("title", file.name);
      body.append("category", category);
      const response = await fetch("/api/media", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        notify(data.error ?? `Upload failed (${response.status}). Sign in again and retry.`);
        return;
      }
      notify(`${file.name} uploaded. Pick it in any image field to use it.`);
      await reload();
    } catch (error) {
      notify((error as Error).message || "Upload failed. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: MediaLibraryItem) => {
    if (item.source !== "upload" || !item.id) {
      notify("Bundled public images cannot be deleted from the demo library.");
      return;
    }
    if (!window.confirm("Delete this uploaded image? Any content still referencing it will need a new image.")) return;
    await fetch(`/api/media/${item.id}`, { method: "DELETE" });
    await reload();
    notify("Image deleted.");
  };

  const saveMeta = async (item: MediaLibraryItem) => {
    if (!item.id) return;
    await fetch(`/api/media/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: item.title, alt: item.alt, category: item.category }),
    });
    await reload();
    notify("Image details updated.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface/50 px-5 py-4">
        <p className="text-sm text-muted">
          {items.length} images · {uploads.length} uploaded · {items.length - uploads.length} bundled
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void reload()} className="rounded-full border border-line px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted hover:text-ink">
            <RefreshCw className={cn("mr-2 inline h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </button>
          <button type="button" onClick={() => setPickerOpen(true)} className="btn btn-primary px-4 py-2 text-[0.62rem]">
            <Upload className="h-3.5 w-3.5" /> Upload image
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition-colors",
              filter === category ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((item) => (
          <div key={item.url} className="overflow-hidden rounded-xl border border-line bg-surface/40">
            <button type="button" onClick={() => setPreview(item)} className="block w-full">
              <SmartImage bare src={item.url} alt={item.alt || item.title} className="h-32 w-full object-cover" />
            </button>
            <div className="space-y-2 p-3">
              <p className="truncate text-[0.7rem] font-medium text-ink" title={item.url}>{item.title}</p>
              <p className="truncate font-mono text-[0.6rem] text-muted" title={item.url}>{item.url}</p>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-line px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.12em] text-muted">
                  {item.source === "upload" ? "uploaded" : item.category}
                </span>
                <div className="flex gap-1">
                  {item.source === "upload" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const next = window.prompt("Image title", item.title);
                          if (next === null) return;
                          const alt = window.prompt("Alt text (accessibility)", item.alt) ?? item.alt;
                          void saveMeta({ ...item, title: next, alt });
                        }}
                        className="rounded-full border border-line px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.12em] text-muted hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(item)}
                        className="grid h-6 w-6 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent"
                        aria-label="Delete image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface/40 p-6 text-xs leading-relaxed text-muted">
        <p className="mb-2 font-semibold uppercase tracking-[0.16em] text-ink">How demo media storage works</p>
        Uploaded images are stored in the PostgreSQL demo database and served through <code>/api/media/&lt;id&gt;</code>,
        so they survive refreshes on this deployment. Bundled brand photos live in <code>public/images/</code> and can be
        referenced by path. In the Supabase version these same flows write to Supabase Storage and the{" "}
        <code>media_assets</code> table.
      </div>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-muted transition-colors hover:border-accent">
        <Upload className="h-6 w-6 text-accent" />
        <span>{busy ? "Uploading…" : "Drop an image here or click to upload"}</span>
        <span className="text-xs">Stored for this deployment · max 6 MB</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          onChange={(event) => {
            const input = event.target;
            const file = input.files?.[0];
            if (file) void upload(file, filter === "all" ? "general" : filter);
            input.value = "";
          }}
        />
      </label>

      <MediaPicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          void reload();
        }}
        onSelect={() => {
          setPickerOpen(false);
          void reload();
        }}
      />

      {preview ? (
        <div className="fixed inset-0 z-[80] grid place-items-center p-6" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface" onClick={(event) => event.stopPropagation()}>
            <SmartImage bare src={preview.url} alt={preview.alt || preview.title} className="max-h-[60vh] w-full object-contain" />
            <div className="space-y-3 p-5 text-xs text-muted">
              <p className="font-mono text-ink">{preview.url}</p>
              <p>Category: {preview.category} · {(preview.size / 1024).toFixed(0)} KB · {preview.mimeType}</p>
              <p>Alt text: {preview.alt || "—"}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={async () => {
                      await saveMeta({ ...preview, category });
                      setPreview(null);
                    }}
                    className="rounded-full border border-line px-3 py-1 text-[0.58rem] uppercase tracking-[0.12em] hover:border-accent hover:text-ink"
                  >
                    Set category: {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
