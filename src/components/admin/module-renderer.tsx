"use client";

import { useState } from "react";

import { useAdmin } from "@/components/admin/admin-context";
import { CollectionEditor, PageEditor, SettingsEditor } from "@/components/admin/editors";
import { BackupPanel } from "@/components/admin/backup-panel";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { MediaLibraryPanel } from "@/components/admin/media-library";
import { MODULES, PAGE_CHOICES, findModule, sectionsForPage, type FieldGroup } from "@/lib/admin/config";
import { cn } from "@/lib/utils";

const BASE_SECTION_GROUPS: FieldGroup[] = [
  {
    title: "Section visibility",
    fields: [{ key: "enabled", label: "Section enabled", type: "boolean" }],
  },
  {
    title: "Headings",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "localized" },
      { key: "title", label: "Title", type: "localized" },
      { key: "subtitle", label: "Subtitle", type: "localized" },
      { key: "body", label: "Body copy", type: "localizedText", rows: 6 },
    ],
  },
  {
    title: "Buttons",
    fields: [
      { key: "primaryCtaLabel", label: "Primary button label", type: "localized" },
      { key: "primaryCtaHref", label: "Primary button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label", type: "localized" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
    ],
  },
  {
    title: "Media",
    fields: [
      { key: "image", label: "Section image", type: "image" },
      { key: "imageMobile", label: "Mobile section image", type: "image" },
    ],
  },
];

const PAGE_META: Record<string, { title: string; description: string }> = {
  home: { title: "Homepage", description: "Twelve editable sections make up the homepage." },
  about: { title: "About Us", description: "Story, mission, philosophy, facilities, team and CTA sections." },
  transformation: { title: "Transformation", description: "Stories, before/after gallery, categories and highlights." },
  membership: { title: "Membership", description: "Programs, plans, comparison, personal training, schedule and FAQ." },
  faq: { title: "FAQ", description: "Intro, question list and final CTA. Questions are managed in FAQ module." },
};

export function ModulePanel({ slug }: { slug: string }) {
  const { content } = useAdmin();
  const module = findModule(slug);
  const [pageKey, setPageKey] = useState(module?.pageKey ?? "about");

  if (!module) return <p className="text-sm text-muted">Unknown admin module.</p>;

  const header = (
    <div className="mb-8">
      <p className="eyebrow">{module.group}</p>
      <h1 className="display-md mt-3">{module.title}</h1>
      {module.description ? <p className="lede mt-3 max-w-2xl text-sm">{module.description}</p> : null}
    </div>
  );

  if (module.kind === "settings") {
    return (
      <div>
        {header}
        <SettingsEditor path={module.path ?? "settings"} groups={module.groups ?? []} />
      </div>
    );
  }

  if (module.kind === "collection" && module.collection) {
    return (
      <div>
        {header}
        <CollectionEditor config={module.collection} />
      </div>
    );
  }

  if (module.kind === "media") {
    return (
      <div>
        {header}
        <MediaLibraryPanel />
      </div>
    );
  }

  if (module.kind === "backup") {
    return (
      <div>
        {header}
        <BackupPanel />
      </div>
    );
  }

  if (module.kind === "dashboard") {
    return (
      <div>
        {header}
        <DashboardPanel />
      </div>
    );
  }

  if (module.kind === "pages") {
    const keys = module.slug === "homepage" ? ["home"] : ["about", "transformation", "membership", "faq"];
    return (
      <div>
        {header}
        {keys.length > 1 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPageKey(key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition-colors",
                  pageKey === key ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink",
                )}
              >
                {PAGE_CHOICES.find((choice) => choice.value === key)?.label ?? key}
              </button>
            ))}
          </div>
        ) : null}

        <PageEditor
          pageKey={pageKey}
          title={PAGE_META[pageKey]?.title ?? pageKey}
          description={PAGE_META[pageKey]?.description ?? ""}
          sectionGroups={() => BASE_SECTION_GROUPS}
        />
        <p className="mt-6 text-xs text-muted">
          {sectionsForPage(content, pageKey).length} sections available for this page. Hidden sections keep their content
          and can be re-enabled at any time.
        </p>
      </div>
    );
  }

  return null;
}

export { MODULES };
