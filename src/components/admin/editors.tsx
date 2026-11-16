"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";
import { FieldRenderer } from "@/components/admin/fields";
import { SmartImage } from "@/components/common/ui";
import type { CollectionConfig, FieldDef, FieldGroup, FieldType } from "@/lib/admin/config";
import { clone, getByPath, newId, setInPlace } from "@/lib/admin/path";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types/content";

export function SettingsEditor({ path, groups }: { path: string; groups: FieldGroup[] }) {
  const { content, update } = useAdmin();
  const target = getByPath(content, path) as Record<string, unknown> | undefined;
  if (!target) return <p className="text-sm text-muted">Settings path not found: {path}</p>;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <fieldset key={group.title} className="rounded-2xl border border-line bg-surface/40 p-6">
          <legend className="px-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            {group.title}
          </legend>
          {group.description ? <p className="mb-5 text-xs text-muted">{group.description}</p> : null}
          <div className="space-y-4">
            {group.fields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={getByPath(target, field.key)}
                onChange={(next) =>
                  update((draft) => {
                    setInPlace(getByPath(draft, path), field.key, next);
                  })
                }
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function CollectionEditor({ config }: { config: CollectionConfig }) {
  const { content, update, notify } = useAdmin();
  const [openId, setOpenId] = useState<string | null>(null);
  const items = (content.collections[config.key] ?? []) as unknown as Record<string, unknown>[];

  const addItem = () => {
    const defaults = config.defaults() as Record<string, unknown>;
    defaults.id = newId(config.key.slice(0, 2));
    update((draft) => {
      (draft.collections[config.key] as unknown as Record<string, unknown>[]).push(defaults);
    });
    setOpenId(String(defaults.id));
    notify(`${config.singular} added`);
  };

  const patchItem = (index: number, key: string, value: unknown) => {
    update((draft) => {
      const list = draft.collections[config.key] as unknown as Record<string, unknown>[];
      setInPlace(list[index], key, value);
    });
  };

  const removeItem = (index: number) => {
    if (!window.confirm(`Delete this ${config.singular.toLowerCase()}? This cannot be undone until you save.`)) return;
    update((draft) => {
      const list = draft.collections[config.key] as unknown as Record<string, unknown>[];
      list.splice(index, 1);
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    update((draft) => {
      const list = draft.collections[config.key] as unknown as Record<string, unknown>[];
      const target = index + direction;
      if (target < 0 || target >= list.length) return;
      [list[index], list[target]] = [list[target], list[index]];
      list.forEach((item, i) => {
        item.order = i + 1;
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface/50 px-5 py-4">
        <p className="text-sm text-muted">
          {items.length} {items.length === 1 ? config.singular.toLowerCase() : `${config.singular.toLowerCase()}s`} · reorder, edit or publish
        </p>
        <button type="button" onClick={addItem} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Add {config.singular}
        </button>
      </div>

      {items.map((item, index) => {
        const id = String(item.id ?? index);
        const open = openId === id;
        const title = getByPath(item, "title.en") ?? getByPath(item, "name.en") ?? getByPath(item, "question.en") ?? getByPath(item, "storyTitle.en") ?? getByPath(item, "day.en") ?? config.singular;
        const meta = getByPath(item, "category.en") ?? getByPath(item, "position.en") ?? getByPath(item, "time") ?? "";

        return (
          <div key={id} className="overflow-hidden rounded-2xl border border-line bg-surface/40">
            <div className="flex items-center gap-3 px-5 py-4">
              <GripVertical className="h-4 w-4 text-muted/50" />
              <button type="button" onClick={() => setOpenId(open ? null : id)} className="flex flex-1 items-center gap-4 text-left">
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-card">
                  {item.image || item.beforeImage ? (
                    <SmartImage bare src={String(item.image ?? item.beforeImage ?? "")} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-xs text-muted">{index + 1}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{String(title)}</span>
                  <span className="block truncate text-xs text-muted">{String(meta)}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => patchItem(index, "published", !item.published)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em]",
                  item.published ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : "border-line text-muted",
                )}
              >
                {item.published ? "Live" : "Draft"}
              </button>

              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(index, -1)} aria-label="Move up" className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted hover:text-ink">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} aria-label="Move down" className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted hover:text-ink">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => removeItem(index)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {open ? (
              <div className="space-y-4 border-t border-line p-5">
                {config.fields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={getByPath(item, field.key)}
                    onChange={(next) => patchItem(index, field.key, next)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

interface PageEditorProps {
  pageKey: string;
  title: string;
  description: string;
  sectionGroups: (sectionKey: string) => FieldGroup[];
  additionalGroups?: (pageKey: string) => FieldGroup[];
}

const ITEM_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "localized" },
  { key: "body", label: "Description", type: "localizedText", rows: 3 },
  { key: "meta", label: "Meta label", type: "localized" },
  { key: "value", label: "Stat value", type: "text" },
  { key: "image", label: "Image", type: "image" },
  { key: "href", label: "Link", type: "text" },
];

function SectionItemsEditor({
  items,
  onChange,
}: {
  items: Record<string, unknown>[];
  onChange: (next: unknown) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const patch = (index: number, key: string, value: unknown) => {
    const next = clone(items);
    setInPlace(next[index], key, value);
    onChange(next);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = clone(items);
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    if (!window.confirm("Remove this item?")) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    const next = clone(items);
    next.push({ id: newId("item"), title: { en: "New item", bn: "নতুন আইটেম" }, body: { en: "", bn: "" } });
    onChange(next);
    setOpenIndex(next.length - 1);
  };

  return (
    <fieldset className="rounded-xl border border-line p-4">
      <legend className="px-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">Items</legend>
      <div className="space-y-3">
        {items.map((item, index) => {
          const open = openIndex === index;
          const title = getByPath(item, "title.en") ?? getByPath(item, "value") ?? `Item ${index + 1}`;
          return (
            <div key={String(item.id ?? index)} className="rounded-lg border border-line bg-card/40">
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" onClick={() => setOpenIndex(open ? null : index)} className="flex-1 truncate text-left text-xs text-ink">
                  {String(title)}
                </button>
                <button type="button" onClick={() => move(index, -1)} className="text-muted hover:text-ink" aria-label="Move up">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="text-muted hover:text-ink" aria-label="Move down">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(index)} className="text-muted hover:text-accent" aria-label="Remove item">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {open ? (
                <div className="space-y-3 border-t border-line p-3">
                  {ITEM_FIELDS.map((field) => (
                    <FieldRenderer key={field.key} field={field} value={getByPath(item, field.key)} onChange={(next) => patch(index, field.key, next)} />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={add} className="btn btn-outline w-full py-2 text-[0.62rem]">
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
    </fieldset>
  );
}

export function PageEditor({ pageKey, title, description, sectionGroups }: PageEditorProps) {
  const { content, update } = useAdmin();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const page = content.pages[pageKey];

  if (!page) return <p className="text-sm text-muted">Page not found: {pageKey}</p>;

  const sections = Object.values(page.sections).sort((a, b) => a.order - b.order);

  const patchSection = (sectionKey: string, key: string, value: unknown) => {
    update((draft) => {
      setInPlace(draft.pages[pageKey].sections[sectionKey], key, value);
    });
  };

  const patchSeo = (key: string, value: unknown) => {
    update((draft) => {
      setInPlace(draft.pages[pageKey].seo, key, value);
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line bg-surface/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide">{title}</h2>
            <p className="mt-1 text-xs text-muted">{description}</p>
          </div>
          <label className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Published
            <button
              type="button"
              onClick={() => update((draft) => {
                draft.pages[pageKey].published = !draft.pages[pageKey].published;
              })}
              className={cn("relative h-6 w-11 rounded-full transition-colors", page.published ? "bg-accent" : "bg-muted/30")}
              aria-pressed={page.published}
            >
              <span className={cn("absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform", page.published ? "translate-x-5" : "translate-x-0")} />
            </button>
          </label>
        </div>
      </div>

      <fieldset className="rounded-2xl border border-line bg-surface/40 p-6">
        <legend className="px-2 font-display text-sm font-semibold uppercase tracking-[0.18em]">SEO</legend>
        <div className="space-y-4">
          {[
            { key: "title", label: "SEO title", type: "localized" as FieldType },
            { key: "description", label: "Meta description", type: "localizedText" as FieldType, rows: 4 },
            { key: "image", label: "Social image", type: "image" as FieldType },
            { key: "canonical", label: "Canonical URL", type: "text" as FieldType },
            { key: "indexable", label: "Allow indexing", type: "boolean" as FieldType },
          ].map((field) => (
            <FieldRenderer
              key={field.key}
              field={field as FieldDef}
              value={getByPath(page.seo, field.key)}
              onChange={(next) => patchSeo(field.key, next)}
            />
          ))}
        </div>
      </fieldset>

      <div className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">Sections</h2>
        {sections.map((section) => {
          const open = activeSection === section.key;
          return (
            <div key={section.key} className="overflow-hidden rounded-2xl border border-line bg-surface/40">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <button type="button" onClick={() => setActiveSection(open ? null : section.key)} className="flex-1 text-left">
                  <span className="block font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink">
                    {section.key.replace(/-/g, " ")}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted">{section.title?.en || section.body?.en || "—"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => patchSection(section.key, "enabled", !section.enabled)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em]",
                    section.enabled ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : "border-line text-muted",
                  )}
                >
                  {section.enabled ? "Visible" : "Hidden"}
                </button>
              </div>

              {open ? (
                <div className="space-y-4 border-t border-line p-5">
                  {sectionGroups(section.key).map((group) => (
                    <fieldset key={group.title} className="rounded-xl border border-line p-4">
                      <legend className="px-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">{group.title}</legend>
                      <div className="space-y-4">
                        {group.fields.map((field) => (
                          <FieldRenderer
                            key={field.key}
                            field={field}
                            value={getByPath(section, field.key)}
                            onChange={(next) => patchSection(section.key, field.key, next)}
                          />
                        ))}
                      </div>
                    </fieldset>
                  ))}

                  {Array.isArray(section.items) ? (
                    <SectionItemsEditor
                      items={section.items as unknown as Record<string, unknown>[]}
                      onChange={(next) => patchSection(section.key, "items", next)}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { SiteContent };
